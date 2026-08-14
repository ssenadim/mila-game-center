$ErrorActionPreference = "Stop"

$targetPath = "C:\Users\user\Documents\GameCenter\index.html"
$sessionsPath = "C:\Users\user\.codex\sessions"
$recoveredPath = Join-Path (Split-Path -Parent $targetPath) "index.recovered.html"

function ConvertTo-Lines([string] $text) {
    if ($null -eq $text) {
        return @()
    }

    $normalized = $text.Replace("`r`n", "`n").Replace("`r", "`n")
    $lines = @($normalized -split "`n", -1)
    if ($lines.Count -gt 0 -and $lines[-1] -eq "") {
        return @($lines[0..($lines.Count - 2)])
    }
    return $lines
}

function Find-Sequence(
    [string[]] $source,
    [string[]] $needle,
    [int] $minimumIndex,
    [int] $expectedIndex
) {
    if ($needle.Count -eq 0) {
        return [Math]::Max(0, [Math]::Min($expectedIndex, $source.Count))
    }

    $matches = [System.Collections.Generic.List[int]]::new()
    $lastStart = $source.Count - $needle.Count
    for ($candidate = [Math]::Max(0, $minimumIndex); $candidate -le $lastStart; $candidate++) {
        $matchesHere = $true
        for ($offset = 0; $offset -lt $needle.Count; $offset++) {
            if ($source[$candidate + $offset] -cne $needle[$offset]) {
                $matchesHere = $false
                break
            }
        }
        if ($matchesHere) {
            $matches.Add($candidate)
        }
    }

    if ($matches.Count -eq 0) {
        return -1
    }

    return @($matches | Sort-Object { [Math]::Abs($_ - $expectedIndex) }, { $_ })[0]
}

function Apply-UnifiedDiff([string] $content, [string] $diff, [string] $label) {
    $source = @(ConvertTo-Lines $content)
    $patchLines = @(ConvertTo-Lines $diff)
    $output = [System.Collections.Generic.List[string]]::new()
    $sourceCursor = 0
    $patchCursor = 0

    while ($patchCursor -lt $patchLines.Count) {
        $header = $patchLines[$patchCursor]
        if ($header -notmatch '^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@') {
            $patchCursor++
            continue
        }

        $expectedOldStart = [int] $Matches[1] - 1
        $patchCursor++
        $hunk = [System.Collections.Generic.List[string]]::new()
        while ($patchCursor -lt $patchLines.Count -and $patchLines[$patchCursor] -notmatch '^@@ ') {
            $line = $patchLines[$patchCursor]
            if ($line -notmatch '^\\ No newline at end of file$') {
                $hunk.Add($line)
            }
            $patchCursor++
        }

        $oldSequence = [System.Collections.Generic.List[string]]::new()
        foreach ($line in $hunk) {
            if ($line.Length -eq 0) {
                throw "Malformed empty patch line in $label"
            }
            if ($line[0] -eq ' ' -or $line[0] -eq '-') {
                $oldSequence.Add($line.Substring(1))
            }
        }

        $matchIndex = Find-Sequence $source $oldSequence.ToArray() $sourceCursor $expectedOldStart
        if ($matchIndex -lt 0) {
            $preview = ($oldSequence | Select-Object -First 3) -join ' | '
            [System.IO.File]::WriteAllText((Join-Path (Split-Path -Parent $targetPath) "index.partial.html"), $content, [System.Text.UTF8Encoding]::new($false))
            throw "Could not match hunk in $label near old line $($expectedOldStart + 1): $preview"
        }

        for ($index = $sourceCursor; $index -lt $matchIndex; $index++) {
            $output.Add($source[$index])
        }

        $matchedCursor = $matchIndex
        foreach ($line in $hunk) {
            $prefix = $line[0]
            $value = $line.Substring(1)
            switch ($prefix) {
                ' ' {
                    if ($matchedCursor -ge $source.Count -or $source[$matchedCursor] -cne $value) {
                        throw "Context mismatch in $label"
                    }
                    $output.Add($value)
                    $matchedCursor++
                }
                '-' {
                    if ($matchedCursor -ge $source.Count -or $source[$matchedCursor] -cne $value) {
                        throw "Removal mismatch in $label"
                    }
                    $matchedCursor++
                }
                '+' {
                    $output.Add($value)
                }
                default {
                    throw "Unexpected patch prefix '$prefix' in $label"
                }
            }
        }

        $sourceCursor = $matchedCursor
    }

    for ($index = $sourceCursor; $index -lt $source.Count; $index++) {
        $output.Add($source[$index])
    }

    return ($output -join "`n") + "`n"
}

