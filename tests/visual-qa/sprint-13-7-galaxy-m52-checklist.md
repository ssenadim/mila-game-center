# Samsung Galaxy M52 — Sprint 13 acceptance checklist

Build handoff: Sprint 13.7; expected cache revision ends qa13-7. Test date, tester, Android version, Chrome/Samsung Internet version, browser versus installed PWA, selected profile and Turkish/English voice names: record before testing.

For every item record PASS / FAIL / NOT TESTED, steps, expected/actual result and a screenshot or short recording for failures. Do not mark a target object passed unless it was actually seen. Run portrait with browser bars visible and collapsed; repeat important layouts in landscape and installed-PWA mode. Do not clear another child's saved progress. Use a separate test installation/profile for fresh-install checks.

## 1. Entry, profiles and navigation

- [ ] Open online, allow service-worker installation, then close all app tabs and reopen so the latest worker can activate. Confirm the tested build/revision.
- [ ] Create adaniakadmin using normal player-name entry; confirm the displayed name before accepting. Switch away and back, reload, and verify it stays selected.
- [ ] QA profile can open all 38 Learning Path stages without those stages showing fake completion. All 13 mini-game entries, including Sayılarla Oyna, are available.
- [ ] Switch to a normal child profile. Its locked stages, stars, stickers and prior results remain unchanged after QA play.
- [ ] Check raw old/similar names are not QA identities. Note that the normal typing filter removes punctuation: entering a hyphen may change the displayed name to the valid QA spelling. Record the final displayed name rather than assuming punctuation was saved.
- [ ] Open the menu: 🏠 Ana Sayfa is present. Ana Sayfa, Oyunlar, Öğrenme Yolu and player switching show only their intended view and start at the appropriate document position.
- [ ] Rapidly use the game destination/menu Home controls, then launch a different game. No old speech, feedback, timer or celebration follows into it.

## 2. Learning Mode and Quick Game

- [ ] Start Learning Mode. The real question and every option are visible during welcome speech; do not change after welcome. Tap early: no score or question advancement.
- [ ] Listen to question, each option and repeated question according to the selected narration settings. Highlight matches the spoken option. No speech overlaps.
- [ ] Press Replay repeatedly, Pause during an option, Resume, then leave during narration. The current question remains stable; obsolete speech stops.
- [ ] Start Quick Game: faster question-only narration remains intact. Pause/Resume/Replay and navigation work without duplicate scoring.
- [ ] Play correct and incorrect answers; encouragement remains gentle and visible. Saved results still belong to the selected player.

## 3. Sıradaki Sayıyı Bul / Hangisi Daha Büyük

- [ ] Observe narrow-screen multi-digit number sequences: numbers and instruction never collide, every choice is readable and tappable.
- [ ] Check Hangisi Daha Büyük with two numbers and with two object visuals. Separator stays centered, visible and neutral; it never indicates the winning side.
- [ ] Repeat correct/incorrect feedback and orientation change. No horizontal scrolling, clipped numbers, bear/text collision or answer-card overlap.

## 4. Hazine Kutuları and Gölgesini Bul

- [ ] Treasure bonus shows four balanced boxes with large comfortable targets. Tap each eligible box; rewards and bonus frequency behave normally.
- [ ] Start Gölgesini Bul in Zor/four-option mode. Source and silhouettes fit, cards remain distinct, and correct/retry feedback does not touch the bottom cards.
- [ ] During correct and retry speech, navigate to Oyunlar and start a math game. No old shadow cards/round appear in the math screen.
- [ ] Pause during correct feedback and Resume quickly. Exactly one next round appears, without skipping or double scoring.

## 5. Sayıyı Bul / Rengi Bul completion

- [ ] Complete a session of each. Feedback remains long enough to understand, with consistent celebration timing.
- [ ] Listen for One/Five and Green/Yellow: English voice/language is appropriate. Home narration starts only after completion narration is finished or explicitly cancelled.
- [ ] Leave rapidly during completion, then start another game. No delayed callback unexpectedly returns Home.

