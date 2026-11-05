"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Employee {
    constructor(name, age, salary // річна зарплата, грн
    ) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }
}
class Developer extends Employee {
    getAnnualBonus() {
        return this.salary * 0.1;
    }
    pay() {
        console.log(`Розробнику ${this.name} виплачено зарплату ${this.salary} грн`);
    }
}
class Manager extends Employee {
    getAnnualBonus() {
        return this.salary * 0.2;
    }
    pay() {
        console.log(`Менеджеру ${this.name} виплачено зарплату ${this.salary} грн`);
    }
}
const employees = [
    new Developer("Іван", 28, 600000),
    new Developer("Марія", 32, 800000),
    new Manager("Олег", 40, 900000),
    new Manager("Наталія", 36, 1000000),
];
employees.forEach((e) => {
    console.log(`${e.name}: бонус ${e.getAnnualBonus()} грн`);
});
const totalBonus = employees.reduce((sum, e) => sum + e.getAnnualBonus(), 0);
console.log(`Загальна річна сума бонусів: ${totalBonus} грн`);
// Виклик pay() доступний лише для типу Payable
const payables = employees.filter((e) => "pay" in e);
payables.forEach((p) => p.pay());
//# sourceMappingURL=employees.js.map