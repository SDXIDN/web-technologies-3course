export {};

abstract class Car {
  private _price: number;            // доступна лише в Car, назовні через get/set
  protected year: number;            // доступна в Car та в похідних класах

  constructor(
    public readonly brand: string,   // доступна всім, змінювати не можна
    public model: string,
    year: number,
    price: number
  ) {
    this.year = year;
    this._price = price;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (value <= 0) {
      throw new Error("Ціна має бути більшою за 0");
    }
    this._price = value;
  }

  protected baseInfo(): string {
    return `${this.brand} ${this.model}, ${this.year} р., ${this.price} $`;
  }

  abstract describe(): void;
}

class Toyota extends Car {
  constructor(
    model: string,
    year: number,
    price: number,
    private isHybrid: boolean
  ) {
    super("Toyota", model, year, price);
  }

  describe(): void {
    console.log(this.baseInfo());
    console.log(`  Гібрид: ${this.isHybrid ? "так" : "ні"}`);
  }
}

class BMW extends Car {
  constructor(
    model: string,
    year: number,
    price: number,
    private engineVolume: number,
    public hasMPackage: boolean
  ) {
    super("BMW", model, year, price);
  }

  describe(): void {
    console.log(this.baseInfo());
    console.log(`  Об'єм двигуна: ${this.engineVolume} л`);
    console.log(`  M-пакет: ${this.hasMPackage ? "є" : "немає"}`);
  }
}

class Tesla extends Car {
  constructor(
    model: string,
    year: number,
    price: number,
    private batteryKWh: number,
    protected rangeKm: number
  ) {
    super("Tesla", model, year, price);
  }

  describe(): void {
    console.log(this.baseInfo());
    console.log(`  Батарея: ${this.batteryKWh} кВт·год`);
    console.log(`  Запас ходу: ${this.rangeKm} км`);
  }
}

const cars: Car[] = [
  new Toyota("Camry", 2021, 28000, false),
  new Toyota("Prius", 2023, 31000, true),
  new BMW("X5", 2022, 65000, 3.0, true),
  new BMW("320i", 2020, 38000, 2.0, false),
  new Tesla("Model 3", 2023, 42000, 60, 513),
  new Tesla("Model Y", 2024, 48000, 75, 533),
];

cars.forEach((car) => car.describe());

// Зміна ціни через setter
cars[0].price = 27000;
console.log(`Нова ціна ${cars[0].model}: ${cars[0].price} $`);
