# Sprint 13.5 — Educational object art

## Audit and scope

The current inventory contains 133 registered local SVGs: 84 canonical educational objects, 16 puzzle scenes and 33 interface/world/bonus/reward/decorative illustrations. EducationalObjects owns semantic IDs, Turkish labels, English aliases, categories and asset paths. Illustrations and LearningCategories already reuse this registry. No second metadata system was introduced.

All 84 object SVGs were rendered together and inspected. They used the same flat fills, heavy purple outlines and isolated highlights; the common material pass keeps their recognizable forms while giving the family consistent depth. Ten weak silhouettes received original vector redraws: seahorse, strawberry, tree, broccoli, orange, octopus, shark, whale, rice and pasta. Seahorse gains a curled tail and long snout; broccoli has clustered florets and a forked edible stem, distinct from the tree's wooden trunk and canopy. The orange is round; the octopus has eight arms; shark/whale and rice/pasta have distinguishing features.

Dinle ve Seç uses these canonical SVGs where vocabulary already maps to them. Numbers remain numerals and Colors remain simple color samples. Existing inline SVG/CSS educational shapes, math groups, buildings, directions and comparison layouts remain purpose-specific. Existing unmapped vocabulary (including jobs, actions, emotions, drinks, space and some animals/fruits/nature) still uses its previous emoji/inline representation. This sprint upgrades the canonical object family, not the entire vocabulary catalogue; platform-dependent art remains in that unmapped content and in Sun/Moon memory fallbacks. It is not claimed to have eliminated every educational emoji.

Puzzle scenes have their established layered scene style and were inspected without replacement. Mascots, world decorations, rewards, bonus graphics and functional UI icons retain their existing visual language. No Home/navigation/typography redesign was performed.

## Art direction for additions

- Use original repository-local SVG with transparent background and a 160 × 160 viewBox. No image links, raster/base64 payloads, embedded text or runtime dependencies.
- Recognition comes first: rounded silhouettes, soft proportions, front or modest three-quarter view, few meaningful details. Preserve real identifying features; do not add faces to every object.
- Use the existing warm saturated palette and purple outline (#493a85), generally 4 units with rounded joins/caps. Eyes and small dark details remain crisp.
- Light comes from the upper left. Gentle three-stop gradients move from a 30% lighter color through the base color to an 18% darker color. Add restrained highlights and overlapping simple shapes rather than realistic textures.
- Use a soft purple shadow (16% opacity, 3-unit offset, 1.6-unit blur). Leave room around the silhouette; the current 0.95 scale and small translation preserve shadow margin. Do not use complex filter stacks.
- Prefer consistent visual scale; never stretch assets. Card rendering uses object-fit: contain. Review at mobile card size and in mixed-object contact sheets, not only enlarged.
- Reuse the canonical object by semantic ID/English alias wherever a game needs that object. Hidden-answer games must not attach the object image before the existing reveal condition.
- Retain semantic accessibility at the component level. Do not embed labels in art or make visuals reveal the correct answer. Existing Dinle ve Seç generic choice labels intentionally hide the spoken target.

## Production, provenance and performance

These are original local vector edits: 74 existing project silhouettes receive a shared material treatment and ten are hand-drawn with SVG paths/ellipses in the local authoring script. No downloaded, stock, copyrighted character, hotlinked or unclear-license external artwork was introduced. The script is a development utility, never loaded by the application. It is idempotent for assets already marked soft-toy.

Object payload: 43,342 → 102,262 bytes (+58,920 bytes). Largest object: 1,913 bytes. All 133 registered SVGs total 172,451 bytes; largest registered file is 3,457 bytes. These are uncompressed file sizes. No library-wide runtime preload was added. Each game requests its current images; service-worker assets remain cached on demand. The art13-5 cache revision prevents the previous cache-first files from persisting after activation. Normal service-worker update lifecycle remains intact.

Ses Hafızası now resolves matched cards and completion reinforcement through the same registry. Unmatched and incorrectly paired cards remain ?/speaker visuals and contain no educational images. Sun/Moon retain existing fallback art because there are no canonical SVGs for them. The shared image helper now always applies the existing professional-object-image base class so listening/matching images also inherit object-fit: contain. Completion reinforcement wraps responsively. Only rendering changed; speech, matching, scoring and transitions are unchanged.

## Exact Sprint 13.5 file manifest

Modified application files: app.js, styles.css, sw.js.

Modified verification files: tests/sprint-12-4-visual-release.test.js (bounded asset budget and potato gradient assertion), tests/visual-qa/sprint-13-3-qa.cjs (canonical reveal assertions).

Added files: tests/visual-qa/sprint-13-5-art.cjs, tests/visual-qa/sprint-13-5-qa.cjs, tests/visual-qa/sprint-13-5-art-direction.md.

The following 84 modified files are all under assets/illustrations/objects/ (each name is an exact filename):

```text
object-cat.svg
object-dog.svg
object-rabbit.svg
object-hamster.svg
object-parrot.svg
object-mouse.svg
object-lion.svg
object-tiger.svg
object-elephant.svg
object-giraffe.svg
object-zebra.svg
object-monkey.svg
object-gorilla.svg
object-horse.svg
object-panda.svg
object-fish.svg
object-shark.svg
object-whale.svg
object-dolphin.svg
object-octopus.svg
object-seahorse.svg
object-apple.svg
object-banana.svg
object-orange.svg
object-strawberry.svg
object-watermelon.svg
object-grapes.svg
object-pear.svg
object-carrot.svg
object-tomato.svg
object-potato.svg
object-onion.svg
object-cucumber.svg
object-broccoli.svg
object-bread.svg
object-cheese.svg
object-egg.svg
object-rice.svg
object-pasta.svg
object-pizza.svg
object-ball.svg
object-teddy-bear.svg
object-doll.svg
object-kite.svg
object-puzzle.svg
object-blocks.svg
object-shirt.svg
object-pants.svg
object-dress.svg
object-coat.svg
object-shorts.svg
object-socks.svg
object-book.svg
object-pencil.svg
object-pen.svg
object-ruler.svg
object-scissors.svg
object-backpack.svg
object-chair.svg
object-table.svg
object-lamp.svg
object-clock.svg
object-bed.svg
object-sofa.svg
object-car.svg
object-bus.svg
object-train.svg
object-bicycle.svg
object-motorcycle.svg
object-truck.svg
object-boat.svg
object-ship.svg
object-sailboat.svg
object-ferry.svg
object-airplane.svg
object-helicopter.svg
object-hot-air-balloon.svg
object-glider.svg
object-tree.svg
object-flower.svg
object-mountain.svg
object-river.svg
object-forest.svg
object-rainbow.svg
```

## Verification

Run the existing node --test suite and syntax checks. Browser scripts use the available Edge/Playwright development runtime, not an application dependency. Sprint 13.5 renders all 84 assets in contact sheets, checks Dinle ve Seç and shared shadow choices with correct/incorrect feedback at 360×800, 412×915, 768×1024 and 1440×900, and reloads a controlled service worker offline before decoding the four target SVGs. Sprint 13.3 checks full memory reveal/completion and speech/navigation regression; Sprints 13.1, 13.2 and 13.4 retain their targeted regression checks. Screenshots are temporary QA artifacts, not runtime assets.

Physical Galaxy M52 testing and recognition testing with children are not available here; viewport checks and visual inspection do not claim either. No lint/typecheck/build scripts or package manifest exist in this repository. Sprint 13.6 was not started.
