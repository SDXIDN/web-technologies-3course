export {};

// Параметр times має значення за замовчуванням
function greet(name: string, times: number = 1): string {
  return Array(times).fill(`Привіт, ${name}!`).join(" ");
}

// Функція, що нічого не повертає
function printLine(text: string): void {
  console.log(`>>> ${text}`);
}

printLine(greet("Олена"));       // times не передано -> 1
printLine(greet("Андрій", 3));   // times = 3
