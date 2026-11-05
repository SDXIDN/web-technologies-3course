"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Прості типи
const userName = "Олена";
const age = 20;
const isStudent = true;
let anything = "Тип any приймає будь-яке значення";
console.log("string:", userName);
console.log("number:", age);
console.log("boolean:", isStudent);
console.log("any (рядок):", anything);
anything = 42;
console.log("any (число):", anything);
anything = false;
console.log("any (boolean):", anything);
// Масиви з конкретними типами елементів
const fruits = ["яблуко", "груша", "слива"];
const grades = [90, 75, 100];
const flags = [true, false, true];
fruits.push("вишня");
// fruits.push(5); // помилка компіляції: number не можна додати до string[]
console.log("Масив рядків:", fruits);
console.log("Масив чисел:", grades);
console.log("Масив boolean:", flags);
//# sourceMappingURL=variables.js.map