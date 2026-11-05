export {};

// Прості типи
const userName: string = "Олена";
const age: number = 20;
const isStudent: boolean = true;
let anything: any = "Тип any приймає будь-яке значення";

console.log("string:", userName);
console.log("number:", age);
console.log("boolean:", isStudent);
console.log("any (рядок):", anything);

anything = 42;
console.log("any (число):", anything);
anything = false;
console.log("any (boolean):", anything);

// Масиви з конкретними типами елементів
const fruits: string[] = ["яблуко", "груша", "слива"];
const grades: number[] = [90, 75, 100];
const flags: Array<boolean> = [true, false, true];

fruits.push("вишня");
// fruits.push(5); // помилка компіляції: number не можна додати до string[]

console.log("Масив рядків:", fruits);
console.log("Масив чисел:", grades);
console.log("Масив boolean:", flags);
