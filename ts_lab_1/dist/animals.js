"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cat {
    constructor(name, habitat = "дім") {
        this.name = name;
        this.habitat = habitat;
        this.legs = 4;
    }
    sound() {
        return "Няв!";
    }
    move() {
        return `${this.name} ходить на ${this.legs} лапах`;
    }
}
class Bird {
    constructor(name, habitat, canFly = true) {
        this.name = name;
        this.habitat = habitat;
        this.canFly = canFly;
        this.legs = 2;
    }
    sound() {
        return "Цвірінь!";
    }
    move() {
        return this.canFly ? `${this.name} літає` : `${this.name} ходить`;
    }
}
class Fish {
    // legs та sound не реалізовані, бо вони опціональні
    constructor(name, habitat) {
        this.name = name;
        this.habitat = habitat;
    }
    move() {
        return `${this.name} пливе`;
    }
}
function describe(animal) {
    console.log(`${animal.name} (середовище: ${animal.habitat})`);
    console.log(`  Рух: ${animal.move()}`);
    console.log(`  Лапи: ${animal.legs ?? "немає"}`);
    console.log(`  Звук: ${animal.sound ? animal.sound() : "мовчить"}`);
}
const animals = [
    new Cat("Мурзик"),
    new Bird("Горобець", "ліс"),
    new Bird("Пінгвін", "Антарктида", false),
    new Fish("Золота рибка", "акваріум"),
];
animals.forEach(describe);
//# sourceMappingURL=animals.js.map