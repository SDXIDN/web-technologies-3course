export {};

interface Payable {
  pay(): void;
}

abstract class Employee {
  constructor(
    public name: string,
    public age: number,
    protected salary: number // річна зарплата, грн
  ) {}

  abstract getAnnualBonus(): number;
}

class Developer extends Employee implements Payable {
  getAnnualBonus(): number {
    return this.salary * 0.1;
  }

  pay(): void {
    console.log(`Розробнику ${this.name} виплачено зарплату ${this.salary} грн`);
  }
}

class Manager extends Employee implements Payable {
  getAnnualBonus(): number {
    return this.salary * 0.2;
  }

  pay(): void {
    console.log(`Менеджеру ${this.name} виплачено зарплату ${this.salary} грн`);
  }
}

const employees: Employee[] = [
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
const payables: Payable[] = employees.filter(
  (e): e is Employee & Payable => "pay" in e
);
payables.forEach((p) => p.pay());
