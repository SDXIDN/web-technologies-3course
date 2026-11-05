export {};

interface LibraryItem {
  title: string;
  author: string;
  isBorrowed: boolean;
  borrow(): void;
  describe(): string;
}

class Book implements LibraryItem {
  isBorrowed: boolean = false;

  constructor(
    public title: string,
    public author: string,
    public pages: number
  ) {}

  borrow(): void {
    this.isBorrowed = true;
  }

  describe(): string {
    return `Книга "${this.title}", ${this.author}, ${this.pages} стор.`;
  }
}

class Magazine implements LibraryItem {
  isBorrowed: boolean = false;

  constructor(
    public title: string,
    public author: string,
    public issueNumber: number
  ) {}

  borrow(): void {
    this.isBorrowed = true;
  }

  describe(): string {
    return `Журнал "${this.title}", ${this.author}, випуск №${this.issueNumber}`;
  }
}

class DVD implements LibraryItem {
  isBorrowed: boolean = false;

  constructor(
    public title: string,
    public author: string,
    public durationMinutes: number
  ) {}

  borrow(): void {
    this.isBorrowed = true;
  }

  describe(): string {
    return `DVD "${this.title}", ${this.author}, ${this.durationMinutes} хв`;
  }
}

class Library {
  private items: LibraryItem[] = [];

  addItem(item: LibraryItem): void {
    this.items.push(item);
  }

  findItemByName(name: string): LibraryItem | undefined {
    return this.items.find(
      (i) => i.title.toLowerCase() === name.toLowerCase()
    );
  }

  printAvailableItems(): void {
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
