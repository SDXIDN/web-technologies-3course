export {};

interface Shape {
  getArea(): number;
  getPerimeter(): number;
  scale(factor: number): void;
}

function assertPositive(value: number, label: string): void {
  if (!(value > 0)) {
    throw new Error(`${label} має бути більшим за 0`);
  }
}

class Circle implements Shape {
  constructor(private radius: number) {
    assertPositive(radius, "Радіус");
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  scale(factor: number): void {
    assertPositive(factor, "Коефіцієнт");
    this.radius *= factor;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {
    assertPositive(width, "Ширина");
    assertPositive(height, "Висота");
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  scale(factor: number): void {
    assertPositive(factor, "Коефіцієнт");
    this.width *= factor;
    this.height *= factor;
  }
}

class Triangle implements Shape {
  constructor(private a: number, private b: number, private c: number) {
    assertPositive(a, "Сторона a");
    assertPositive(b, "Сторона b");
    assertPositive(c, "Сторона c");
    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new Error("Трикутник з такими сторонами не існує");
    }
  }

  getArea(): number {
    // Формула Герона
    const p = this.getPerimeter() / 2;
    return Math.sqrt(p * (p - this.a) * (p - this.b) * (p - this.c));
  }

  getPerimeter(): number {
    return this.a + this.b + this.c;
  }

  scale(factor: number): void {
    assertPositive(factor, "Коефіцієнт");
    this.a *= factor;
    this.b *= factor;
    this.c *= factor;
  }
}

function printTotals(shapes: Shape[]): void {
  const totalArea = shapes.reduce((sum, s) => sum + s.getArea(), 0);
  const totalPerimeter = shapes.reduce((sum, s) => sum + s.getPerimeter(), 0);
  console.log(`Загальна площа: ${totalArea.toFixed(2)}`);
  console.log(`Загальний периметр: ${totalPerimeter.toFixed(2)}`);
}

const shapes: Shape[] = [
  new Circle(3),
  new Rectangle(4, 5),
  new Triangle(3, 4, 5),
];

console.log("До масштабування:");
printTotals(shapes);

shapes.forEach((s) => s.scale(2));

console.log("Після масштабування (x2):");
printTotals(shapes);
