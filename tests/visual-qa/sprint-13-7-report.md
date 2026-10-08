# Sprint 13.7 — Regression audit and manual acceptance handoff

Date: 8 October 2026 (Europe/Istanbul). Product: Mila Oyun Merkezi.

**Recommendation: READY FOR MANUAL QA.** The confirmed lifecycle and core offline defects described below are fixed. This is not production-release approval and does not mark Sprint 13 fully complete. Await physical Galaxy M52 acceptance results using [the device checklist](sprint-13-7-galaxy-m52-checklist.md).

## Test boundary

Tests ran locally in Microsoft Edge through the existing bundled Playwright runtime. Viewports: 360×800, 412×915, 768×1024 and 1440×900. Speech ownership tests use controlled SpeechSynthesis mocks; virtual timers do not emulate the hardware audio clock. AudioHelper oscillator behavior is covered by unit tests. PWA tests use a local HTTP server and real service-worker/cache APIs, including a fresh browser context switched offline.

Physical Galaxy M52, Samsung Internet/Android Chrome, installed Android TTS pronunciation, touch feel, gesture/navigation safe areas, orientation/URL-bar resizing and Android PWA update/installation were **not tested on hardware**. Browser dimensions do not substitute for those checks. No deployment was performed.

The repository currently reports all project files as untracked. There is no committed Sprint 13 diff available for historical comparison; this audit inspected the current source, prior sprint test suites and art-direction documentation. No player data, storage keys, score rules, category content, difficulty configuration, puzzle art, game names or public APIs were migrated or renamed.

## Sprint 13 regression matrix

PASS means the named implementation was verified by the stated source/unit/browser evidence, not physical-device acceptance. FAIL identifies a remaining limitation rather than hiding it. MANUAL DEVICE VERIFICATION REQUIRED identifies hardware/perception checks. NOT TESTED identifies unavailable tooling.