$events = [System.Collections.Generic.List[object]]::new()
Get-ChildItem -LiteralPath $sessionsPath -Recurse -Filter '*.jsonl' -File | ForEach-Object {
    $sessionFile = $_.FullName
    Get-Content -LiteralPath $sessionFile -Encoding UTF8 | ForEach-Object {
        $line = $_
        if ($line -notlike '*patch_apply_end*' -or $line -notlike '*GameCenter*index.html*') {
            return
        }

        try {
            $entry = $line | ConvertFrom-Json
        } catch {
            return
        }

        if ($entry.type -ne 'event_msg' -or $entry.payload.type -ne 'patch_apply_end' -or -not $entry.payload.success) {
            return
        }

        foreach ($property in $entry.payload.changes.PSObject.Properties) {
            if ($property.Name -ceq $targetPath -or $property.Name -ceq 'index.html') {
                $events.Add([pscustomobject]@{
                    Timestamp = [datetime] $entry.timestamp
                    Change = $property.Value
                    Session = $sessionFile
                })
            }
        }
    }
}

$orderedEvents = @($events | Sort-Object Timestamp)
if ($orderedEvents.Count -ne 77) {
    throw "Expected 77 successful index.html events, found $($orderedEvents.Count)."
}

$content = $null
$appliedCount = 0
foreach ($event in $orderedEvents) {
    $change = $event.Change
    $eventUtc = $event.Timestamp.ToUniversalTime().ToString("o")
    if ($event.Timestamp.ToUniversalTime().ToString("o").StartsWith("2026-07-26T14:06:13.148")) {
        $currentLines = @(ConvertTo-Lines $content)
        $snapshotHead = @(Get-Content -LiteralPath (Join-Path (Split-Path -Parent $targetPath) "index.snapshot-head.html") -Encoding UTF8)
        if ($currentLines.Count -lt 107 -or $snapshotHead.Count -ne 106) {
            throw "Cannot apply the verified July 26 snapshot checkpoint."
        }
        $content = (($snapshotHead + $currentLines[106..($currentLines.Count - 1)]) -join "`n") + "`n"
    }
    if ($eventUtc.StartsWith("2026-08-07T20:05:32.685")) {
        $content = $content -replace 'styles\.css\?v=[^"]+', 'styles.css?v=8.4'
        $content = $content -replace 'js/services/SpeechService\.js(?:\?v=[^"]+)?', 'js/services/SpeechService.js?v=8.4'
        $content = $content -replace 'js/services/AudioHelper\.js(?:\?v=[^"]+)?', 'js/services/AudioHelper.js?v=8.4'
        $content = $content -replace 'js/LearningPath\.js(?:\?v=[^"]+)?', 'js/LearningPath.js?v=8.3.6'
        $content = $content -replace 'js/NumberLearning\.js(?:\?v=[^"]+)?', 'js/NumberLearning.js?v=8.3.5.3'
        $content = $content -replace 'app\.js\?v=[^"]+', 'app.js?v=8.4'
        $appliedCount++
        continue
    }
    if ($eventUtc.StartsWith("2026-08-07T21:43:54.416")) {
        $currentLines = @(ConvertTo-Lines $content)
        $snapshotHead = @(Get-Content -LiteralPath (Join-Path (Split-Path -Parent $targetPath) "index.snapshot-head-aug7.html") -Encoding UTF8)
        if ($currentLines.Count -lt 72 -or $snapshotHead.Count -ne 71) {
            throw "Cannot apply the verified August 7 snapshot checkpoint."
        }
        $content = (($snapshotHead + $currentLines[71..($currentLines.Count - 1)]) -join "`n") + "`n"
    }
    $label = "$($event.Timestamp.ToString('o')) from $($event.Session)"
    if ($change.type -eq 'add') {
        if ($null -ne $content) {
            throw "Unexpected second add event at $label"
        }
        $content = [string] $change.content
    } elseif ($change.type -eq 'update') {
        if ($null -eq $content) {
            throw "Update encountered before add at $label"
        }
        $content = Apply-UnifiedDiff $content ([string] $change.unified_diff) $label
    } else {
        throw "Unexpected change type '$($change.type)' at $label"
    }
    $appliedCount++
}

if ([string]::IsNullOrWhiteSpace($content)) {
    throw "Recovered content is empty."
}

$requiredFragments = @(
    '<title>Mila Oyun Merkezi |',
    'id="parent-dashboard"',
    'app.js?v=9.0',
    'js/services/SpeechService.js',
    'js/LearningPath.js',
    '</html>'
)
foreach ($fragment in $requiredFragments) {
    if (-not $content.Contains($fragment)) {
        throw "Recovered content is missing required fragment: $fragment"
    }
}

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($recoveredPath, $content, $utf8NoBom)

$fileInfo = Get-Item -LiteralPath $recoveredPath
$lineCount = (ConvertTo-Lines $content).Count
Write-Output "RECOVERED_PATH=$recoveredPath"
Write-Output "EVENTS_APPLIED=$appliedCount"
Write-Output "BYTES=$($fileInfo.Length)"
Write-Output "LINES=$lineCount"
Write-Output "LAST_EVENT=$($orderedEvents[-1].Timestamp.ToString('o'))"
