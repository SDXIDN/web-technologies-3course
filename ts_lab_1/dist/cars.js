"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Car {
    constructor(brand, // доступна всім, змінювати не можна
    model, year, price) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this._price = price;
    }
    get price() {
        return this._price;
    }
    set price(value) {
        if (value <= 0) {
            throw new Error("Ціна має бути більшою за 0");
        }
        this._price = value;
    }
    baseInfo() {
        return `${this.brand} ${this.model}, ${this.year} р., ${this.price} $`;
    }
}
class Toyota extends Car {
    constructor(model, year, price, isHybrid) {
        super("Toyota", model, year, price);
        this.isHybrid = isHybrid;
    }
    describe() {
        console.log(this.baseInfo());
        console.log(`  Гібрид: ${this.isHybrid ? "так" : "ні"}`);
    }
}
class BMW extends Car {
    constructor(model, year, price, engineVolume, hasMPackage) {
        super("BMW", model, year, price);
        this.engineVolume = engineVolume;
        this.hasMPackage = hasMPackage;
    }
    describe() {
        console.log(this.baseInfo());
        console.log(`  Об'єм двигуна: ${this.engineVolume} л`);
        console.log(`  M-пакет: ${this.hasMPackage ? "є" : "немає"}`);
    }
}
class Tesla extends Car {
    constructor(model, year, price, batteryKWh, rangeKm) {
        super("Tesla", model, year, price);
        this.batteryKWh = batteryKWh;
        this.rangeKm = rangeKm;
    }
    describe() {
        console.log(this.baseInfo());
        console.log(`  Батарея: ${this.batteryKWh} кВт·год`);
        console.log(`  Запас ходу: ${this.rangeKm} км`);
    }
}
const cars = [
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
//# sourceMappingURL=cars.js.map