| Sprint | Requirement | Status | Evidence / boundary |
| --- | --- | --- | --- |
| 13.1 | Sıradaki Sayıyı Bul scales its number row without prompt overlap | PASS | 13.1 QA: four viewports, row bounds, both feedback states |
| 13.1 | Numeric and visual Hangisi Daha Büyük choices have a centered, neutral separator | PASS | Existing question renderer and 13.1 numeric/visual scenarios; separator does not encode a comparison answer |
| 13.1 | Hazine Kutuları has a balanced four-box layout | PASS | Four boxes asserted at every viewport; touch bounds checked |
| 13.1 | Shared correct/incorrect feedback stays separate from answer cards | PASS | All five 13.1 scenarios × two states × four viewports, plus math/asset suites |
| 13.1 | Decorative bear does not intersect feedback text | PASS | Rectangle/display checks in 13.1 QA; decoration yields on narrow screens |
| 13.1 | Four-choice Gölgesini Bul layout remains usable | PASS | Hard-mode card/feedback layout and actual QA launch |
| 13.1 | Home icon and explicit destinations remain connected | PASS | Menu has 🏠 Ana Sayfa; existing menu dispatch and game destination actions inspected; 13.7 browser uses Oyunlar button during cancellation |
| 13.1 | No horizontal overflow; child-sized answer targets on mobile/tablet/desktop | PASS | 13.1, 13.5 and 13.6 browser assertions |
| 13.1 | Actual Samsung touch targets, browser chrome, safe areas and rotation | MANUAL DEVICE VERIFICATION REQUIRED | CSS has safe-area handling; desktop emulation cannot validate Android gesture areas |
| 13.2 | Learning/Quick entry prepares and displays the actual first question/options before welcome | PASS | 13.2 QA retains the same question identity/options after welcome |
| 13.2 | No temporary question, duplicate preparation or early scoring during welcome | PASS | Lifecycle unit/browser assertions and disabled answer checks |
| 13.2 | Sayıyı Bul and Rengi Bul complete with consistent celebration timing | PASS | Two complete sessions per viewport; shared completion duration/settle path |
| 13.2 | Completion and Home narration do not overlap | PASS | Controlled speech ownership and oscillator completion tests; rapid navigation cancels old completion |
| 13.2 | Pause/Resume/Replay and starting another game preserve current state safely | PASS | 13.2/13.3/13.6 suites plus new cancelled-feedback and paused-delay cases |
| 13.2 | Old correct/retry feedback cannot redraw or schedule into another mini-game | PASS | Was FAIL in seven focused pre-fix cases; session guards and paused timer fix now pass, including six real browser switches |
| 13.3 | Turkish Harika/Muhteşem/Tebrikler use Turkish routing | PASS | voice-audio unit cases, including no Turkish voice and tr-CY fallback with tr-TR utterance language |
| 13.3 | English One/Five/Green/Yellow use English routing | PASS | Explicit sample utterance/voice assertions |
| 13.3 | Delayed voices, unavailable saved voice and unavailable SpeechSynthesis fail safely | PASS | Existing service discovery/fallback tests; no new voice implementation |
| 13.3 | Queue cancellation prevents narration overlap and stale Replay completion | PASS | Voice unit tests and 13.2/13.3/13.6 speech ownership assertions |
| 13.3 | Learning question → options → repeated question follows configured sequence | PASS | 13.3 sequence, highlights, rapid Replay, Pause/Resume tests |
| 13.3 | Quick Game retains question-only fast narration | PASS | 13.3 quick sequence and Replay assertions |
| 13.3 | Ses Hafızası reveals visuals only for correct matches; wrong guesses hide answers | PASS | Full memory sessions at 360/1440; incorrect state has no educational images |
| 13.3 | Pause during first or second card speech cannot strand an open card | PASS | Was FAIL in two pre-fix tests; cancelled new reveal now closes without an attempt or score; browser recovery reaches a real match |
| 13.3 | Voice quality, natural pronunciation, volume and actual device fallback | MANUAL DEVICE VERIFICATION REQUIRED | No Android TTS engine or audible device test available |
| 13.4 | adaniakadmin is created/selected with ordinary letter/space validation | PASS | Actual typed UI flow in 13.4 QA; no hyphen exception |
| 13.4 | Detection stays centralized and rejects raw old/similar identifiers | PASS | qa-profile tests; exact trimmed, case-sensitive identity; note input normalization caveat below |
| 13.4 | All 38 stages and all 13 mini-games, including math, are accessible | PASS | Actual stage/game launch loop; new math sessions for QA and normal players |
| 13.4 | Unlock access does not fake completion or persist a privilege flag | PASS | Zero fake completed stages, runtime capability omitted from saved JSON |
| 13.4 | Normal progression, player isolation and selected-profile reload are preserved | PASS | Child storage snapshot unchanged during QA play, normal last stage locked, profile switch/PWA reload tests |
| 13.5 | Seahorse, strawberry, tree and broccoli share the upgraded local art style | PASS | Fresh contact sheets/card screenshots visually inspected; canonical metadata source |
| 13.5 | All 84 canonical object vectors remain local, bounded and scalable | PASS | 133-file inventory/security/size tests; SVG decoding and square contain rendering |
| 13.5 | Shared object reuse includes memory only after a correct reveal | PASS | Registry equality and memory reveal checks; Sun/Moon remain their documented fallback |
| 13.5 | Four target visuals load offline before game warmup | PASS | Was FAIL in fresh-install test; all 17 bounded core objects now decode offline |
| 13.5 | Previously used non-core art remains cached offline | PASS | Orange fetched online once and decoded after offline reload; remaining assets retain on-demand cache |
| 13.5 | Entire Dinle ve Seç vocabulary uses one platform-independent art family | FAIL | Existing unmapped vocabulary still contains emojis/inline representations. Canonical family and four targets pass; no full emoji elimination claim |
| 13.5 | Puzzle scenes, mascot, navigation/theme and typography remain intact | PASS | No edits to those assets/components in 13.7; inventory and nearby regressions passed |
| 13.5 | Young-child recognition and physical-mobile rendering | MANUAL DEVICE VERIFICATION REQUIRED | Visual inspection is not a child-recognition study or Android rendering test |
| 13.6 | Addition visibly separates and combines quantities before answering | PASS | Real five-round sessions, early-tap guard, combined count/grid bounds |
| 13.6 | Addition operands 1–5, sum ≤10, gentle opening rounds | PASS | Focused seeded/exhaustion generation tests; existing Math content unchanged |
| 13.6 | Subtraction starting quantity 2–10, removed ≤start, remainder ≥0 | PASS | Generation/boundary tests including zero |
| 13.6 | Removal action finishes before input activates; remainder remains countable | PASS | Browser phase/input checks, Pause during movement, quantities 1–10 |
| 13.6 | Missing first/second addend and removed quantity have one intended answer | PASS | All three forms exercised; visual unknown group and solved quantity support |
| 13.6 | Exactly three unique plausible numeric choices, correct answer once | PASS | Thousands of generated rounds, bounded 0–10 choices |
| 13.6 | Session variety and immediate-repeat avoidance survive exhausted recent pool | PASS | Seeded sessions and 40 repeated starts per mode |
| 13.6 | Five-round completion, rewards, repeated-tap protection and clean replay | PASS | Complete sessions at four sizes; duplicate taps score once; completion waits for explicit navigation |
| 13.6 | Narration, retry, Pause, Home and Replay use shared systems | PASS | Turkish ownership, paused correct/retry/action phases, cancellation tests |
| 13.6 | Core math assets work offline on first play | PASS | All 12 arithmetic object assets are in the bounded 17-object offline core |
| 13.6 | Quantities 1/5/8/10, answers, feedback and completion fit mobile/tablet/desktop | PASS | 13.6 checks all quantities 1–10; fresh screenshots inspected |
| 13.6 | Normal/QA availability and existing Math scoring/progression remain unchanged | PASS | Existing availability rules, qa-profile/data-isolation suites, no Math generator edits |
| All | Installed Android PWA, real-device audio and touch acceptance | MANUAL DEVICE VERIFICATION REQUIRED | See device checklist; Sprint 13 remains pending acceptance |
| All | Lint / TypeScript typecheck / build | NOT TESTED | No package.json, TypeScript project or such command/configuration exists; no tooling introduced |

