(function initializeLearningCategories(root) {
  "use strict";

  const GROUPS = [
    { id: "basics", title: "Temel Öğrenme", icon: "🌟" },
    { id: "animals", title: "Hayvanlar Dünyası", icon: "🐾" },
    { id: "food", title: "Yiyecekler", icon: "🍽️" },
    { id: "daily", title: "Günlük Hayat", icon: "🏠" },
    { id: "self", title: "Ben ve Çevrem", icon: "🧒" },
    { id: "world", title: "Dünya ve Doğa", icon: "🌍" },
    { id: "thinking", title: "Düşünme Becerileri", icon: "🧠" }
  ];

  const GENERAL_VOCABULARY_IDS = [
    "Animals", "Fruits", "Vegetables", "Foods", "Drinks", "Vehicles", "SeaAnimals", "Insects", "Dinosaurs",
    "Birds", "FarmAnimals", "WildAnimals", "Pets", "HomeItems", "KitchenItems", "BathroomItems", "Toys",
    "Clothes", "ShoesAccessories", "Body", "Face", "Jobs", "SchoolItems", "DailyLife", "Nature", "Space",
    "Places", "Actions", "EnglishWords"
  ];

  const wordId = value => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const shuffle = (items, random = Math.random) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const value = Number(random());
      const next = Math.min(index, Math.max(0, Math.floor((Number.isFinite(value) ? value : 0) * (index + 1))));
      [result[index], result[next]] = [result[next], result[index]];
    }
    return result;
  };
  const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${body}</svg>`;
  const colorSvg = color => svg(`<circle cx="60" cy="60" r="47" fill="${color}" stroke="#493a85" stroke-width="5"/>`);
  const shapeSvg = body => svg(`${body}<rect x="2" y="2" width="116" height="116" rx="15" fill="none" stroke="#ffffff" stroke-width="4"/>`);
  const sceneSvg = body => svg(`<rect width="120" height="120" rx="14" fill="#eef9ff"/>${body}`);
  const dinoSvg = (color, feature, longNeck = false) => sceneSvg(
    longNeck
      ? `<path d="M18 79q12-32 42-20l18-43q6-10 14-2l-8 50q19 10 16 25H38q-15 0-20-10z" fill="${color}"/>${feature}`
      : `<path d="M15 72q18-32 53-19l19-15 17 8-15 16q18 10 13 29H35q-15 0-20-19z" fill="${color}"/><path d="M40 86v22M76 86v22" stroke="${color}" stroke-width="10"/>${feature}`
  );

  function vocab(id, title, icon, group, entries, description = "Resmi tanı, İngilizce kelimeyi bul.") {
    return {
      id, title, icon, group, description, strategy: "vocabulary", minimumItemCount: 12,
      supportedModes: ["learning", "quick"], speechEnabled: true,
      items: entries.map((entry, index) => {
        const [wordEn, visual, visualSvg] = entry;
        return { id: `${id.toLowerCase()}-${wordId(wordEn) || index}`, wordEn, speechValue: wordEn, visual, visualSvg };
      })
    };
  }

  const categories = [
    {
      id: "Colors", title: "Renkler", icon: "🎨", group: "basics", description: "Renkleri İngilizce öğren.",
      strategy: "color", minimumItemCount: 12, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: [
        ["Red", "#e94b4b"], ["Blue", "#3578d8"], ["Yellow", "#f4ce3d"], ["Green", "#42a95f"],
        ["Orange", "#ef8d32"], ["Purple", "#8758c7"], ["Pink", "#ef83b4"], ["Brown", "#8b5b3e"],
        ["Black", "#24212d"], ["White", "#fffdf8"], ["Gray", "#8b9099"], ["Turquoise", "#35c6c3"]
      ].map(([wordEn, color]) => ({ id: `color-${wordEn.toLowerCase()}`, wordEn, speechValue: wordEn, visualSvg: colorSvg(color), color }))
    },
    {
      id: "Shapes", title: "Şekiller", icon: "🔷", group: "basics", description: "Şekilleri tanı ve adlandır.",
      strategy: "shape", minimumItemCount: 10, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: [
        ["Circle", '<circle cx="60" cy="60" r="39" fill="#4e9bd8"/>'],
        ["Square", '<rect x="24" y="24" width="72" height="72" rx="5" fill="#e95b5b"/>'],
        ["Triangle", '<path d="M60 17 105 99H15z" fill="#ffd75a"/>'],
        ["Rectangle", '<rect x="14" y="34" width="92" height="53" rx="5" fill="#67d7b5"/>'],
        ["Star", '<path d="m60 10 14 31 34 4-25 23 7 34-30-17-30 17 7-34-25-23 34-4z" fill="#f4ce3d"/>'],
        ["Heart", '<path d="M60 103 19 62C-5 34 35 6 60 34 85 6 125 34 101 62z" fill="#ef6f8f"/>'],
        ["Oval", '<ellipse cx="60" cy="60" rx="45" ry="29" fill="#9b78df"/>'],
        ["Diamond", '<path d="m60 10 45 50-45 50-45-50z" fill="#52bfd1"/>'],
        ["Crescent", '<path d="M85 97A48 48 0 1 1 84 22 38 38 0 1 0 85 97z" fill="#f2c94c"/>'],
        ["Hexagon", '<path d="m31 12 58 0 29 48-29 48H31L2 60z" fill="#ed8b5f"/>']
      ].map(([wordEn, body]) => ({ id: `shape-${wordEn.toLowerCase()}`, wordEn, speechValue: wordEn, visualSvg: shapeSvg(body) }))
    },
    {
      id: "Numbers", title: "Sayılar", icon: "🔢", group: "basics", description: "0'dan 20'ye sayıları öğren.",
      strategy: "number", minimumItemCount: 21, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"]
        .map((wordEn, numericValue) => ({ id: `number-${numericValue}`, wordEn, speechValue: wordEn, visual: String(numericValue), numericValue }))
    },
    vocab("Animals", "Hayvanlar", "🐾", "animals", [
      ["Cat", "🐱"], ["Dog", "🐶"], ["Lion", "🦁"], ["Elephant", "🐘"], ["Monkey", "🐒"], ["Rabbit", "🐰"],
      ["Bear", "🐻"], ["Tiger", "🐯"], ["Horse", "🐴"], ["Giraffe", "🦒"], ["Zebra", "🦓"], ["Panda", "🐼"]
    ]),
    vocab("Fruits", "Meyveler", "🍎", "food", [
      ["Apple", "🍎"], ["Banana", "🍌"], ["Orange", "🍊"], ["Strawberry", "🍓"], ["Watermelon", "🍉"], ["Grapes", "🍇"],
      ["Pear", "🍐"], ["Peach", "🍑"], ["Cherry", "🍒"], ["Pineapple", "🍍"], ["Lemon", "🍋"], ["Kiwi", "🥝"]
    ]),
    vocab("Vegetables", "Sebzeler", "🥕", "food", [
      ["Carrot", "🥕"], ["Tomato", "🍅"], ["Potato", "🥔"], ["Onion", "🧅"], ["Cucumber", "🥒"], ["Pepper", "🌶️"],
      ["Broccoli", "🥦"], ["Corn", "🌽"], ["Peas", "🫛"], ["Lettuce", "🥬"], ["Eggplant", "🍆"], ["Mushroom", "🍄"]
    ]),
    vocab("Foods", "Yiyecekler", "🍽️", "food", [
      ["Bread", "🍞"], ["Cheese", "🧀"], ["Egg", "🥚"], ["Rice", "🍚"], ["Pasta", "🍝"], ["Pizza", "🍕"],
      ["Soup", "🥣"], ["Sandwich", "🥪"], ["Cookie", "🍪"], ["Cake", "🍰"], ["Yogurt", "🥛"], ["Honey", "🍯"]
    ]),
    vocab("Drinks", "İçecekler", "🥤", "food", [
      ["Water", "💧"], ["Milk", "🥛"], ["Juice", "🧃"], ["Tea", "🍵"], ["Lemonade", "🍋"], ["Smoothie", "🥤"],
      ["Cocoa", "☕"], ["Apple Juice", "🍎"], ["Orange Juice", "🍊"], ["Grape Juice", "🍇"], ["Milkshake", "🍨"], ["Coconut Water", "🥥"]
    ]),
    vocab("Vehicles", "Taşıtlar", "🚗", "world", [
      ["Car", "🚗"], ["Bus", "🚌"], ["Train", "🚂"], ["Bicycle", "🚲"], ["Motorcycle", "🏍️"], ["Truck", "🚚"],
      ["Airplane", "✈️"], ["Helicopter", "🚁"],
      ["Hot-air Balloon", "", sceneSvg('<ellipse cx="60" cy="43" rx="31" ry="36" fill="#ef6f8f"/><path d="M31 43h58M60 7v72M40 16q20 27 40 0M39 70q21-28 42 0" fill="none" stroke="#ffd75a" stroke-width="5"/><path d="m48 77 5 15h14l5-15M51 92h18v18H51z" fill="#b97845" stroke="#7d4c2d" stroke-width="3"/>')],
      ["Glider", "", sceneSvg('<path d="M8 63 52 50l15-31 10 3-6 29 41 12-3 10-40-5-9 35-10-2 3-34-43 6z" fill="#6f8fd8"/><path d="m52 50 18 1-1 17-16-1z" fill="#dff6ff"/>')],
      ["Boat", "🚤"], ["Ship", "🚢"], ["Sailboat", "⛵"], ["Ferry", "⛴️"], ["Tractor", "🚜"], ["Ambulance", "🚑"]
    ]),
    vocab("SeaAnimals", "Deniz Canlıları", "🐬", "animals", [
      ["Fish", "🐟"], ["Shark", "🦈"], ["Whale", "🐋"], ["Dolphin", "🐬"], ["Octopus", "🐙"], ["Crab", "🦀"],
      ["Seahorse", "🐠"], ["Turtle", "🐢"], ["Starfish", "⭐"], ["Jellyfish", "🪼"], ["Lobster", "🦞"], ["Seal", "🦭"]
    ]),
    vocab("Insects", "Böcekler", "🦋", "animals", [
      ["Butterfly", "🦋"], ["Bee", "🐝"], ["Ant", "🐜"], ["Ladybug", "🐞"], ["Spider", "🕷️"], ["Grasshopper", "🦗"],
      ["Dragonfly", "🪰✨"], ["Beetle", "🪲"], ["Caterpillar", "🐛"], ["Fly", "🪰"], ["Mosquito", "🦟"], ["Snail", "🐌"]
    ]),
    vocab("Dinosaurs", "Dinozorlar", "🦕", "animals", [
      ["Tyrannosaurus", "🦖", dinoSvg("#65a65e", '<path d="m82 44 20-11-7 19z" fill="#fff"/>')],
      ["Triceratops", "🦕", dinoSvg("#d38458", '<path d="m80 46 29-16-17 28M76 42 77 22 89 45" fill="#f3e2b3"/>')],
      ["Stegosaurus", "🦕", dinoSvg("#7ba5d6", '<path d="m31 56 8-22 10 20 9-25 11 25 10-20 8 24" fill="#d8c0f2"/>')],
      ["Brachiosaurus", "🦕", dinoSvg("#7dbb76", '<circle cx="89" cy="13" r="8" fill="#7dbb76"/>', true)],
      ["Velociraptor", "🦖", dinoSvg("#c87965", '<path d="m26 72-20 8 18 5" fill="#c87965"/>')],
      ["Ankylosaurus", "🦕", dinoSvg("#9a8b67", '<path d="M25 55h60l8 22H20z" fill="#8a7958"/><circle cx="12" cy="72" r="9" fill="#8a7958"/>')],
      ["Spinosaurus", "🦖", dinoSvg("#5c9db3", '<path d="m36 57 9-31 12 28 12-34 12 38" fill="#ee8b71"/>')],
      ["Diplodocus", "🦕", dinoSvg("#9d78cf", '<circle cx="91" cy="13" r="7" fill="#9d78cf"/>', true)],
      ["Parasaurolophus", "🦕", dinoSvg("#e49a4d", '<path d="M84 42 110 24 91 52z" fill="#e49a4d"/>')],
      ["Pteranodon", "🦖", sceneSvg('<path d="M8 67 48 40l12 11 13-11 39 27-39-7-13 26-12-26z" fill="#7a83c8"/>')],
      ["Iguanodon", "🦕", dinoSvg("#77aa68", '<path d="m72 64 10-15 3 19" fill="#fff"/>')],
      ["Apatosaurus", "🦕", dinoSvg("#6eb1a0", '<circle cx="90" cy="13" r="8" fill="#6eb1a0"/>', true)]
    ]),
    vocab("Birds", "Kuşlar", "🐦", "animals", [
      ["Bird", "🐦"], ["Owl", "🦉"], ["Duck", "🦆"], ["Eagle", "🦅"], ["Parrot", "🦜"], ["Penguin", "🐧"],
      ["Flamingo", "🦩"], ["Peacock", "🦚"], ["Swan", "🦢"], ["Turkey", "🦃"], ["Chicken", "🐔"], ["Dove", "🕊️"]
    ]),
    vocab("FarmAnimals", "Çiftlik Hayvanları", "🚜", "animals", [
      ["Cow", "🐄"], ["Sheep", "🐑"], ["Goat", "🐐"], ["Horse", "🐴"], ["Pig", "🐖"], ["Chicken", "🐔"],
      ["Rooster", "🐓"], ["Duck", "🦆"], ["Turkey", "🦃"], ["Donkey", "🫏"], ["Rabbit", "🐇"], ["Goose", "🪿"]
    ]),
    vocab("WildAnimals", "Vahşi Hayvanlar", "🦁", "animals", [
      ["Lion", "🦁"], ["Tiger", "🐯"], ["Elephant", "🐘"], ["Giraffe", "🦒"], ["Zebra", "🦓"], ["Bear", "🐻"],
      ["Gorilla", "🦍"], ["Rhinoceros", "🦏"], ["Hippopotamus", "🦛"], ["Crocodile", "🐊"], ["Leopard", "🐆"], ["Wolf", "🐺"]
    ]),
    vocab("Pets", "Evcil Hayvanlar", "🐶", "animals", [
      ["Dog", "🐶"], ["Cat", "🐱"], ["Rabbit", "🐰"], ["Hamster", "🐹"], ["Fish", "🐠"], ["Bird", "🐦"],
      ["Turtle", "🐢"], ["Parrot", "🦜"], ["Mouse", "🐭"], ["Guinea Pig", "🐹🌿"], ["Puppy", "🐕"], ["Kitten", "🐈"]
    ]),
    vocab("HomeItems", "Ev Eşyaları", "🏠", "daily", [
      ["Chair", "🪑"], ["Table", "🍽️"], ["Lamp", "💡"], ["Clock", "⏰"], ["Bed", "🛏️"], ["Sofa", "🛋️"],
      ["Door", "🚪"], ["Window", "🪟"], ["Key", "🔑"], ["Telephone", "☎️"], ["Television", "📺"], ["Mirror", "🪞"]
    ]),
    vocab("KitchenItems", "Mutfak Eşyaları", "🍴", "daily", [
      ["Plate", "🍽️"], ["Cup", "☕"], ["Spoon", "🥄"], ["Fork", "🍴"], ["Knife", "🔪"], ["Pot", "🍲"],
      ["Pan", "🍳"], ["Bowl", "🥣"], ["Bottle", "🍼"], ["Kettle", "🫖"], ["Oven", "♨️"], ["Fridge", "🧊"]
    ]),
    vocab("BathroomItems", "Banyo Eşyaları", "🛁", "daily", [
      ["Soap", "🧼"], ["Towel", "🧻"], ["Toothbrush", "🪥"], ["Toothpaste", "🦷"], ["Comb", "🪮"], ["Shampoo", "🧴"],
      ["Bathtub", "🛁"], ["Shower", "🚿"], ["Sink", "🚰"], ["Toilet", "🚽"], ["Sponge", "🧽"], ["Mirror", "🪞"]
    ]),
    vocab("Toys", "Oyuncaklar", "🧸", "daily", [
      ["Ball", "⚽"], ["Teddy Bear", "🧸"], ["Doll", "🪆"], ["Kite", "🪁"], ["Puzzle", "🧩"], ["Blocks", "🧱"],
      ["Drum", "🥁"], ["Yo-yo", "🪀"], ["Toy Car", "🏎️"], ["Robot", "🤖"], ["Train Set", "🚂"], ["Balloon", "🎈"]
    ]),
    vocab("Clothes", "Giysiler", "👕", "daily", [
      ["Shirt", "👕"], ["Pants", "👖"], ["Dress", "👗"], ["Skirt", "🩱"], ["Coat", "🧥"], ["Sweater", "🧶"],
      ["Shorts", "🩳"], ["Socks", "🧦"], ["Pajamas", "🥱"], ["Jacket", "🦺"], ["Uniform", "🥋"], ["Scarf", "🧣"]
    ]),
    vocab("ShoesAccessories", "Ayakkabılar ve Aksesuarlar", "👟", "daily", [
      ["Shoes", "👟"], ["Boots", "🥾"], ["Sandals", "🩴"], ["Hat", "🧢"], ["Glasses", "👓"], ["Watch", "⌚"],
      ["Bag", "🎒"], ["Umbrella", "☂️"], ["Gloves", "🧤"], ["Belt", "🥋"], ["Necklace", "📿"], ["Ring", "💍"]
    ]),
    vocab("Body", "Vücudumuz", "🧍", "self", [
      ["Head", "🧑"], ["Arm", "💪"], ["Hand", "✋"], ["Finger", "☝️"], ["Leg", "🦵"], ["Foot", "🦶"],
      ["Shoulder", "🤷"], ["Knee", "🦿"], ["Back", "🔙"], ["Tummy", "🫃"], ["Elbow", "💪🏻"], ["Toe", "🦶🏻"]
    ]),
    vocab("Face", "Yüzümüz", "🙂", "self", [
      ["Eye", "👁️"], ["Ear", "👂"], ["Nose", "👃"], ["Mouth", "👄"], ["Teeth", "🦷"], ["Tongue", "👅"],
      ["Hair", "💇"], ["Cheek", "😊"], ["Chin", "🧔"], ["Eyebrow", "🤨"], ["Eyelash", "😉"], ["Forehead", "🫡"]
    ]),
    vocab("Jobs", "Meslekler", "👩‍⚕️", "self", [
      ["Doctor", "🧑‍⚕️"], ["Teacher", "🧑‍🏫"], ["Firefighter", "🧑‍🚒"], ["Police Officer", "👮"], ["Chef", "🧑‍🍳"], ["Pilot", "🧑‍✈️"],
      ["Farmer", "🧑‍🌾"], ["Nurse", "👩‍⚕️"], ["Dentist", "🦷"], ["Builder", "👷"], ["Astronaut", "🧑‍🚀"], ["Veterinarian", "🐾"]
    ]),
    vocab("SchoolItems", "Okul Eşyaları", "🎒", "daily", [
      ["Book", "📕"], ["Pencil", "✏️"], ["Pen", "🖊️"], ["Eraser", "🧽"], ["Ruler", "📏"], ["Scissors", "✂️"],
      ["Glue", "🧴"], ["Notebook", "📓"], ["Backpack", "🎒"], ["Crayon", "🖍️"], ["Paper", "📄"], ["Desk", "🪑"]
    ]),
    vocab("DailyLife", "Günlük Yaşam", "🌞", "daily", [
      ["Wake Up", "⏰"], ["Wash", "🧼"], ["Brush", "🪥"], ["Dress", "👕"], ["Breakfast", "🥣"], ["School", "🏫"],
      ["Play", "🛝"], ["Lunch", "🍱"], ["Home", "🏠"], ["Dinner", "🍽️"], ["Bath", "🛁"], ["Sleep", "😴"]
    ]),
    vocab("Nature", "Doğa", "🌳", "world", [
      ["Tree", "🌳"], ["Flower", "🌻"], ["Mountain", "⛰️"], ["River", "🏞️"], ["Lake", "🌊"], ["Forest", "🌲"],
      ["Rock", "🪨"], ["Leaf", "🍃"], ["Grass", "🌱"], ["Rainbow", "🌈"], ["Waterfall", "💦"], ["Island", "🏝️"]
    ]),
    {
      id: "Weather", title: "Hava Durumu", icon: "🌦️", group: "world", description: "Hava durumunu tanı.",
      strategy: "weather", minimumItemCount: 10, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: [["Sunny", "☀️"], ["Rainy", "🌧️"], ["Cloudy", "☁️"], ["Snowy", "🌨️"], ["Windy", "💨"], ["Stormy", "⛈️"], ["Foggy", "🌫️"], ["Hot", "🥵"], ["Cold", "🥶"], ["Rainbow", "🌈"]]
        .map(([wordEn, visual]) => ({ id: `weather-${wordEn.toLowerCase()}`, wordEn, speechValue: wordEn, visual }))
    },
    {
      id: "Seasons", title: "Mevsimler", icon: "🍂", group: "world", description: "Mevsimleri ve mevsim işaretlerini keşfet.",
      strategy: "season", minimumItemCount: 12, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: [
        ["Spring", "🌷"], ["Summer", "☀️"], ["Autumn", "🍂"], ["Winter", "❄️"],
        ["Flower", "🌼"], ["Rain", "🌧️"], ["Beach", "🏖️"], ["Sun", "🌞"],
        ["Leaf", "🍁"], ["Pumpkin", "🎃"], ["Snowman", "⛄"], ["Scarf", "🧣"]
      ].map(([wordEn, visual], index) => ({ id: `season-${wordId(wordEn)}-${index}`, wordEn, speechValue: wordEn, visual, season: ["Spring", "Summer", "Autumn", "Winter"][Math.floor(index / 3)] ?? wordEn }))
    },
    vocab("Space", "Uzay", "🚀", "world", [
      ["Sun", "☀️"], ["Moon", "🌙"], ["Star", "⭐"], ["Planet", "🪐"], ["Earth", "🌍"], ["Rocket", "🚀"],
      ["Astronaut", "🧑‍🚀"], ["Satellite", "🛰️"], ["Comet", "☄️"], ["Telescope", "🔭"], ["Galaxy", "🌌"], ["Alien", "👽"]
    ]),
    vocab("Places", "Binalar ve Yerler", "🏙️", "self", [
      ["House", "🏠"], ["School", "🏫"], ["Hospital", "🏥"], ["Fire Station", "🚒"], ["Police Station", "🚓"], ["Shop", "🏪"],
      ["Library", "📚"], ["Park", "🏞️"], ["Farm", "🚜"], ["Airport", "✈️"], ["Zoo", "🦒"], ["Castle", "🏰"]
    ]),
    {
      id: "Emotions", title: "Duygular", icon: "😊", group: "self", description: "Yüz ifadelerindeki duyguyu bul.",
      strategy: "emotion", minimumItemCount: 10, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: [["Happy", "😊"], ["Sad", "😢"], ["Angry", "😠"], ["Scared", "😨"], ["Surprised", "😲"], ["Excited", "🤩"], ["Tired", "😴"], ["Shy", "☺️"], ["Calm", "😌"], ["Confused", "😕"]]
        .map(([wordEn, visual]) => ({ id: `emotion-${wordEn.toLowerCase()}`, wordEn, speechValue: wordEn, visual }))
    },
    {
      id: "Opposites", title: "Zıt Kavramlar", icon: "↔️", group: "thinking", description: "Birbirinin zıttı kavramları öğren.",
      strategy: "opposite", minimumItemCount: 12, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: [
        ["Big", "Small", "🐘  🐭"], ["Tall", "Short", "🦒  🐢"], ["Fast", "Slow", "🏎️  🐌"], ["Hot", "Cold", "🔥  🧊"],
        ["Open", "Closed", "📖  📕"], ["Full", "Empty", "🥛  🥛"], ["Clean", "Dirty", "✨  🟤"], ["Happy", "Sad", "😊  😢"],
        ["Day", "Night", "☀️  🌙"], ["Up", "Down", "⬆️  ⬇️"], ["Wet", "Dry", "💧  ☀️"], ["Heavy", "Light", "🏋️  🪶"]
      ].map(([first, second, visual], index) => ({ id: `opposite-${index}`, wordEn: first, speechValue: first, visual, pair: [first, second], choices: [first, second], promptTr: `${first} olanı bul.` }))
    },
    {
      id: "Positions", title: "Konum Kavramları", icon: "📍", group: "thinking", description: "Nesnelerin nerede olduğunu keşfet.",
      strategy: "position", minimumItemCount: 10, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: [
        ["In", sceneSvg('<rect x="25" y="52" width="70" height="50" rx="5" fill="#b9855c"/><circle cx="60" cy="65" r="16" fill="#f0a44e"/>')],
        ["On", sceneSvg('<rect x="23" y="70" width="74" height="22" fill="#9b724e"/><circle cx="60" cy="53" r="16" fill="#f0a44e"/>')],
        ["Under", sceneSvg('<rect x="20" y="40" width="80" height="15" fill="#9b724e"/><circle cx="60" cy="78" r="16" fill="#f0a44e"/>')],
        ["Above", sceneSvg('<circle cx="60" cy="33" r="16" fill="#f0a44e"/><rect x="20" y="75" width="80" height="15" fill="#9b724e"/>')],
        ["Behind", sceneSvg('<circle cx="55" cy="63" r="20" fill="#f0a44e"/><rect x="48" y="35" width="48" height="65" fill="#8b6d52"/>')],
        ["In front of", sceneSvg('<rect x="48" y="35" width="48" height="65" fill="#8b6d52"/><circle cx="55" cy="70" r="20" fill="#f0a44e"/>')],
        ["Next to", sceneSvg('<rect x="20" y="42" width="40" height="55" fill="#8b6d52"/><circle cx="83" cy="70" r="18" fill="#f0a44e"/>')],
        ["Between", sceneSvg('<rect x="8" y="43" width="30" height="54" fill="#8b6d52"/><circle cx="60" cy="70" r="17" fill="#f0a44e"/><rect x="82" y="43" width="30" height="54" fill="#8b6d52"/>')],
        ["Left", sceneSvg('<circle cx="28" cy="62" r="18" fill="#f0a44e"/><path d="M55 62h50" stroke="#8b6d52" stroke-width="8"/>')],
        ["Right", sceneSvg('<path d="M15 62h50" stroke="#8b6d52" stroke-width="8"/><circle cx="92" cy="62" r="18" fill="#f0a44e"/>')]
      ].map(([wordEn, visualSvg], index) => ({ id: `position-${index}`, wordEn, speechValue: wordEn, visualSvg, promptTr: "Top nerede?" }))
    },
    vocab("Actions", "Eylemler", "🏃", "daily", [
      ["Run", "🏃"], ["Walk", "🚶"], ["Jump", "🤾"], ["Sit", "🪑"], ["Stand", "🧍"], ["Sleep", "😴"],
      ["Eat", "🍽️"], ["Drink", "🥤"], ["Read", "📖"], ["Write", "✍️"], ["Swim", "🏊"], ["Dance", "💃"]
    ], "Eylemleri gör ve İngilizce adını bul."),
    {
      id: "Letters", title: "Harfler", icon: "🔤", group: "basics", description: "İngilizce büyük harfleri tanı.",
      strategy: "letter", minimumItemCount: 26, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => ({ id: `letter-${letter.toLowerCase()}`, wordEn: letter, speechValue: letter, visual: letter }))
    },
    vocab("EnglishWords", "İngilizce Kelimeler", "💬", "basics", [
      ["Hello", "👋"], ["Goodbye", "🙋"], ["Please", "🙏"], ["Thank You", "💝"], ["Yes", "✅"], ["No", "❌"],
      ["Friend", "🧒"], ["Family", "👨‍👩‍👧"], ["Home", "🏠"], ["School", "🏫"], ["Play", "🛝"], ["Learn", "📚"]
    ], "Günlük basit İngilizce kelimeleri öğren."),
    {
      id: "NumberOrder", title: "Sayıları Sırala", icon: "🔢", group: "thinking", description: "0'dan 20'ye sayıların sırasını bul.",
      strategy: "ordering", minimumItemCount: 21, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"]
        .map((wordEn, numericValue) => ({
          id: `order-${numericValue}`, wordEn, speechValue: wordEn, numericValue,
          visual: numericValue === 0 ? "?  →  1  →  2" : numericValue === 20 ? "18  →  19  →  ?" : `${numericValue - 1}  →  ?  →  ${numericValue + 1}`,
          promptTr: "Sıradaki sayıyı bul."
        }))
    },
    {
      id: "BigSmall", title: "Büyük ve Küçük", icon: "🐘", group: "thinking", description: "Büyük, küçük ve sayı karşılaştırmalarını keşfet.",
      strategy: "comparison", minimumItemCount: 12, supportedModes: ["learning", "quick"], speechEnabled: true,
      items: [
        ["Elephant", "Mouse", "🐘   🐭", "Hangisi daha büyük?", "Elephant"],
        ["Giraffe", "Rabbit", "🦒   🐰", "Hangisi daha büyük?", "Giraffe"],
        ["Bus", "Bicycle", "🚌   🚲", "Hangisi daha büyük?", "Bus"],
        ["Tree", "Flower", "🌳   🌼", "Hangisi daha büyük?", "Tree"],
        ["Mouse", "Elephant", "🐭   🐘", "Hangisi daha küçük?", "Mouse"],
        ["Ant", "Dog", "🐜   🐶", "Hangisi daha küçük?", "Ant"],
        ["Bicycle", "Train", "🚲   🚂", "Hangisi daha küçük?", "Bicycle"],
        ["Flower", "Tree", "🌼   🌳", "Hangisi daha küçük?", "Flower"],
        ["Nine", "Three", "9   3", "Büyük sayıyı bul.", "Nine"],
        ["Eight", "Two", "8   2", "Büyük sayıyı bul.", "Eight"],
        ["One", "Seven", "1   7", "Küçük sayıyı bul.", "One"],
        ["Four", "Ten", "4   10", "Küçük sayıyı bul.", "Four"]
      ].map(([first, second, visual, promptTr, correct], index) => ({
        id: `comparison-${index}`, wordEn: correct, speechValue: correct, visual, promptTr, choices: [first, second],
        comparisonValues: promptTr.includes("Büyük") || promptTr.includes("büyük") ? [2, 1] : [1, 2]
      }))
    }
  ];

  const sortingCategory = (id, label, icon, tier, sourceCategoryId, itemRefs) => ({
    id, label, icon, tier, sourceCategoryId,
    itemRefs: itemRefs.map(([sourceItemId, itemLabel]) => ({ sourceItemId, label: itemLabel }))
  });

  const SORTING_CATEGORIES = [
    sortingCategory("animals", "Hayvanlar", "🐾", "easy", "Animals", [
      ["animals-cat", "Kedi"], ["animals-dog", "Köpek"], ["animals-lion", "Aslan"],
      ["animals-elephant", "Fil"], ["animals-monkey", "Maymun"], ["animals-rabbit", "Tavşan"]
    ]),
    sortingCategory("fruits", "Meyveler", "🍎", "easy", "Fruits", [
      ["fruits-apple", "Elma"], ["fruits-banana", "Muz"], ["fruits-orange", "Portakal"],
      ["fruits-strawberry", "Çilek"], ["fruits-watermelon", "Karpuz"], ["fruits-grapes", "Üzüm"]
    ]),
    sortingCategory("vegetables", "Sebzeler", "🥕", "medium", "Vegetables", [
      ["vegetables-carrot", "Havuç"], ["vegetables-tomato", "Domates"], ["vegetables-potato", "Patates"],
      ["vegetables-onion", "Soğan"], ["vegetables-cucumber", "Salatalık"], ["vegetables-broccoli", "Brokoli"]
    ]),
    sortingCategory("toys", "Oyuncaklar", "🧸", "easy", "Toys", [
      ["toys-ball", "Top"], ["toys-teddy-bear", "Oyuncak Ayı"], ["toys-doll", "Oyuncak Bebek"],
      ["toys-kite", "Uçurtma"], ["toys-puzzle", "Yapboz"], ["toys-blocks", "Bloklar"]
    ]),
    sortingCategory("clothes", "Giysiler", "👕", "easy", "Clothes", [
      ["clothes-shirt", "Tişört"], ["clothes-pants", "Pantolon"], ["clothes-dress", "Elbise"],
      ["clothes-coat", "Mont"], ["clothes-shorts", "Şort"], ["clothes-socks", "Çorap"]
    ]),
    sortingCategory("schoolItems", "Okul Eşyaları", "🎒", "medium", "SchoolItems", [
      ["schoolitems-book", "Kitap"], ["schoolitems-pencil", "Kurşun Kalem"], ["schoolitems-pen", "Kalem"],
      ["schoolitems-ruler", "Cetvel"], ["schoolitems-scissors", "Makas"], ["schoolitems-backpack", "Okul Çantası"]
    ]),
    sortingCategory("homeItems", "Ev Eşyaları", "🏠", "medium", "HomeItems", [
      ["homeitems-chair", "Sandalye"], ["homeitems-table", "Masa"], ["homeitems-lamp", "Lamba"],
      ["homeitems-clock", "Saat"], ["homeitems-bed", "Yatak"], ["homeitems-sofa", "Koltuk"]
    ]),
    sortingCategory("foods", "Yiyecekler", "🍽️", "medium", "Foods", [
      ["foods-bread", "Ekmek"], ["foods-cheese", "Peynir"], ["foods-egg", "Yumurta"],
      ["foods-rice", "Pilav"], ["foods-pasta", "Makarna"], ["foods-pizza", "Pizza"]
    ]),
    sortingCategory("landVehicles", "Kara Taşıtları", "🚗", "advanced", "Vehicles", [
      ["vehicles-car", "Araba"], ["vehicles-bus", "Otobüs"], ["vehicles-train", "Tren"],
      ["vehicles-bicycle", "Bisiklet"], ["vehicles-motorcycle", "Motosiklet"], ["vehicles-truck", "Kamyon"]
    ]),
    sortingCategory("seaVehicles", "Deniz Taşıtları", "🚢", "advanced", "Vehicles", [
      ["vehicles-boat", "Tekne"], ["vehicles-ship", "Gemi"], ["vehicles-sailboat", "Yelkenli"],
      ["vehicles-ferry", "Feribot"]
    ]),
    sortingCategory("airVehicles", "Hava Taşıtları", "✈️", "advanced", "Vehicles", [
      ["vehicles-airplane", "Uçak"], ["vehicles-helicopter", "Helikopter"],
      ["vehicles-hot-air-balloon", "Sıcak Hava Balonu"], ["vehicles-glider", "Planör"]
    ]),
    sortingCategory("seaAnimals", "Deniz Hayvanları", "🐬", "advanced", "SeaAnimals", [
      ["seaanimals-fish", "Balık"], ["seaanimals-shark", "Köpek Balığı"], ["seaanimals-whale", "Balina"],
      ["seaanimals-dolphin", "Yunus"], ["seaanimals-octopus", "Ahtapot"], ["seaanimals-seahorse", "Denizatı"]
    ]),
    sortingCategory("landAnimals", "Kara Hayvanları", "🦒", "advanced", "Animals", [
      ["animals-horse", "At"], ["animals-giraffe", "Zürafa"], ["animals-zebra", "Zebra"],
      ["animals-panda", "Panda"], ["animals-elephant", "Fil"], ["animals-lion", "Aslan"]
    ]),
    sortingCategory("pets", "Evcil Hayvanlar", "🐶", "advanced", "Pets", [
      ["pets-dog", "Köpek"], ["pets-cat", "Kedi"], ["pets-rabbit", "Tavşan"],
      ["pets-hamster", "Hamster"], ["pets-parrot", "Papağan"], ["pets-mouse", "Fare"]
    ]),
    sortingCategory("wildAnimals", "Vahşi Hayvanlar", "🦁", "advanced", "WildAnimals", [
      ["wildanimals-lion", "Aslan"], ["wildanimals-tiger", "Kaplan"], ["wildanimals-elephant", "Fil"],
      ["wildanimals-giraffe", "Zürafa"], ["wildanimals-zebra", "Zebra"], ["wildanimals-gorilla", "Goril"]
    ]),
    sortingCategory("nature", "Doğa Nesneleri", "🌳", "medium", "Nature", [
      ["nature-tree", "Ağaç"], ["nature-flower", "Çiçek"], ["nature-mountain", "Dağ"],
      ["nature-river", "Nehir"], ["nature-forest", "Orman"], ["nature-rainbow", "Gökkuşağı"]
    ])
  ];

  const sortingPair = (id, firstCategoryId, secondCategoryId, tier, instruction) => ({
    id, categoryIds: [firstCategoryId, secondCategoryId], tier, instruction
  });

  const SORTING_PAIRS = [
    sortingPair("animals-fruits", "animals", "fruits", "easy", "Hayvanları ve meyveleri grupla."),
    sortingPair("animals-toys", "animals", "toys", "easy", "Hayvanları ve oyuncakları grupla."),
    sortingPair("fruits-toys", "fruits", "toys", "easy", "Meyveleri ve oyuncakları grupla."),
    sortingPair("clothes-animals", "clothes", "animals", "easy", "Giysileri ve hayvanları grupla."),
    sortingPair("school-fruits", "schoolItems", "fruits", "easy", "Okul eşyalarını ve meyveleri grupla."),
    sortingPair("fruits-vegetables", "fruits", "vegetables", "medium", "Meyveleri ve sebzeleri grupla."),
    sortingPair("toys-school", "toys", "schoolItems", "medium", "Oyuncakları ve okul eşyalarını grupla."),
    sortingPair("clothes-home", "clothes", "homeItems", "medium", "Giysileri ve ev eşyalarını grupla."),
    sortingPair("foods-toys", "foods", "toys", "medium", "Yiyecekleri ve oyuncakları grupla."),
    sortingPair("nature-home", "nature", "homeItems", "medium", "Doğadakileri ve ev eşyalarını grupla."),
    sortingPair("land-sea-vehicles", "landVehicles", "seaVehicles", "advanced", "Karada ve denizde giden taşıtları grupla."),
    sortingPair("land-air-vehicles", "landVehicles", "airVehicles", "advanced", "Karada ve havada giden taşıtları grupla."),
    sortingPair("sea-air-vehicles", "seaVehicles", "airVehicles", "advanced", "Denizde ve havada giden taşıtları grupla."),
    sortingPair("sea-land-animals", "seaAnimals", "landAnimals", "advanced", "Denizde ve karada yaşayan hayvanları grupla."),
    sortingPair("pets-wild", "pets", "wildAnimals", "advanced", "Evcil ve vahşi hayvanları grupla.")
  ];

  const SORTING_SEMANTIC_CONFLICTS = new Set([
    "animals|landAnimals", "animals|pets", "animals|seaAnimals", "animals|wildAnimals",
    "foods|fruits", "foods|vegetables"
  ]);
  const SORTING_ITEMS_PER_CATEGORY = 4;
  const SORTING_FALLBACK_PAIR_ID = "animals-fruits";

  function normalizedSortingPair(firstCategoryId, secondCategoryId) {
    return [firstCategoryId, secondCategoryId].sort().join("|");
  }

  function getSortingCategory(id, sourceCategories = SORTING_CATEGORIES) {
    return sourceCategories.find(category => category.id === id);
  }

  function resolveSortingCategoryItems(category, educationalCategories = categories) {
    if (!category) return [];
    const source = educationalCategories.find(item => item.id === category.sourceCategoryId);
    if (!source) return [];
    return category.itemRefs.map(reference => {
      const item = source.items.find(candidate => candidate.id === reference.sourceItemId);
      if (!item) return undefined;
      return {
        id: item.id, conceptId: wordId(item.wordEn), label: reference.label,
        visual: item.visual, visualSvg: item.visualSvg, sourceCategoryId: source.id
      };
    }).filter(Boolean);
  }

  function validateSortingCategory(category, educationalCategories = categories) {
    const problems = [];
    const items = resolveSortingCategoryItems(category, educationalCategories);
    if (!category?.id || !category?.label || !category?.icon || !["easy", "medium", "advanced"].includes(category?.tier)) problems.push("Geçersiz kategori metadata'sı.");
    if (items.length < SORTING_ITEMS_PER_CATEGORY) problems.push(`${category?.id || "Bilinmeyen"}: en az ${SORTING_ITEMS_PER_CATEGORY} geçerli öğe gerekli.`);
    if (new Set(items.map(item => item.id)).size !== items.length) problems.push(`${category.id}: yinelenen öğe kimliği.`);
    if (new Set(items.map(item => item.conceptId)).size !== items.length) problems.push(`${category.id}: yinelenen kavram.`);
    if (items.some(item => !item.label || (!item.visual && !item.visualSvg))) problems.push(`${category.id}: etiketi veya görseli eksik öğe.`);
    return { valid: problems.length === 0, problems, items };
  }

  function validateSortingPair(pair, sourceCategories = SORTING_CATEGORIES, educationalCategories = categories) {
    const problems = [];
    const [firstId, secondId] = pair?.categoryIds ?? [];
    const first = getSortingCategory(firstId, sourceCategories);
    const second = getSortingCategory(secondId, sourceCategories);
    if (!pair?.id || pair?.categoryIds?.length !== 2 || !first || !second || firstId === secondId) problems.push(`${pair?.id || "Bilinmeyen çift"}: iki farklı geçerli kategori gerekli.`);
    if (SORTING_SEMANTIC_CONFLICTS.has(normalizedSortingPair(firstId, secondId))) problems.push(`${pair?.id}: anlamsal olarak örtüşen kategoriler.`);
    const firstValidation = validateSortingCategory(first, educationalCategories);
    const secondValidation = validateSortingCategory(second, educationalCategories);
    problems.push(...firstValidation.problems, ...secondValidation.problems);
    const firstConcepts = new Set(firstValidation.items.map(item => item.conceptId));
    const secondConcepts = new Set(secondValidation.items.map(item => item.conceptId));
    const overlap = [...firstConcepts].filter(conceptId => secondConcepts.has(conceptId));
    if (overlap.length) problems.push(`${pair?.id}: iki gruba da ait öğe var (${overlap.join(", ")}).`);
    const firstItems = firstValidation.items.filter(item => !secondConcepts.has(item.conceptId));
    const secondItems = secondValidation.items.filter(item => !firstConcepts.has(item.conceptId));
    if (firstItems.length < SORTING_ITEMS_PER_CATEGORY || secondItems.length < SORTING_ITEMS_PER_CATEGORY) problems.push(`${pair?.id}: iki tarafta da yeterli özel öğe yok.`);
    return { valid: problems.length === 0, problems, categories: [first, second], eligibleItems: [firstItems, secondItems] };
  }

  function getValidSortingPairs(sourcePairs = SORTING_PAIRS, sourceCategories = SORTING_CATEGORIES, educationalCategories = categories) {
    return sourcePairs.filter(pair => validateSortingPair(pair, sourceCategories, educationalCategories).valid);
  }

  function safeRandomIndex(length, random) {
    if (!length) return -1;
    const value = Number(random());
    return Math.min(length - 1, Math.max(0, Math.floor((Number.isFinite(value) ? value : 0) * length)));
  }

  function selectSortingPair(recentPairIds = [], random = Math.random, sourcePairs = SORTING_PAIRS, sourceCategories = SORTING_CATEGORIES, educationalCategories = categories) {
    const validPairs = getValidSortingPairs(sourcePairs, sourceCategories, educationalCategories);
    if (!validPairs.length) return undefined;
    const recent = new Set(recentPairIds.slice(-3));
    const freshPairs = validPairs.filter(pair => !recent.has(pair.id));
    const available = freshPairs.length ? freshPairs : validPairs;
    const tierRoll = Number(random());
    const tier = tierRoll < .45 ? "easy" : tierRoll < .8 ? "medium" : "advanced";
    const tierPairs = available.filter(pair => pair.tier === tier);
    const pool = tierPairs.length ? tierPairs : available;
    return pool[safeRandomIndex(pool.length, random)]
      ?? validPairs.find(pair => pair.id === SORTING_FALLBACK_PAIR_ID)
      ?? validPairs[0];
  }

  function hasMixedSortingOrder(items) {
    let changes = 0;
    for (let index = 1; index < items.length; index += 1) if (items[index].group !== items[index - 1].group) changes += 1;
    return changes >= 2;
  }

  function createMixedSortingOrder(firstItems, secondItems, random = Math.random) {
    const combined = [...firstItems, ...secondItems];
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const candidate = shuffle(combined, random);
      if (hasMixedSortingOrder(candidate)) return candidate;
    }
    const fallback = [];
    for (let index = 0; index < Math.max(firstItems.length, secondItems.length); index += 1) {
      if (index < secondItems.length) fallback.push(secondItems[index]);
      if (index < firstItems.length) fallback.push(firstItems[index]);
    }
    return fallback;
  }

  function createSortingSession({ recentPairIds = [], random = Math.random, pairId, sourcePairs = SORTING_PAIRS, sourceCategories = SORTING_CATEGORIES, educationalCategories = categories } = {}) {
    const validPairs = getValidSortingPairs(sourcePairs, sourceCategories, educationalCategories);
    if (!validPairs.length) return undefined;
    let pair = pairId ? validPairs.find(candidate => candidate.id === pairId) : selectSortingPair(recentPairIds, random, sourcePairs, sourceCategories, educationalCategories);
    pair ??= validPairs.find(candidate => candidate.id === SORTING_FALLBACK_PAIR_ID) ?? validPairs[0];
    const pairValidation = validateSortingPair(pair, sourceCategories, educationalCategories);
    if (!pairValidation.valid) {
      pair = validPairs.find(candidate => candidate.id === SORTING_FALLBACK_PAIR_ID) ?? validPairs[0];
    }
    const resolved = validateSortingPair(pair, sourceCategories, educationalCategories);
    if (!resolved.valid) return undefined;
    const chosen = resolved.eligibleItems.map((items, categoryIndex) => shuffle(items, random).slice(0, SORTING_ITEMS_PER_CATEGORY).map(item => ({
      ...item, id: `sorting-${item.id}`, group: resolved.categories[categoryIndex].id, completed: false
    })));
    const reverseSides = Number(random()) >= .5;
    const categoryOrder = reverseSides ? [...resolved.categories].reverse() : [...resolved.categories];
    return {
      id: `sorting-session-${pair.id}`, pairId: pair.id, tier: pair.tier, instruction: pair.instruction,
      categories: categoryOrder.map(category => ({ id: category.id, label: category.label, icon: category.icon })),
      items: createMixedSortingOrder(chosen[0], chosen[1], random)
    };
  }

  function validateSortingSession(session) {
    const problems = [];
    if (!session || session.categories?.length !== 2 || session.categories[0].id === session.categories[1].id) problems.push("Oturumda iki farklı kategori olmalı.");
    const items = session?.items ?? [];
    if (items.length !== SORTING_ITEMS_PER_CATEGORY * 2 || new Set(items.map(item => item.id)).size !== items.length) problems.push("Oturum öğeleri dengeli ve benzersiz değil.");
    const categoryIds = new Set((session?.categories ?? []).map(category => category.id));
    const counts = items.reduce((result, item) => ({ ...result, [item.group]: (result[item.group] ?? 0) + 1 }), {});
    if (items.some(item => !item.label || (!item.visual && !item.visualSvg) || !categoryIds.has(item.group))) problems.push("Oturumda hedefsiz veya görselsiz öğe var.");
    if ([...categoryIds].some(categoryId => counts[categoryId] !== SORTING_ITEMS_PER_CATEGORY)) problems.push("Kategori dağılımı dengeli değil.");
    if (!hasMixedSortingOrder(items)) problems.push("Öğe sırası kategori bloklarına ayrılmış.");
    return { valid: problems.length === 0, problems };
  }

  function placeSortingSessionItem(session, itemId, destinationId, inputLocked = false) {
    const item = session?.items?.find(candidate => candidate.id === itemId);
    if (inputLocked || !item || item.completed || !session.categories.some(category => category.id === destinationId)) return { accepted: false, completed: false };
    if (item.group !== destinationId) return { accepted: false, completed: false, retry: true };
    item.completed = true;
    return { accepted: true, completed: session.items.every(candidate => candidate.completed) };
  }

  function validateSortingContent(warn = console.warn) {
    const problems = [];
    const categoryIds = SORTING_CATEGORIES.map(category => category.id);
    const pairIds = SORTING_PAIRS.map(pair => pair.id);
    if (SORTING_CATEGORIES.length < 12 || new Set(categoryIds).size !== categoryIds.length) problems.push("Grupla kategorileri yetersiz veya yineleniyor.");
    SORTING_CATEGORIES.forEach(category => problems.push(...validateSortingCategory(category).problems));
    if (new Set(pairIds).size !== pairIds.length) problems.push("Grupla çift kimlikleri yineleniyor.");
    SORTING_PAIRS.forEach(pair => problems.push(...validateSortingPair(pair).problems));
    if (!getValidSortingPairs().some(pair => pair.id === SORTING_FALLBACK_PAIR_ID)) problems.push("Grupla güvenli geri dönüş çifti geçersiz.");
    problems.forEach(problem => warn(`[Sprint 11.2 Grupla] ${problem}`));
    return { valid: problems.length === 0, problems };
  }

  const PACKS = {
    mixed: ["Colors", "Shapes", "Numbers", "Animals", "Fruits", "Vegetables", "Vehicles", "SeaAnimals", "Toys", "Body", "Emotions", "Nature"],
    words: ["Animals", "Fruits", "Vegetables", "Foods", "Drinks", "Vehicles", "SeaAnimals", "Insects", "Toys", "Clothes", "HomeItems", "Jobs", "Nature", "Space", "Actions"],
    "colors-shapes": ["Colors", "Shapes"],
    numbers: ["Numbers", "NumberOrder", "BigSmall"]
  };

  const SUPPORTED_STRATEGIES = new Set(["vocabulary", "color", "shape", "number", "weather", "season", "emotion", "opposite", "position", "letter", "ordering", "comparison"]);
  const LEGACY_CATEGORY_ALIASES = { Emoji: "Emotions" };

  function answerFor(item) {
    return item.wordEn;
  }

  function promptFor(category, item) {
    if (item.promptTr) return { text: item.promptTr, language: "tr-TR" };
    if (category.strategy === "color") return { text: `Find ${item.wordEn}.`, language: "en-US" };
    if (category.strategy === "shape") return { text: `Find the ${item.wordEn}.`, language: "en-US" };
    if (category.strategy === "number") return { text: `Find number ${item.wordEn}.`, language: "en-US" };
    if (category.strategy === "letter") return { text: `Find letter ${item.wordEn}.`, language: "en-US" };
    if (category.strategy === "emotion") return { text: `Who is ${item.wordEn.toLowerCase()}?`, language: "en-US" };
    if (category.strategy === "weather") return { text: `Find ${item.wordEn}.`, language: "en-US" };
    if (category.strategy === "position") return { text: "Top nerede?", language: "tr-TR" };
    return { text: `Find the ${item.wordEn}.`, language: "en-US" };
  }

  function buildQuestions(sourceCategories = categories) {
    return sourceCategories.flatMap(category => {
      const answerPool = [...new Set(category.items.map(answerFor))];
      return category.items.map((item, itemIndex) => {
        const prompt = promptFor(category, item);
        const correct = answerFor(item);
        const requestedChoices = Array.isArray(item.choices) ? item.choices : [correct, ...answerPool.filter(answer => answer !== correct).slice(itemIndex % Math.max(1, answerPool.length - 1), itemIndex % Math.max(1, answerPool.length - 1) + 3)];
        const answers = [...new Set([correct, ...requestedChoices, ...answerPool.filter(answer => answer !== correct)])].slice(0, 4);
        return {
          id: `${category.id}-${item.id}`, targetId: item.id, category: category.id, label: category.title,
          prompt: prompt.text, promptLanguage: prompt.language, answerLanguage: "en-US", correct,
          speechValue: item.speechValue, visual: item.visual ?? "", visualSvg: item.visualSvg,
          answers, strategy: category.strategy, progressiveChoices: true, numericValue: item.numericValue,
          pair: item.pair, comparisonValues: item.comparisonValues, forceQuestionType: ["opposite", "position", "ordering", "comparison"].includes(category.strategy) ? "selection" : undefined,
          recognitionPrompt: category.strategy === "vocabulary" ? `What is this?` : undefined,
          selectionPrompt: prompt.text
        };
      });
    });
  }

  function validateCategories(sourceCategories = categories, warn = console.warn) {
    const problems = [];
    const groupIds = new Set(GROUPS.map(group => group.id));
    const categoryIds = sourceCategories.map(category => category.id);
    if (sourceCategories.length !== 40) problems.push(`40 yerine ${sourceCategories.length} kategori var.`);
    if (new Set(categoryIds).size !== categoryIds.length) problems.push("Yinelenen kategori kimliği var.");
    sourceCategories.forEach(category => {
      if (!category.id || !category.title || !category.icon || !groupIds.has(category.group)) problems.push(`${category.id || "Bilinmeyen"}: geçersiz kategori tanımı.`);
      if (!SUPPORTED_STRATEGIES.has(category.strategy)) problems.push(`${category.id}: desteklenmeyen soru stratejisi.`);
      if (!Array.isArray(category.items) || category.items.length < category.minimumItemCount) problems.push(`${category.id}: en az ${category.minimumItemCount} öğe gerekli.`);
      const itemIds = category.items.map(item => item.id);
      if (new Set(itemIds).size !== itemIds.length || itemIds.some(id => !id)) problems.push(`${category.id}: yinelenen veya eksik öğe kimliği.`);
      const answers = category.items.map(answerFor);
      if (new Set(answers).size !== answers.length) problems.push(`${category.id}: yinelenen cevap etiketi.`);
      const visuals = category.items.map(item => item.visualSvg ?? item.visual);
      if (new Set(visuals).size !== visuals.length) problems.push(`${category.id}: yinelenen görsel.`);
      category.items.forEach(item => {
        if (!answerFor(item) || !item.speechValue) problems.push(`${category.id}/${item.id}: eksik İngilizce kelime veya konuşma değeri.`);
        if (!item.visual && !item.visualSvg) problems.push(`${category.id}/${item.id}: görsel eksik.`);
        if (["number", "ordering"].includes(category.strategy) && !Number.isInteger(item.numericValue)) problems.push(`${category.id}/${item.id}: geçersiz sayı.`);
        if (category.strategy === "opposite" && (!Array.isArray(item.pair) || item.pair.length !== 2 || item.pair[0] === item.pair[1])) problems.push(`${category.id}/${item.id}: geçersiz zıt çift.`);
        if (category.strategy === "position" && !item.visualSvg) problems.push(`${category.id}/${item.id}: konum sahnesi eksik.`);
        if (category.strategy === "comparison" && (!Array.isArray(item.comparisonValues) || item.comparisonValues.length !== 2 || item.comparisonValues[0] === item.comparisonValues[1])) problems.push(`${category.id}/${item.id}: nesnel karşılaştırma eksik.`);
      });
    });
    GENERAL_VOCABULARY_IDS.forEach(id => {
      const category = sourceCategories.find(item => item.id === id);
      if (!category || category.items.length < 12) problems.push(`${id}: 12 kelimelik içerik yok.`);
    });
    const seasons = sourceCategories.find(category => category.id === "Seasons");
    if (!["Spring", "Summer", "Autumn", "Winter"].every(season => seasons?.items.some(item => item.wordEn === season)) || seasons?.items.length < 12) problems.push("Mevsimler: dört mevsim ve sekiz ilişkili içerik gerekli.");
    const questions = buildQuestions(sourceCategories);
    questions.forEach(question => {
      if (new Set(question.answers).size !== question.answers.length || question.answers.filter(answer => answer === question.correct).length !== 1) problems.push(`${question.id}: cevap seçenekleri geçersiz.`);
    });
    problems.forEach(problem => warn(`[Sprint 8.2 kategori] ${problem}`));
    return { valid: problems.length === 0, problems };
  }

  function getCategory(id) {
    const resolvedId = LEGACY_CATEGORY_ALIASES[id] ?? id;
    return categories.find(category => category.id === resolvedId);
  }

  function sanitizeSavedSelection(savedIds) {
    if (!Array.isArray(savedIds)) return [];
    return [...new Set(savedIds.map(id => LEGACY_CATEGORY_ALIASES[id] ?? id).filter(id => Boolean(getCategory(id))))];
  }

  function getEligibleCategories(game) {
    if (game === "matching") return categories.filter(category => category.items.length >= 8 && category.items.every(item => item.visual || item.visualSvg));
    if (game === "listening") return categories.filter(category => category.items.length >= 4 && category.items.every(item => item.speechValue && (item.visual || item.visualSvg)));
    if (game === "missing-item") return categories.filter(category => category.items.length >= 5 && category.items.every(item => item.visual));
    if (game === "initial-letter") return categories.filter(category => GENERAL_VOCABULARY_IDS.includes(category.id) && category.items.every(item => /^[A-Z]/.test(item.wordEn)));
    return [];
  }

  const validation = validateCategories();
  const validCategories = validation.valid ? categories : categories.filter(category => validateCategories([category], () => {}).problems.every(problem => !problem.startsWith(category.id)));
  const questions = buildQuestions(validCategories);
  const sortingValidation = validateSortingContent();

  root.MilaLearningCategories = {
    GROUPS, CATEGORIES: validCategories, REQUIRED_CATEGORY_IDS: categories.map(category => category.id), GENERAL_VOCABULARY_IDS,
    PACKS, LEGACY_CATEGORY_ALIASES, questions, buildQuestions, validateCategories, getCategory, sanitizeSavedSelection, getEligibleCategories,
    SORTING_CATEGORIES, SORTING_PAIRS, SORTING_ITEMS_PER_CATEGORY, SORTING_FALLBACK_PAIR_ID, sortingValidation,
    getSortingCategory, resolveSortingCategoryItems, validateSortingCategory, validateSortingPair, getValidSortingPairs,
    selectSortingPair, createSortingSession, validateSortingSession, placeSortingSessionItem, validateSortingContent
  };

  if (typeof module !== "undefined" && module.exports) module.exports = root.MilaLearningCategories;
})(typeof window !== "undefined" ? window : globalThis);
