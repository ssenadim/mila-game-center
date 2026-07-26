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
* Do not use an ambiguous generic "Geri" action inside child-facing game screens.
* Child-facing navigation actions must clearly communicate their destination; prefer explicit labels such as "Ana Sayfa", "Oyunlar" or "Öğrenme Yolu".
* Keep navigation placement consistent across similar game screens.
* Do not rely only on the browser back action for child-facing navigation.
* Child-facing replay actions should use understandable text labels such as "Yeni Oyun" or "Tekrar Oyna".
* Do not rely on an icon without a text label when an action creates a new session.

## Application View Navigation

### App-like View Navigation

* The application may remain a single-page and single-index.html experience, but primary areas must behave as separate application views.
* Do not build the main navigation as anchors or scroll-to-section behavior inside one long page.
* Selecting a primary navigation destination must hide unrelated primary content and show only the selected view.
* Primary areas such as Home, Learning, Mini Games, Learning Path, Rewards and Player Selection must not all remain expanded on the same screen.
* Keep each primary view focused on one user intention.
* Avoid requiring children to scroll through unrelated areas to reach a selected destination.
* On mobile and tablet, prefer view switching over long dashboard-style vertical pages.

### Home Screen

* The Home screen must be a compact application hub, not a container for every feature.
* Show concise entry points to major areas rather than rendering the complete contents of those areas.
* Detailed player selection, learning configuration and Mini Game lists should appear only inside their relevant views.
* The currently selected player may be represented on Home with a compact status and an explicit Player Change action.

### Navigation State

* Use the existing screen and hidden-state system where possible.
* A primary navigation action should:
  * close the current primary view
  * open the requested primary view
  * reset the document position appropriately
  * move focus to the new view when suitable
* Do not introduce a routing framework solely to switch existing single-page views.
* Do not use fragile arbitrary timeouts for navigation, focus or scrolling.

### Child-facing Application Design

* A child should see only the controls and choices relevant to the current activity.
* Do not place Learning controls, Mini Game controls and Player Selection controls together in one continuously expanded page.
* Avoid scroll-dependent discovery for core application destinations.

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
* When a child must read a word, label or question to continue, consider providing a nearby listen action through the existing speech system.
* A listen action must read only the relevant current content.
* Changing questions or leaving the screen must cancel obsolete listen speech.

## Gameplay

* Preserve Learning Mode and Quick Play behavior.
* Preserve scoring, streaks, stars, stickers and adaptive-learning behavior.
* Preserve Bonus Mode frequency and rewards unless explicitly requested.
* Do not create duplicate timers, callbacks, event listeners or answer handlers.
* Prevent repeated taps from producing duplicate scoring or transitions.
* Keep question content within the currently selected category pack.
* Do not generate duplicate answers or questions without a valid correct answer.
* Timers may show how long an activity took when this improves the experience.
* Do not turn completion time into pressure, ranking, pass/fail or competition unless a future sprint explicitly requests it.
* Prefer showing elapsed time only after activity completion.
* Before navigating between game states or screens, clear obsolete timers, callbacks, speech, feedback, celebrations and animation state.
* Previous-screen feedback or animations must never visually overlap the next screen.
* Do not solve transition overlap only by increasing timeout durations; coordinate state cleanup and transition timing explicitly.
* Starting a new game must reset temporary session state cleanly without clearing permanent player progress.

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

These are repository-wide interaction principles. Do not add game-specific dimensions, category lists, content values or sprint implementation details to this file.
