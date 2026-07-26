## Project

This repository contains an educational browser game for preschool children.

The project is already working and is developed through small incremental updates.

### Product Identity

* The permanent product name is "Mila Oyun Merkezi".
* Do not rename the application to Mila Learning Adventure, Learning Center, Kids Learning App or another product name.
* English may be used inside educational activities, but the product identity and primary Turkish interface name remain "Mila Oyun Merkezi".
* The product is an educational game center, not a single quiz or a single learning adventure.

### Product Purpose

* Mila Oyun Merkezi exists to transform passive screen consumption into active educational play.
* The product does not attempt to eliminate all screen usage.
* Its primary goal is to offer children an interactive alternative to prolonged passive viewing on platforms such as YouTube and Netflix.
* Prefer activities that require listening, choosing, matching, sorting, counting, reasoning, remembering or interacting.
* Avoid experiences where the child only watches a long animation, video or autoplay sequence.
* Rewards, animations and sounds should support participation rather than turn the application into another passive content feed.

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
* Preserve the current technology stack.
* Do not introduce a framework, router, state library, database, backend or external dependency unless a future sprint explicitly requires it.

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
* Instructions must be short, concrete and child-friendly.
* Activities must not depend on advanced reading ability.
* Prefer visual examples, spoken guidance, large touch controls and immediate feedback.
* Educational difficulty may increase gradually, but every activity must begin with an accessible level.
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

## Language Strategy

* Turkish remains the primary application interface language.
* English remains the current educational language focus.
* English educational speech and vocabulary may coexist with Turkish navigation and guidance.
* Do not implement multi-language architecture, language selection screens or translation systems unless a future sprint explicitly requests them.
* Do not expand the current scope into multiple spoken languages.

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

## Content Expansion and Completeness

* When a sprint explicitly lists several categories, game types, learning stages or content groups, implement the complete requested list.
* Do not silently reduce a broad content request to only a few familiar examples such as animals and fruits.
* Examples in a prompt are part of the required scope when they are presented as an explicit target list.
* Before completing a content sprint, compare the implementation against every requested category or feature.
* Report any requested item that could not be completed.
* Do not claim completion when only a subset of the requested roadmap item was implemented.
* Prefer centralized, extensible content models over repeated hard-coded conditional blocks.
* Content groups should be data-driven where the existing architecture allows it.
* Every new content category must include enough valid and distinct items for the game or learning activity that uses it.
* Do not expose empty, incomplete or unusable categories.
* Validate category eligibility according to each activity's requirements.
* For example, a Matching Pairs category requiring 8 unique pairs must not be visible with fewer than 8 valid unique items.
* Avoid duplicate answers, ambiguous visuals and content that cannot be represented clearly.
* Integrate new categories into the relevant menus, selectors, progress systems and tests where applicable.

## Educational Math

* Mila Oyun Merkezi may teach age-appropriate early mathematics.
* Supported early-math concepts may include number recognition, counting, number ordering, greater and smaller comparison, simple addition and simple subtraction.
* Initial addition and subtraction exercises should use non-negative whole numbers suitable for young children.
* Initial subtraction exercises must not produce negative results.
* Prefer small values, visual objects and clear answer choices.
* Increase difficulty gradually.
* Avoid timers or pressure that make early learning stressful unless a sprint explicitly introduces an optional challenge mode.

## Mini-game Principles

* New Mini Games must each have a distinct educational or cognitive purpose.
* Do not create multiple games that are only cosmetic variations of the same interaction.
* Each Mini Game should define its learning goal, child interaction, start flow, completion condition, replay behavior, speech behavior, cleanup behavior and mobile and tablet behavior.
* Mini Games launch directly from the Mini Games Center unless the game genuinely requires a focused category or difficulty selection first.
* Do not make Mini Games depend on the normal Learning Center "Hadi baÅŸlayalÄ±m" action.

## Roadmap Integrity

* Implement only the sprint currently requested.
* Do not skip forward to later roadmap items.
* Do not partially implement several future sprints instead of completing the active sprint.
* Preserve the following roadmap intent:
  * Sprint 8.1: New Mini Games
  * Sprint 8.2: New Learning Categories
  * Sprint 8.3: New Learning Path Sections
  * Sprint 8.4: Voice and Audio Experience
  * Sprint 8.5: Daily Goals and New Bonuses
* Parent Experience remains postponed until a later explicit request.
* Multi-language support is not part of Sprint 8.
* Release and production work must not be mixed into content-expansion sprints unless required for regression safety.

## Definition of Done for Roadmap Prompts

Before marking a sprint complete:

1. Read the entire sprint prompt again.
2. Build a checklist of every explicit feature and category.
3. Verify every checklist item against the implementation.
4. Confirm all required screens and navigation entries are connected.
5. Confirm mobile and tablet interaction.
6. Confirm speech does not overlap.
7. Confirm replay resets temporary state.
8. Confirm navigation cleans active timers, callbacks, speech and animations.
9. Run available automated tests.
10. Perform targeted manual regression checks.
11. Clearly list incomplete items instead of hiding them.
12. Do not describe planned or placeholder code as completed functionality.

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