## Confirmed defects and fixes

| Issue | Root cause | Minimal fix | Files | Validation |
| --- | --- | --- | --- | --- |
| HIGH: old answer feedback could mutate a newly launched game | Missing/Shadow/Initial Letter handlers continued after an awaited cancelled speech request without checking their originating session | Capture and check the session before subsequent rendering/narration/round scheduling | app.js; new lifecycle/browser tests | Six pre-fix failing correct/retry continuation tests now pass; six browser navigation switches produce no page errors or stale delay |
| HIGH: a Pause cancellation could arm a timer after Pause had already suspended timers | scheduleNewMiniGame always started a live timer, including late promise continuations during Pause; Resume could then arm another | Keep the pending callback/duration but do not arm its timer while paused | app.js; new lifecycle/browser tests | Pre-fix paused scheduling test failed; inactive pending delay and exactly one Resume advance pass |
| HIGH: memory card could become permanently unmatchable after Pause during speech | New reveal happened before narration, but cancelled narration returned before recording firstCard/comparison | Close only the newly revealed, unmatched card on cancellation in the same active session; preserve any prior selected card | app.js; new lifecycle/browser tests | Two pre-fix reveal tests failed; first/second speech Pause then a real matching pair succeeds, with one genuine attempt/correct result |
| HIGH: new math/target/reveal assets could be missing offline on first play | Service worker cached object SVGs only after first use; shell installation did not download the objects required by the newly added games | Precache just 17 existing core SVGs and revise the cache suffix; all other objects/scenes remain first-use cached | sw.js; bounded-cache inventory test; new browser test | Fresh-install offline test initially failed for all 17; after fix all decode, with no gameplay warmup; first-use orange cache also passes |

The core preload adds **22,723 uncompressed bytes**, not a new asset library. SVG source files are unchanged. Cache suffix is art13-5-math13-6-qa13-7; application version and storage keys are unchanged. Existing worker activation/update policy remains intact.

## Automated commands and results

PowerShell browser setup:

```powershell
$env:NODE_PATH='C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
```

