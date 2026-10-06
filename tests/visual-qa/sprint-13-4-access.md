# Sprint 13.4 QA access inventory

Create a custom player named `adaniakadmin`. It uses ordinary letter/space player-name validation with no QA exception. Existing whitespace trimming applies; case remains significant. The profile reloads through the existing player selector and storage. No new child-facing controls are added.

## Learning Path: all 38 current stages

These stages are accessible immediately. Access does not mark them completed; completion counts, stars and badges still require real play.

| Group | Stages |
| --- | --- |
| İlk Keşifler | Renkleri Tanı; Şekilleri Tanı; Sayıları Tanı; Harfleri Tanı |
| Kelime Dünyası | Hayvanlar; Meyveler ve Sebzeler; Taşıtlar; Vücudumuz; Eşyalar; Doğa ve Uzay |
| Sayılar Dünyası | Nesneleri Say; Sayıları Sırala; Önceki ve Sonraki Sayı; Büyük Sayıyı Bul; Küçük Sayıyı Bul; Eşit Miktarları Bul |
| İlk İşlemler | Toplamaya Hazırlık; İki Sayıyı Topla; Görsellerle Toplama; Çıkarmaya Hazırlık; Büyük Sayıdan Küçük Sayıyı Çıkar; Görsellerle Çıkarma; Karışık İşlemler |
| Düşün ve Bul | Hangisi Farklı?; Hangisi Eksik?; Örüntüyü Tamamla; Doğru Sırayı Bul; Gölgesini Bul; Aynı Grubu Bul; Basit Labirent |
| Günlük Hayat | Duygular; Hava Durumu; Mevsimler; Konum Kavramları; Zıt Kavramlar; Günlük Eylemler; Saatlere Hazırlık; Para Kavramına Hazırlık |

## Existing game access

Learning Mode and Quick Game retain all existing category packs and valid custom-category choices.

All ten mini-games remain available: Eşini Bul, Dinle ve Seç, Sayıyı Bul, Rengi Bul, Grupla, Hangisi Eksik?, Gölgesini Bul, İlk Harfi Bul, Ses Hafızası and Yapboz.

Existing selectable variants remain available:

- Gölgesini Bul: Kolay (2 choices), Zor (4 choices).
- Ses Hafızası: Kolay (3 pairs), Orta (4 pairs), Zor (6 pairs).
- Yapboz: Kolay (2×2), Orta (3×2), Zor (3×3), Çok Zor (4×4), with all existing puzzle scenes.
- All eligible Matching categories and all existing Sorting content pairs.
- The five bonuses retain their normal triggers and rewards; no bonus frequency or gameplay rule is bypassed.

Mini-games and their difficulty selectors had no progression lock, so they require no extra override. Adaptive and within-session difficulty continue normally. Content validity, required category selection, unavailable browser speech and unimplemented-content checks are preserved.

## Persistence and verification

QA results are persisted under the existing `adaniakadmin` player-scoped keys. Only genuinely finished stages enter its completion map. Child progress is neither copied nor modified. The `qaProfileAccess` property exists only on loaded runtime progress and is excluded from persistence; it is recomputed from the active player on every load.

Automated verification covers exact-name detection, normal locks, all 38 actual stage launches, all 10 mini-game launches, selectable variants, real QA answers, unchanged Mila-scoped storage, profile switching and service-worker/PWA reload. Sprints 13.1–13.3 browser regression suites also pass.

Run `node --test` for unit tests. Browser checks require the available Playwright runtime in `NODE_PATH` and installed Microsoft Edge: `node tests/visual-qa/sprint-13-4-qa.cjs`.

Physical Samsung Galaxy M52 testing remains to be performed. No deployment or cache-version change is included in this sprint.
