(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MilaEducationalObjects = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const VERSION = "1.0.5";
  const OBJECTS = Object.freeze([
  {
    "id": "cat",
    "labelTr": "Kedi",
    "initialTr": "K",
    "english": [
      "Cat"
    ],
    "categories": [
      "animals",
      "pets"
    ],
    "illustration": "object-cat",
    "src": "assets/illustrations/objects/object-cat.svg?v=1.0.5",
    "fallback": "🐱"
  },
  {
    "id": "dog",
    "labelTr": "Köpek",
    "initialTr": "K",
    "english": [
      "Dog"
    ],
    "categories": [
      "animals",
      "pets"
    ],
    "illustration": "object-dog",
    "src": "assets/illustrations/objects/object-dog.svg?v=1.0.5",
    "fallback": "🐶"
  },
  {
    "id": "rabbit",
    "labelTr": "Tavşan",
    "initialTr": "T",
    "english": [
      "Rabbit"
    ],
    "categories": [
      "animals",
      "pets"
    ],
    "illustration": "object-rabbit",
    "src": "assets/illustrations/objects/object-rabbit.svg?v=1.0.5",
    "fallback": "🐰"
  },
  {
    "id": "hamster",
    "labelTr": "Hamster",
    "initialTr": "H",
    "english": [
      "Hamster"
    ],
    "categories": [
      "animals",
      "pets"
    ],
    "illustration": "object-hamster",
    "src": "assets/illustrations/objects/object-hamster.svg?v=1.0.5",
    "fallback": "🐹"
  },
  {
    "id": "parrot",
    "labelTr": "Papağan",
    "initialTr": "P",
    "english": [
      "Parrot"
    ],
    "categories": [
      "animals",
      "pets",
      "birds"
    ],
    "illustration": "object-parrot",
    "src": "assets/illustrations/objects/object-parrot.svg?v=1.0.5",
    "fallback": "🦜"
  },
  {
    "id": "mouse",
    "labelTr": "Fare",
    "initialTr": "F",
    "english": [
      "Mouse"
    ],
    "categories": [
      "animals",
      "pets"
    ],
    "illustration": "object-mouse",
    "src": "assets/illustrations/objects/object-mouse.svg?v=1.0.5",
    "fallback": "🐭"
  },
  {
    "id": "lion",
    "labelTr": "Aslan",
    "initialTr": "A",
    "english": [
      "Lion"
    ],
    "categories": [
      "animals",
      "wildAnimals",
      "landAnimals"
    ],
    "illustration": "object-lion",
    "src": "assets/illustrations/objects/object-lion.svg?v=1.0.5",
    "fallback": "🦁"
  },
  {
    "id": "tiger",
    "labelTr": "Kaplan",
    "initialTr": "K",
    "english": [
      "Tiger"
    ],
    "categories": [
      "animals",
      "wildAnimals"
    ],
    "illustration": "object-tiger",
    "src": "assets/illustrations/objects/object-tiger.svg?v=1.0.5",
    "fallback": "🐯"
  },
  {
    "id": "elephant",
    "labelTr": "Fil",
    "initialTr": "F",
    "english": [
      "Elephant"
    ],
    "categories": [
      "animals",
      "wildAnimals",
      "landAnimals"
    ],
    "illustration": "object-elephant",
    "src": "assets/illustrations/objects/object-elephant.svg?v=1.0.5",
    "fallback": "🐘"
  },
  {
    "id": "giraffe",
    "labelTr": "Zürafa",
    "initialTr": "Z",
    "english": [
      "Giraffe"
    ],
    "categories": [
      "animals",
      "wildAnimals",
      "landAnimals"
    ],
    "illustration": "object-giraffe",
    "src": "assets/illustrations/objects/object-giraffe.svg?v=1.0.5",
    "fallback": "🦒"
  },
  {
    "id": "zebra",
    "labelTr": "Zebra",
    "initialTr": "Z",
    "english": [
      "Zebra"
    ],
    "categories": [
      "animals",
      "wildAnimals",
      "landAnimals"
    ],
    "illustration": "object-zebra",
    "src": "assets/illustrations/objects/object-zebra.svg?v=1.0.5",
    "fallback": "🦓"
  },
  {
    "id": "monkey",
    "labelTr": "Maymun",
    "initialTr": "M",
    "english": [
      "Monkey"
    ],
    "categories": [
      "animals",
      "wildAnimals"
    ],
    "illustration": "object-monkey",
    "src": "assets/illustrations/objects/object-monkey.svg?v=1.0.5",
    "fallback": "🐒"
  },
  {
    "id": "gorilla",
    "labelTr": "Goril",
    "initialTr": "G",
    "english": [
      "Gorilla"
    ],
    "categories": [
      "animals",
      "wildAnimals"
    ],
    "illustration": "object-gorilla",
    "src": "assets/illustrations/objects/object-gorilla.svg?v=1.0.5",
    "fallback": "🦍"
  },
  {
    "id": "horse",
    "labelTr": "At",
    "initialTr": "A",
    "english": [
      "Horse"
    ],
    "categories": [
      "animals",
      "landAnimals"
    ],
    "illustration": "object-horse",
    "src": "assets/illustrations/objects/object-horse.svg?v=1.0.5",
    "fallback": "🐴"
  },
  {
    "id": "panda",
    "labelTr": "Panda",
    "initialTr": "P",
    "english": [
      "Panda"
    ],
    "categories": [
      "animals",
      "landAnimals"
    ],
    "illustration": "object-panda",
    "src": "assets/illustrations/objects/object-panda.svg?v=1.0.5",
    "fallback": "🐼"
  },
  {
    "id": "fish",
    "labelTr": "Balık",
    "initialTr": "B",
    "english": [
      "Fish"
    ],
    "categories": [
      "animals",
      "seaAnimals"
    ],
    "illustration": "object-fish",
    "src": "assets/illustrations/objects/object-fish.svg?v=1.0.5",
    "fallback": "🐟"
  },
  {
    "id": "shark",
    "labelTr": "Köpek Balığı",
    "initialTr": "K",
    "english": [
      "Shark"
    ],
    "categories": [
      "animals",
      "seaAnimals"
    ],
    "illustration": "object-shark",
    "src": "assets/illustrations/objects/object-shark.svg?v=1.0.5",
    "fallback": "🦈"
  },
  {
    "id": "whale",
    "labelTr": "Balina",
    "initialTr": "B",
    "english": [
      "Whale"
    ],
    "categories": [
      "animals",
      "seaAnimals"
    ],
    "illustration": "object-whale",
    "src": "assets/illustrations/objects/object-whale.svg?v=1.0.5",
    "fallback": "🐳"
  },
  {
    "id": "dolphin",
    "labelTr": "Yunus",
    "initialTr": "Y",
    "english": [
      "Dolphin"
    ],
    "categories": [
      "animals",
      "seaAnimals"
    ],
    "illustration": "object-dolphin",
    "src": "assets/illustrations/objects/object-dolphin.svg?v=1.0.5",
    "fallback": "🐬"
  },
  {
    "id": "octopus",
    "labelTr": "Ahtapot",
    "initialTr": "A",
    "english": [
      "Octopus"
    ],
    "categories": [
      "animals",
      "seaAnimals"
    ],
    "illustration": "object-octopus",
    "src": "assets/illustrations/objects/object-octopus.svg?v=1.0.5",
    "fallback": "🐙"
  },
  {
    "id": "seahorse",
    "labelTr": "Denizatı",
    "initialTr": "D",
    "english": [
      "Seahorse"
    ],
    "categories": [
      "animals",
      "seaAnimals"
    ],
    "illustration": "object-seahorse",
    "src": "assets/illustrations/objects/object-seahorse.svg?v=1.0.5",
    "fallback": "🐠"
  },
  {
    "id": "apple",
    "labelTr": "Elma",
    "initialTr": "E",
    "english": [
      "Apple"
    ],
    "categories": [
      "fruit",
      "food"
    ],
    "illustration": "object-apple",
    "src": "assets/illustrations/objects/object-apple.svg?v=1.0.5",
    "fallback": "🍎"
  },
  {
    "id": "banana",
    "labelTr": "Muz",
    "initialTr": "M",
    "english": [
      "Banana"
    ],
    "categories": [
      "fruit",
      "food"
    ],
    "illustration": "object-banana",
    "src": "assets/illustrations/objects/object-banana.svg?v=1.0.5",
    "fallback": "🍌"
  },
  {
    "id": "orange",
    "labelTr": "Portakal",
    "initialTr": "P",
    "english": [
      "Orange"
    ],
    "categories": [
      "fruit",
      "food"
    ],
    "illustration": "object-orange",
    "src": "assets/illustrations/objects/object-orange.svg?v=1.0.5",
    "fallback": "🍊"
  },
  {
    "id": "strawberry",
    "labelTr": "Çilek",
    "initialTr": "Ç",
    "english": [
      "Strawberry"
    ],
    "categories": [
      "fruit",
      "food"
    ],
    "illustration": "object-strawberry",
    "src": "assets/illustrations/objects/object-strawberry.svg?v=1.0.5",
    "fallback": "🍓"
  },
  {
    "id": "watermelon",
    "labelTr": "Karpuz",
    "initialTr": "K",
    "english": [
      "Watermelon"
    ],
    "categories": [
      "fruit",
      "food"
    ],
    "illustration": "object-watermelon",
    "src": "assets/illustrations/objects/object-watermelon.svg?v=1.0.5",
    "fallback": "🍉"
  },
  {
    "id": "grapes",
    "labelTr": "Üzüm",
    "initialTr": "Ü",
    "english": [
      "Grape",
      "Grapes"
    ],
    "categories": [
      "fruit",
      "food"
    ],
    "illustration": "object-grapes",
    "src": "assets/illustrations/objects/object-grapes.svg?v=1.0.5",
    "fallback": "🍇"
  },
  {
    "id": "pear",
    "labelTr": "Armut",
    "initialTr": "A",
    "english": [
      "Pear"
    ],
    "categories": [
      "fruit",
      "food"
    ],
    "illustration": "object-pear",
    "src": "assets/illustrations/objects/object-pear.svg?v=1.0.5",
    "fallback": "🍐"
  },
  {
    "id": "carrot",
    "labelTr": "Havuç",
    "initialTr": "H",
    "english": [
      "Carrot"
    ],
    "categories": [
      "vegetable",
      "food"
    ],
    "illustration": "object-carrot",
    "src": "assets/illustrations/objects/object-carrot.svg?v=1.0.5",
    "fallback": "🥕"
  },
  {
    "id": "tomato",
    "labelTr": "Domates",
    "initialTr": "D",
    "english": [
      "Tomato"
    ],
    "categories": [
      "vegetable",
      "food"
    ],
    "illustration": "object-tomato",
    "src": "assets/illustrations/objects/object-tomato.svg?v=1.0.5",
    "fallback": "🍅"
  },
  {
    "id": "potato",
    "labelTr": "Patates",
    "initialTr": "P",
    "english": [
      "Potato"
    ],
    "categories": [
      "vegetable",
      "food"
    ],
    "illustration": "object-potato",
    "src": "assets/illustrations/objects/object-potato.svg?v=1.0.5",
    "fallback": "🥔"
  },
  {
    "id": "onion",
    "labelTr": "Soğan",
    "initialTr": "S",
    "english": [
      "Onion"
    ],
    "categories": [
      "vegetable",
      "food"
    ],
    "illustration": "object-onion",
    "src": "assets/illustrations/objects/object-onion.svg?v=1.0.5",
    "fallback": "🧅"
  },
  {
    "id": "cucumber",
    "labelTr": "Salatalık",
    "initialTr": "S",
    "english": [
      "Cucumber"
    ],
    "categories": [
      "vegetable",
      "food"
    ],
    "illustration": "object-cucumber",
    "src": "assets/illustrations/objects/object-cucumber.svg?v=1.0.5",
    "fallback": "🥒"
  },
  {
    "id": "broccoli",
    "labelTr": "Brokoli",
    "initialTr": "B",
    "english": [
      "Broccoli"
    ],
    "categories": [
      "vegetable",
      "food"
    ],
    "illustration": "object-broccoli",
    "src": "assets/illustrations/objects/object-broccoli.svg?v=1.0.5",
    "fallback": "🥦"
  },
  {
    "id": "bread",
    "labelTr": "Ekmek",
    "initialTr": "E",
    "english": [
      "Bread"
    ],
    "categories": [
      "food"
    ],
    "illustration": "object-bread",
    "src": "assets/illustrations/objects/object-bread.svg?v=1.0.5",
    "fallback": "🍞"
  },
  {
    "id": "cheese",
    "labelTr": "Peynir",
    "initialTr": "P",
    "english": [
      "Cheese"
    ],
    "categories": [
      "food"
    ],
    "illustration": "object-cheese",
    "src": "assets/illustrations/objects/object-cheese.svg?v=1.0.5",
    "fallback": "🧀"
  },
  {
    "id": "egg",
    "labelTr": "Yumurta",
    "initialTr": "Y",
    "english": [
      "Egg"
    ],
    "categories": [
      "food"
    ],
    "illustration": "object-egg",
    "src": "assets/illustrations/objects/object-egg.svg?v=1.0.5",
    "fallback": "🥚"
  },
  {
    "id": "rice",
    "labelTr": "Pilav",
    "initialTr": "P",
    "english": [
      "Rice"
    ],
    "categories": [
      "food"
    ],
    "illustration": "object-rice",
    "src": "assets/illustrations/objects/object-rice.svg?v=1.0.5",
    "fallback": "🍚"
  },
  {
    "id": "pasta",
    "labelTr": "Makarna",
    "initialTr": "M",
    "english": [
      "Pasta"
    ],
    "categories": [
      "food"
    ],
    "illustration": "object-pasta",
    "src": "assets/illustrations/objects/object-pasta.svg?v=1.0.5",
    "fallback": "🍝"
  },
  {
    "id": "pizza",
    "labelTr": "Pizza",
    "initialTr": "P",
    "english": [
      "Pizza"
    ],
    "categories": [
      "food"
    ],
    "illustration": "object-pizza",
    "src": "assets/illustrations/objects/object-pizza.svg?v=1.0.5",
    "fallback": "🍕"
  },
  {
    "id": "ball",
    "labelTr": "Top",
    "initialTr": "T",
    "english": [
      "Ball"
    ],
    "categories": [
      "toys"
    ],
    "illustration": "object-ball",
    "src": "assets/illustrations/objects/object-ball.svg?v=1.0.5",
    "fallback": "⚽"
  },
  {
    "id": "teddy-bear",
    "labelTr": "Oyuncak Ayı",
    "initialTr": "O",
    "english": [
      "Teddy Bear"
    ],
    "categories": [
      "toys"
    ],
    "illustration": "object-teddy-bear",
    "src": "assets/illustrations/objects/object-teddy-bear.svg?v=1.0.5",
    "fallback": "🧸"
  },
  {
    "id": "doll",
    "labelTr": "Oyuncak Bebek",
    "initialTr": "O",
    "english": [
      "Doll"
    ],
    "categories": [
      "toys"
    ],
    "illustration": "object-doll",
    "src": "assets/illustrations/objects/object-doll.svg?v=1.0.5",
    "fallback": "🪆"
  },
  {
    "id": "kite",
    "labelTr": "Uçurtma",
    "initialTr": "U",
    "english": [
      "Kite"
    ],
    "categories": [
      "toys"
    ],
    "illustration": "object-kite",
    "src": "assets/illustrations/objects/object-kite.svg?v=1.0.5",
    "fallback": "🪁"
  },
  {
    "id": "puzzle",
    "labelTr": "Yapboz",
    "initialTr": "Y",
    "english": [
      "Puzzle"
    ],
    "categories": [
      "toys"
    ],
    "illustration": "object-puzzle",
    "src": "assets/illustrations/objects/object-puzzle.svg?v=1.0.5",
    "fallback": "🧩"
  },
  {
    "id": "blocks",
    "labelTr": "Bloklar",
    "initialTr": "B",
    "english": [
      "Blocks"
    ],
    "categories": [
      "toys"
    ],
    "illustration": "object-blocks",
    "src": "assets/illustrations/objects/object-blocks.svg?v=1.0.5",
    "fallback": "🧱"
  },
  {
    "id": "shirt",
    "labelTr": "Tişört",
    "initialTr": "T",
    "english": [
      "Shirt"
    ],
    "categories": [
      "clothes"
    ],
    "illustration": "object-shirt",
    "src": "assets/illustrations/objects/object-shirt.svg?v=1.0.5",
    "fallback": "👕"
  },
  {
    "id": "pants",
    "labelTr": "Pantolon",
    "initialTr": "P",
    "english": [
      "Pants"
    ],
    "categories": [
      "clothes"
    ],
    "illustration": "object-pants",
    "src": "assets/illustrations/objects/object-pants.svg?v=1.0.5",
    "fallback": "👖"
  },
  {
    "id": "dress",
    "labelTr": "Elbise",
    "initialTr": "E",
    "english": [
      "Dress"
    ],
    "categories": [
      "clothes"
    ],
    "illustration": "object-dress",
    "src": "assets/illustrations/objects/object-dress.svg?v=1.0.5",
    "fallback": "👗"
  },
  {
    "id": "coat",
    "labelTr": "Mont",
    "initialTr": "M",
    "english": [
      "Coat"
    ],
    "categories": [
      "clothes"
    ],
    "illustration": "object-coat",
    "src": "assets/illustrations/objects/object-coat.svg?v=1.0.5",
    "fallback": "🧥"
  },
  {
    "id": "shorts",
    "labelTr": "Şort",
    "initialTr": "Ş",
    "english": [
      "Shorts"
    ],
    "categories": [
      "clothes"
    ],
    "illustration": "object-shorts",
    "src": "assets/illustrations/objects/object-shorts.svg?v=1.0.5",
    "fallback": "🩳"
  },
  {
    "id": "socks",
    "labelTr": "Çorap",
    "initialTr": "Ç",
    "english": [
      "Socks"
    ],
    "categories": [
      "clothes"
    ],
    "illustration": "object-socks",
    "src": "assets/illustrations/objects/object-socks.svg?v=1.0.5",
    "fallback": "🧦"
  },
  {
    "id": "book",
    "labelTr": "Kitap",
    "initialTr": "K",
    "english": [
      "Book"
    ],
    "categories": [
      "schoolItems"
    ],
    "illustration": "object-book",
    "src": "assets/illustrations/objects/object-book.svg?v=1.0.5",
    "fallback": "📕"
  },
  {
    "id": "pencil",
    "labelTr": "Kurşun Kalem",
    "initialTr": "K",
    "english": [
      "Pencil"
    ],
    "categories": [
      "schoolItems"
    ],
    "illustration": "object-pencil",
    "src": "assets/illustrations/objects/object-pencil.svg?v=1.0.5",
    "fallback": "✏️"
  },
  {
    "id": "pen",
    "labelTr": "Kalem",
    "initialTr": "K",
    "english": [
      "Pen"
    ],
    "categories": [
      "schoolItems"
    ],
    "illustration": "object-pen",
    "src": "assets/illustrations/objects/object-pen.svg?v=1.0.5",
    "fallback": "🖊️"
  },
  {
    "id": "ruler",
    "labelTr": "Cetvel",
    "initialTr": "C",
    "english": [
      "Ruler"
    ],
    "categories": [
      "schoolItems"
    ],
    "illustration": "object-ruler",
    "src": "assets/illustrations/objects/object-ruler.svg?v=1.0.5",
    "fallback": "📏"
  },
  {
    "id": "scissors",
    "labelTr": "Makas",
    "initialTr": "M",
    "english": [
      "Scissors"
    ],
    "categories": [
      "schoolItems"
    ],
    "illustration": "object-scissors",
    "src": "assets/illustrations/objects/object-scissors.svg?v=1.0.5",
    "fallback": "✂️"
  },
  {
    "id": "backpack",
    "labelTr": "Okul Çantası",
    "initialTr": "O",
    "english": [
      "Backpack",
      "Bag"
    ],
    "categories": [
      "schoolItems"
    ],
    "illustration": "object-backpack",
    "src": "assets/illustrations/objects/object-backpack.svg?v=1.0.5",
    "fallback": "🎒"
  },
  {
    "id": "chair",
    "labelTr": "Sandalye",
    "initialTr": "S",
    "english": [
      "Chair"
    ],
    "categories": [
      "homeItems"
    ],
    "illustration": "object-chair",
    "src": "assets/illustrations/objects/object-chair.svg?v=1.0.5",
    "fallback": "🪑"
  },
  {
    "id": "table",
    "labelTr": "Masa",
    "initialTr": "M",
    "english": [
      "Table"
    ],
    "categories": [
      "homeItems"
    ],
    "illustration": "object-table",
    "src": "assets/illustrations/objects/object-table.svg?v=1.0.5",
    "fallback": "🪑"
  },
  {
    "id": "lamp",
    "labelTr": "Lamba",
    "initialTr": "L",
    "english": [
      "Lamp"
    ],
    "categories": [
      "homeItems"
    ],
    "illustration": "object-lamp",
    "src": "assets/illustrations/objects/object-lamp.svg?v=1.0.5",
    "fallback": "💡"
  },
  {
    "id": "clock",
    "labelTr": "Saat",
    "initialTr": "S",
    "english": [
      "Clock"
    ],
    "categories": [
      "homeItems"
    ],
    "illustration": "object-clock",
    "src": "assets/illustrations/objects/object-clock.svg?v=1.0.5",
    "fallback": "⏰"
  },
  {
    "id": "bed",
    "labelTr": "Yatak",
    "initialTr": "Y",
    "english": [
      "Bed"
    ],
    "categories": [
      "homeItems"
    ],
    "illustration": "object-bed",
    "src": "assets/illustrations/objects/object-bed.svg?v=1.0.5",
    "fallback": "🛏️"
  },
  {
    "id": "sofa",
    "labelTr": "Koltuk",
    "initialTr": "K",
    "english": [
      "Sofa"
    ],
    "categories": [
      "homeItems"
    ],
    "illustration": "object-sofa",
    "src": "assets/illustrations/objects/object-sofa.svg?v=1.0.5",
    "fallback": "🛋️"
  },
  {
    "id": "car",
    "labelTr": "Araba",
    "initialTr": "A",
    "english": [
      "Car",
      "Toy Car"
    ],
    "categories": [
      "landVehicles"
    ],
    "illustration": "object-car",
    "src": "assets/illustrations/objects/object-car.svg?v=1.0.5",
    "fallback": "🚗"
  },
  {
    "id": "bus",
    "labelTr": "Otobüs",
    "initialTr": "O",
    "english": [
      "Bus"
    ],
    "categories": [
      "landVehicles"
    ],
    "illustration": "object-bus",
    "src": "assets/illustrations/objects/object-bus.svg?v=1.0.5",
    "fallback": "🚌"
  },
  {
    "id": "train",
    "labelTr": "Tren",
    "initialTr": "T",
    "english": [
      "Train"
    ],
    "categories": [
      "landVehicles"
    ],
    "illustration": "object-train",
    "src": "assets/illustrations/objects/object-train.svg?v=1.0.5",
    "fallback": "🚂"
  },
  {
    "id": "bicycle",
    "labelTr": "Bisiklet",
    "initialTr": "B",
    "english": [
      "Bicycle"
    ],
    "categories": [
      "landVehicles"
    ],
    "illustration": "object-bicycle",
    "src": "assets/illustrations/objects/object-bicycle.svg?v=1.0.5",
    "fallback": "🚲"
  },
  {
    "id": "motorcycle",
    "labelTr": "Motosiklet",
    "initialTr": "M",
    "english": [
      "Motorcycle"
    ],
    "categories": [
      "landVehicles"
    ],
    "illustration": "object-motorcycle",
    "src": "assets/illustrations/objects/object-motorcycle.svg?v=1.0.5",
    "fallback": "🏍️"
  },
  {
    "id": "truck",
    "labelTr": "Kamyon",
    "initialTr": "K",
    "english": [
      "Truck"
    ],
    "categories": [
      "landVehicles"
    ],
    "illustration": "object-truck",
    "src": "assets/illustrations/objects/object-truck.svg?v=1.0.5",
    "fallback": "🚚"
  },
  {
    "id": "boat",
    "labelTr": "Tekne",
    "initialTr": "T",
    "english": [
      "Boat"
    ],
    "categories": [
      "seaVehicles"
    ],
    "illustration": "object-boat",
    "src": "assets/illustrations/objects/object-boat.svg?v=1.0.5",
    "fallback": "⛵"
  },
  {
    "id": "ship",
    "labelTr": "Gemi",
    "initialTr": "G",
    "english": [
      "Ship"
    ],
    "categories": [
      "seaVehicles"
    ],
    "illustration": "object-ship",
    "src": "assets/illustrations/objects/object-ship.svg?v=1.0.5",
    "fallback": "🚢"
  },
  {
    "id": "sailboat",
    "labelTr": "Yelkenli",
    "initialTr": "Y",
    "english": [
      "Sailboat"
    ],
    "categories": [
      "seaVehicles"
    ],
    "illustration": "object-sailboat",
    "src": "assets/illustrations/objects/object-sailboat.svg?v=1.0.5",
    "fallback": "⛵"
  },
  {
    "id": "ferry",
    "labelTr": "Feribot",
    "initialTr": "F",
    "english": [
      "Ferry"
    ],
    "categories": [
      "seaVehicles"
    ],
    "illustration": "object-ferry",
    "src": "assets/illustrations/objects/object-ferry.svg?v=1.0.5",
    "fallback": "⛴️"
  },
  {
    "id": "airplane",
    "labelTr": "Uçak",
    "initialTr": "U",
    "english": [
      "Airplane",
      "Plane"
    ],
    "categories": [
      "airVehicles"
    ],
    "illustration": "object-airplane",
    "src": "assets/illustrations/objects/object-airplane.svg?v=1.0.5",
    "fallback": "✈️"
  },
  {
    "id": "helicopter",
    "labelTr": "Helikopter",
    "initialTr": "H",
    "english": [
      "Helicopter"
    ],
    "categories": [
      "airVehicles"
    ],
    "illustration": "object-helicopter",
    "src": "assets/illustrations/objects/object-helicopter.svg?v=1.0.5",
    "fallback": "🚁"
  },
  {
    "id": "hot-air-balloon",
    "labelTr": "Sıcak Hava Balonu",
    "initialTr": "S",
    "english": [
      "Hot Air Balloon",
      "Hot-air Balloon"
    ],
    "categories": [
      "airVehicles"
    ],
    "illustration": "object-hot-air-balloon",
    "src": "assets/illustrations/objects/object-hot-air-balloon.svg?v=1.0.5",
    "fallback": "🎈"
  },
  {
    "id": "glider",
    "labelTr": "Planör",
    "initialTr": "P",
    "english": [
      "Glider"
    ],
    "categories": [
      "airVehicles"
    ],
    "illustration": "object-glider",
    "src": "assets/illustrations/objects/object-glider.svg?v=1.0.5",
    "fallback": "✈️"
  },
  {
    "id": "tree",
    "labelTr": "Ağaç",
    "initialTr": "A",
    "english": [
      "Tree"
    ],
    "categories": [
      "nature"
    ],
    "illustration": "object-tree",
    "src": "assets/illustrations/objects/object-tree.svg?v=1.0.5",
    "fallback": "🌳"
  },
  {
    "id": "flower",
    "labelTr": "Çiçek",
    "initialTr": "Ç",
    "english": [
      "Flower"
    ],
    "categories": [
      "nature"
    ],
    "illustration": "object-flower",
    "src": "assets/illustrations/objects/object-flower.svg?v=1.0.5",
    "fallback": "🌻"
  },
  {
    "id": "mountain",
    "labelTr": "Dağ",
    "initialTr": "D",
    "english": [
      "Mountain"
    ],
    "categories": [
      "nature"
    ],
    "illustration": "object-mountain",
    "src": "assets/illustrations/objects/object-mountain.svg?v=1.0.5",
    "fallback": "⛰️"
  },
  {
    "id": "river",
    "labelTr": "Nehir",
    "initialTr": "N",
    "english": [
      "River"
    ],
    "categories": [
      "nature"
    ],
    "illustration": "object-river",
    "src": "assets/illustrations/objects/object-river.svg?v=1.0.5",
    "fallback": "🏞️"
  },
  {
    "id": "forest",
    "labelTr": "Orman",
    "initialTr": "O",
    "english": [
      "Forest"
    ],
    "categories": [
      "nature"
    ],
    "illustration": "object-forest",
    "src": "assets/illustrations/objects/object-forest.svg?v=1.0.5",
    "fallback": "🌲"
  },
  {
    "id": "rainbow",
    "labelTr": "Gökkuşağı",
    "initialTr": "G",
    "english": [
      "Rainbow"
    ],
    "categories": [
      "nature"
    ],
    "illustration": "object-rainbow",
    "src": "assets/illustrations/objects/object-rainbow.svg?v=1.0.5",
    "fallback": "🌈"
  }
].map(item => Object.freeze(item)));
  const PUZZLE_SCENES = Object.freeze([
  {
    "id": "cat-garden",
    "illustration": "scene-dinosaur-valley",
    "label": "Dinozor Vadisi",
    "description": "Bitkiler, yumurtalar ve uzaktaki volkanla sevimli dinozor vadisi",
    "sceneKey": "dinosaur-valley",
    "src": "assets/illustrations/puzzles/scene-dinosaur-valley.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "apple-tree",
    "illustration": "scene-space-adventure",
    "label": "Uzay Macerası",
    "description": "Roket, gezegenler, uydu ve renkli yıldızlarla uzay sahnesi",
    "sceneKey": "space-adventure",
    "src": "assets/illustrations/puzzles/scene-space-adventure.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "red-car",
    "illustration": "scene-unicorn-garden",
    "label": "Unicorn Bahçesi",
    "description": "Gökkuşağı, dere, çiçekler ve kelebeklerle özgün unicorn bahçesi",
    "sceneKey": "unicorn-garden",
    "src": "assets/illustrations/puzzles/scene-unicorn-garden.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "toy-kite",
    "illustration": "scene-underwater-world",
    "label": "Deniz Altı Dünyası",
    "description": "Balıklar, ahtapot, mercanlar ve baloncuklarla deniz altı sahnesi",
    "sceneKey": "underwater-world",
    "src": "assets/illustrations/puzzles/scene-underwater-world.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "little-house",
    "illustration": "scene-forest-picnic",
    "label": "Ormanda Piknik",
    "description": "Orman hayvanları, piknik örtüsü ve meyve sepetiyle piknik sahnesi",
    "sceneKey": "forest-picnic",
    "src": "assets/illustrations/puzzles/scene-forest-picnic.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "mountain-lake",
    "illustration": "scene-farm-morning",
    "label": "Çiftlik Sabahı",
    "description": "Ahır, inek, tavuk, traktör ve samanlarla çiftlik sabahı",
    "sceneKey": "farm-morning",
    "src": "assets/illustrations/puzzles/scene-farm-morning.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "sea-turtle",
    "illustration": "scene-train-station",
    "label": "Tren İstasyonu",
    "description": "Renkli tren, istasyon saati, bavullar ve ağaçlarla istasyon sahnesi",
    "sceneKey": "train-station",
    "src": "assets/illustrations/puzzles/scene-train-station.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "space-rocket",
    "illustration": "scene-construction-site",
    "label": "İnşaat Araçları",
    "description": "Ekskavatör, kamyon, vinç ve güvenlik konileriyle şantiye sahnesi",
    "sceneKey": "construction-site",
    "src": "assets/illustrations/puzzles/scene-construction-site.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "friendly-dinosaur",
    "illustration": "scene-winter-playground",
    "label": "Kış Oyun Alanı",
    "description": "Kardan adam, kızak, çam ağaçları ve kulübeyle kış sahnesi",
    "sceneKey": "winter-playground",
    "src": "assets/illustrations/puzzles/scene-winter-playground.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "rainbow-unicorn",
    "illustration": "scene-hot-air-balloons",
    "label": "Sıcak Hava Balonları",
    "description": "Tepeler, evler ve bulutların üzerinde renkli sıcak hava balonları",
    "sceneKey": "hot-air-balloons",
    "src": "assets/illustrations/puzzles/scene-hot-air-balloons.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "coral-fish",
    "illustration": "scene-safari-waterhole",
    "label": "Safari Su Başı",
    "description": "Zürafa, fil ve zebranın su başında buluştuğu sakin safari sahnesi",
    "sceneKey": "safari-waterhole",
    "src": "assets/illustrations/puzzles/scene-safari-waterhole.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "happy-train",
    "illustration": "scene-fruit-picnic",
    "label": "Meyve Pikniği",
    "description": "Meyve sepeti, karpuz, çilek, üzüm ve çiçeklerle piknik sahnesi",
    "sceneKey": "fruit-picnic",
    "src": "assets/illustrations/puzzles/scene-fruit-picnic.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "panda-picnic",
    "illustration": "scene-seaside-sandcastle",
    "label": "Deniz Kenarında Kumdan Kale",
    "description": "Kumdan kale, kova, deniz kabukları, şemsiye ve uzakta yelkenli",
    "sceneKey": "seaside-sandcastle",
    "src": "assets/illustrations/puzzles/scene-seaside-sandcastle.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "rainbow-garden",
    "illustration": "scene-forest-animals",
    "label": "Orman Hayvanları",
    "description": "Geyik, tavşan, tilki, baykuş, mantarlar ve dereyle orman sahnesi",
    "sceneKey": "forest-animals",
    "src": "assets/illustrations/puzzles/scene-forest-animals.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "strawberry-basket",
    "illustration": "scene-colorful-city",
    "label": "Renkli Şehir",
    "description": "Arabalar, otobüs, bisiklet, trafik ışığı ve yaya geçidiyle şehir sahnesi",
    "sceneKey": "colorful-city",
    "src": "assets/illustrations/puzzles/scene-colorful-city.svg?v=1.0.5",
    "category": "scene"
  },
  {
    "id": "moon-rover",
    "illustration": "scene-rainbow-garden",
    "label": "Gökkuşağı Bahçesi",
    "description": "Gökkuşağı, çiçekler, kelebek, sulama kabı, kuş ve küçük gölet",
    "sceneKey": "rainbow-garden",
    "src": "assets/illustrations/puzzles/scene-rainbow-garden.svg?v=1.0.5",
    "category": "scene"
  }
].map(item => Object.freeze(item)));
  const byId = new Map(OBJECTS.map(item => [item.id, item]));
  const byEnglish = new Map(OBJECTS.flatMap(item => item.english.map(word => [word.toLocaleLowerCase("en-US"), item])));
  const byIllustration = new Map(OBJECTS.map(item => [item.illustration, item]));
  function get(id) { return byId.get(id); }
  function getByEnglish(word) { return typeof word === "string" ? byEnglish.get(word.toLocaleLowerCase("en-US")) : undefined; }
  function getByIllustration(id) { return byIllustration.get(id); }
  function getByCategory(category) { return OBJECTS.filter(item => item.categories.includes(category)); }
  function validate() {
    const problems = []; const ids = new Set(); const art = new Set(); const sources = new Set();
    OBJECTS.forEach(item => {
      if (!item.id || ids.has(item.id)) problems.push(`Geçersiz nesne kimliği: ${item.id || "boş"}`);
      if (!item.labelTr || !item.initialTr || !/^[A-ZÇĞİÖŞÜ]$/u.test(item.initialTr)) problems.push(`Geçersiz Türkçe metadata: ${item.id}`);
      if (!item.illustration || art.has(item.illustration) || !item.src.startsWith("assets/illustrations/objects/") || !/\.svg\?v=/.test(item.src)) problems.push(`Geçersiz nesne görseli: ${item.id}`);
      if (!Array.isArray(item.categories) || !item.categories.length || !Array.isArray(item.english) || !item.english.length) problems.push(`Eksik nesne sınıflandırması: ${item.id}`);
      if (sources.has(item.src)) problems.push(`Yinelenen nesne kaynağı: ${item.src}`);
      ids.add(item.id); art.add(item.illustration); sources.add(item.src);
    });
    const puzzleIds = new Set(); const puzzleSources = new Set();
    PUZZLE_SCENES.forEach(scene => {
      if (!scene.id || puzzleIds.has(scene.id) || !scene.label || !scene.description) problems.push(`Geçersiz yapboz metadata'sı: ${scene.id || "boş"}`);
      if (!scene.src.startsWith("assets/illustrations/puzzles/") || !/\.svg\?v=/.test(scene.src) || puzzleSources.has(scene.src)) problems.push(`Geçersiz yapboz kaynağı: ${scene.id}`);
      puzzleIds.add(scene.id); puzzleSources.add(scene.src);
    });
    if (OBJECTS.length < 48) problems.push("Profesyonel nesne paketi 48 öğenin altında.");
    if (PUZZLE_SCENES.length !== 16) problems.push("Tam 16 yapboz sahnesi gerekli.");
    return { valid: problems.length === 0, problems };
  }
  return Object.freeze({ VERSION, OBJECTS, PUZZLE_SCENES, get, getByEnglish, getByIllustration, getByCategory, validate });
});