| Actual command | Result |
| --- | --- |
| node --test | 232 passed, 0 failed, 0 skipped after fixes (baseline: 223 passed) |
| node --test tests/sprint-13-7-lifecycle.test.js | 9 focused cases; before fixes 7 original cases failed and subsequently 2 memory cases failed; all pass in final suite |
| node --test tests/sprint-13-7-lifecycle.test.js tests/sprint-12-4-visual-release.test.js tests/voice-audio.test.js | Targeted lifecycle/cache/voice verification passed; exact sample routing expanded |
| node tests/visual-qa/sprint-13-1-qa.cjs | Five scenarios, both feedback states, four viewports passed; rerun with QA_SCREENSHOTS=1 |
| node tests/visual-qa/sprint-13-2-qa.cjs | Welcome identity/options, Pause, both complete sessions, audio ownership, rapid navigation passed at four sizes |
| node tests/visual-qa/sprint-13-3-qa.cjs | Sequence/highlights, rapid Replay, Pause/Resume, navigation, full memory reveal/completion passed at 360/1440 |
| node tests/visual-qa/sprint-13-4-qa.cjs | 38 stage launches, 13 mini-games, real answers, child isolation, typed profile and PWA reload passed |
| node tests/visual-qa/sprint-13-5-qa.cjs | All 84 contact-sheet assets rendered; four target cards/shared shadows, two feedback states, four sizes, offline target decode passed |
| node tests/visual-qa/sprint-13-6-qa.cjs | All three five-round sessions, retries, duplicate taps, replay/completion, quantities 1–10, Turkish ownership, normal/QA access passed |
| node tests/visual-qa/sprint-13-7-qa.cjs | Real service-worker fresh offline 17-core/first-use asset test, six cancelled-feedback switches, single resumed transition, memory Pause recovery passed |
| node --check for every .js/.cjs file outside .git/.agents/node_modules | 54 files passed |
| git diff --check | Exit 0; limited usefulness because repository files are untracked |

Syntax command used:

```powershell
node -e "const fs=require('fs'),path=require('path'),cp=require('child_process');let n=0;function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['.git','.agents','node_modules'].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(/\.(js|cjs)$/.test(e.name)){cp.execFileSync(process.execPath,['--check',p],{stdio:'pipe'});n++;}}}walk('.');console.log(n+' JavaScript syntax checks passed');"
```

Screenshots were inspected from the temporary QA outputs: narrow sequence/comparison/shadow/treasure, 412/desktop target objects, all 84 contact-sheet objects, memory completion, and math initial/correct/completion layouts. They are temporary verification artifacts, not deployed app assets. No lint/typecheck/build or physical hardware result is represented as a pass.

## Remaining issues / acceptance limitations

- **BLOCKER:** None confirmed by executed checks.
- **HIGH:** Physical Galaxy M52 acceptance, Android voice quality and installed-PWA behavior remain unverified. This blocks declaring Sprint 13 complete or approving production, not handing the build to manual QA.
- **MEDIUM:** Unmapped Dinle ve Seç vocabulary still mixes platform emojis/inline content with canonical SVGs; Sun/Moon memory reveals retain documented emojis. Completing that art coverage requires approved content/art work and is outside stabilization's no-redesign constraint.
- **LOW:** Non-core educational objects and puzzle scenes require their first online download before offline reuse. Core math, four target objects and canonical memory reveals are now available offline from installation. Full-catalog cold-offline availability is not claimed.
- **LOW:** Ordinary input filtering discards unsupported characters while typing. Consequently typing the old hyphenated spelling can produce the visibly normalized valid name adaniakadmin. The raw old identifier is rejected by validation/detection and is not an alias; normal input filtering was deliberately preserved as instructed. Check the displayed name during manual QA; no stricter QA-only validation was introduced.
- **LOW:** No committed repository baseline was available for a historical Git diff. Current-source audit and tests provide the evidence reported here.

## Exact files changed in Sprint 13.7

Modified:

1. app.js — session continuation guards, paused delay handling, cancelled memory reveal rollback.
2. sw.js — bounded 17-object offline core and cache revision.
3. tests/sprint-12-4-visual-release.test.js — explicit bounded-core cache assertion, retaining first-use caching for the rest.
4. tests/voice-audio.test.js — requested Turkish/English sample assertions.

Added:

5. tests/sprint-13-7-lifecycle.test.js — nine focused cancellation/Pause regressions.
6. tests/visual-qa/sprint-13-7-qa.cjs — real PWA and browser lifecycle checks.
7. tests/visual-qa/sprint-13-7-report.md — this report.
8. tests/visual-qa/sprint-13-7-galaxy-m52-checklist.md — physical acceptance checklist.

No new games, mechanics, dependencies, educational assets, visual redesign, deployment or Sprint 14 work were introduced. Wait for the completed device checklist before closing Sprint 13.
