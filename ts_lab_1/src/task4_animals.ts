export {};

interface Animal {
  readonly name: string;
  habitat: string;
  legs?: number;        // опціонально: у риби лап немає
  sound?(): string;     // опціонально: не всі тварини "говорять"
  move(): string;
}

class Cat implements Animal {
  legs: number = 4;

  constructor(public readonly name: string, public habitat: string = "дім") {}

  sound(): string {
    return "Няв!";
  }

  move(): string {
    return `${this.name} ходить на ${this.legs} лапах`;
  }
}

class Bird implements Animal {
  legs: number = 2;

  constructor(
    public readonly name: string,
    public habitat: string,
    private canFly: boolean = true
  ) {}

  sound(): string {
    return "Цвірінь!";
  }

  move(): string {
    return this.canFly ? `${this.name} літає` : `${this.name} ходить`;
  }
}

class Fish implements Animal {
  // legs та sound не реалізовані, бо вони опціональні
  constructor(public readonly name: string, public habitat: string) {}

  move(): string {
    return `${this.name} пливе`;
  }
}

function describe(animal: Animal): void {
  console.log(`${animal.name} (середовище: ${animal.habitat})`);
  console.log(`  Рух: ${animal.move()}`);
  console.log(`  Лапи: ${animal.legs ?? "немає"}`);
  console.log(`  Звук: ${animal.sound ? animal.sound() : "мовчить"}`);
}

const animals: Animal[] = [
  new Cat("Мурзик"),
  new Bird("Горобець", "ліс"),
  new Bird("Пінгвін", "Антарктида", false),
  new Fish("Золота рибка", "акваріум"),
];

animals.forEach(describe);
