## Project

This repository contains an educational browser game for preschool children.

The project is already working and is developed through small incremental updates.

## Mandatory Development Rules

* Treat every task as an incremental update.
* Preserve all existing working features.
* Implement only the requested feature.
* Do not redesign unrelated parts of the application.
* Do not perform broad refactors.
* Do not reorganize files.
* Do not change the project structure.
* Do not split JavaScript files unless the task explicitly requires it.
* Do not rename existing functions or variables unless required for correctness.
* Do not replace working systems with new abstractions.
* Do not introduce frameworks or external libraries unless explicitly requested.
* Prefer the smallest safe code change.
* Reuse existing state, utilities, components, styles and game flows.
* Do not prepare unrelated future features.
* Do not change behavior outside the current task.

## Data Safety

* Preserve all existing localStorage data.
* Never reset player progress unless explicitly requested.
* Preserve player-specific stars, stickers, statistics, streaks, learning data and preferences.
* Never mix progress between players.
* Use the currently selected player from the existing player-selection state.
* Do not introduce a second source of truth for player identity.
* Handle missing or corrupted saved data without crashing.
* Do not redesign or migrate storage unless explicitly required.

## Child Experience

* The primary audience is preschool children, approximately five years old.
* Keep interactions simple, visual and touch-friendly.
* Avoid excessive text.
* Avoid harsh sounds or discouraging messages.
* Do not introduce flashing, frightening or stressful effects.
* Keep buttons large enough for tablet use.
* Preserve responsive behavior on desktop, mobile and tablet.
* Avoid unnecessary scrolling and horizontal overflow.
* Turkish characters and player names must display safely.

## Speech

* Preserve the existing speech queue and cancellation behavior.
* Do not allow overlapping speech.
* English content must use the existing English voice logic.
* Turkish content must use the existing Turkish voice logic.
* Do not accidentally reuse a voice from a previous utterance.
* Pause, Resume, Replay, Home and question transitions must cancel obsolete speech safely.
* Spoken and visible personalized messages must use the same active player.
* Do not hardcode “Mila” as the active player.
* If no player name is available, use a generic message rather than a specific default name.
* Do not add speech to every correct answer unless explicitly requested.

## Gameplay

* Preserve Learning Mode and Quick Play behavior.
* Preserve scoring, streaks, stars, stickers and adaptive-learning behavior.
* Preserve Bonus Mode frequency and rewards unless explicitly requested.
* Do not create duplicate timers, callbacks, event listeners or answer handlers.
* Prevent repeated taps from producing duplicate scoring or transitions.
* Keep question content within the currently selected category pack.
* Do not generate duplicate answers or questions without a valid correct answer.

## Browser APIs

* Fullscreen and Wake Lock features must fail gracefully when unsupported.
* Handle rejected browser API promises without interrupting gameplay.
* Never request duplicate Wake Locks.
* Keep fullscreen state synchronized with browser fullscreen events.
* Do not force fullscreen repeatedly.

## Scope and Verification

Before making changes:

1. Inspect the existing implementation.
2. Identify the smallest relevant code area.
3. Reuse current behavior rather than replacing it.

After making changes:

1. Verify the requested feature.
2. Check nearby existing behavior for regressions.
3. Report which files were changed.
4. Briefly summarize what was implemented.
5. Report any limitation that could not be resolved.

Do not implement recommendations or optional future work unless explicitly requested.