## 6. Dinle ve Seç and educational visuals

- [ ] Observe seahorse, strawberry, tree and broccoli during relevant activities/sessions. Record unseen targets as NOT TESTED, not PASS.
- [ ] Objects are recognizable, unstretched, unclipped and visually distinct at mobile size; tree and broccoli are not confused.
- [ ] Inspect mixed-object cards, correct and incorrect feedback. No decoration obscures a choice or instruction.
- [ ] Note existing emoji vocabulary separately; do not treat the canonical SVG family as proof of complete emoji removal.
- [ ] Play with the device's available Turkish/English voices and fallback settings. Harika, Muhteşem and Tebrikler sound natural and gentle, without English pronunciation leaking into Turkish.

## 7. Ses Hafızası

- [ ] Start an easy session, then hard mode. Covered cards hide the identity; wrong pairs never expose answer art.
- [ ] Correct pairs reveal the corresponding object, stay matched and count once. Complete the session and check completion/replay.
- [ ] Pause while the first newly opened card is speaking. Resume: it must be playable again; complete its pair.
- [ ] Open the first card normally, then Pause while the second card speaks. Resume: the prior selected card remains usable and the interrupted card can be selected again. No extra attempt/score is awarded for cancellation.
- [ ] Leave during a reveal and start another game; no old memory state follows it.

## 8. Three math mini-games

- [ ] Toplama Macerası: two separated groups and a clear plus appear. Spoken instruction explains Birleştir. Tap it: objects combine calmly into one countable group; choose the total.
- [ ] Çıkarma Macerası: see the starting quantity, then some objects leave/fade. The remainder is clear. Tap during movement: no answer is accepted. Pause during movement and Resume: same problem, one completed action.
- [ ] Eksik Sayıyı Bul: observe both missing-addend positions and missing removed quantity across rounds. Visual groups support the missing quantity; there is one valid answer.
- [ ] Across all three observe quantities 1, 5, 8 and 10 where generated. Objects never overlap and remain easy to count; choices are unique and comfortably tappable. Subtraction never goes negative; sums do not exceed 10.
- [ ] Try a wrong choice, retry correctly, and rapidly tap the correct answer twice. Score/progress advances once, with gentle encouragement.
- [ ] Each session finishes after five rounds. Reward popups finish before the next counting task. Completion remains until choosing Tekrar Oyna or Oyunlar.
- [ ] Replay starts a fresh short session. Pause during narration/retry/correct feedback and Resume, then Home and another game: no stranded controls, skipped rounds or stale feedback.
- [ ] Repeat all three with QA and a normal player. Availability and player-specific results match the existing rules.

## 9. Offline, device chrome and performance

- [ ] In a separate fresh test installation, open online only to install/update the PWA, then enable airplane mode and reopen. All three math games' core object visuals work before any gameplay warmup.
- [ ] Check the four target SVGs and canonical memory reveals offline when encountered. Sun/Moon use their existing fallback visuals.
- [ ] Visit a non-core object/puzzle online, then reuse it offline. First-use caching still works. Unvisited non-core art is not guaranteed cold-offline; record that limitation rather than resetting data.
- [ ] Toggle browser bars, rotate, use Android gesture navigation and optionally fullscreen. No horizontal scrolling, clipped answer targets or safe-area collision.
- [ ] Listen to narration and sound effects with normal volume, mute effects, Replay, Pause and Home. No stacked audio, harsh effect or repeated browser API prompt.
- [ ] Reopen after backgrounding the app and after a later online worker update. Existing player data remains intact; no obsolete session resumes unexpectedly.

## Acceptance decision

Record blocking/high issues first, with reproducible steps. Return this completed checklist and device evidence before declaring Sprint 13 complete. Desktop browser QA alone is not production release approval. Sprint 14 should not start as part of this acceptance pass.
