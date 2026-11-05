"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Book {
    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isBorrowed = false;
    }
    borrow() {
        this.isBorrowed = true;
    }
    describe() {
        return `Книга "${this.title}", ${this.author}, ${this.pages} стор.`;
    }
}
class Magazine {
    constructor(title, author, issueNumber) {
        this.title = title;
        this.author = author;
        this.issueNumber = issueNumber;
        this.isBorrowed = false;
    }
    borrow() {
        this.isBorrowed = true;
    }
    describe() {
        return `Журнал "${this.title}", ${this.author}, випуск №${this.issueNumber}`;
    }
}
class DVD {
    constructor(title, author, durationMinutes) {
        this.title = title;
        this.author = author;
        this.durationMinutes = durationMinutes;
        this.isBorrowed = false;
    }
    borrow() {
        this.isBorrowed = true;
    }
    describe() {
        return `DVD "${this.title}", ${this.author}, ${this.durationMinutes} хв`;
    }
}
class Library {
    constructor() {
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
    findItemByName(name) {
        return this.items.find((i) => i.title.toLowerCase() === name.toLowerCase());
    }
    printAvailableItems() {
        const available = this.items.filter((i) => !i.isBorrowed);
        if (available.length === 0) {
            console.log("Доступних елементів немає");
            return;
        }
        available.forEach((i) => console.log(`- ${i.describe()}`));
    }
}
const library = new Library();
library.addItem(new Book("Кобзар", "Тарас Шевченко", 320));
library.addItem(new Book("Тіні забутих предків", "Михайло Коцюбинський", 160));
library.addItem(new Magazine("National Geographic", "Редакція", 11));
library.addItem(new DVD("Інтерстеллар", "Крістофер Нолан", 169));
console.log("Доступні елементи:");
library.printAvailableItems();
const item = library.findItemByName("Кобзар");
if (item) {
    item.borrow();
    console.log(`\nПозичено: ${item.title}`);
}
console.log("\nПісля позичання:");
library.printAvailableItems();
console.log("\nПошук неіснуючого:", library.findItemByName("Невідомо"));
//# sourceMappingURL=library.js.map