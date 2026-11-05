import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

type Size = "small" | "large";
type Topping = "chocolate" | "caramel" | "berries";

const SIZE_PRICES: Record<Size, number> = { small: 10, large: 25 };
const TOPPING_PRICES: Record<Topping, number> = {
  chocolate: 5,
  caramel: 6,
  berries: 10,
};
const MARSHMALLOW_PRICE = 5;

const TOPPING_CHOICES: Record<string, Topping> = {
  "1": "chocolate",
  "2": "caramel",
  "3": "berries",
};

const TOPPING_NAMES: Record<Topping, string> = {
  chocolate: "шоколад",
  caramel: "карамель",
  berries: "ягоди",
};

function calculateIceCreamPrice(
  size: Size,
  toppings: Topping[],
  withMarshmallow: boolean
): number {
  if (toppings.length === 0) {
    throw new Error("Потрібна мінімум одна начинка");
  }
  const toppingsCost = toppings.reduce((sum, t) => sum + TOPPING_PRICES[t], 0);
  const marshmallowCost = withMarshmallow ? MARSHMALLOW_PRICE : 0;
  return SIZE_PRICES[size] + toppingsCost + marshmallowCost;
}

function askSize(): Size {
  while (true) {
    const answer = prompt(
      "Розмір (1 - маленький 10 грн, 2 - великий 25 грн): "
    ).trim();
    if (answer === "1") return "small";
    if (answer === "2") return "large";
    console.log("Введіть 1 або 2.");
  }
}

function askToppings(): Topping[] {
  while (true) {
    const answer = prompt(
      "Начинки через кому (1 - шоколад +5, 2 - карамель +6, 3 - ягоди +10): "
    );
    const keys = answer.split(/[,\s]+/).filter((k) => k !== "");
    const valid = keys.length > 0 && keys.every((k) => k in TOPPING_CHOICES);
    if (valid) {
      // Set прибирає дублікати, наприклад "1,1"
      return [...new Set(keys.map((k) => TOPPING_CHOICES[k]))];
    }
    console.log("Оберіть мінімум одну начинку, наприклад: 1,3");
  }
}

function askMarshmallow(): boolean {
  while (true) {
    const answer = prompt("Посипати маршмелоу (+5 грн)? (так/ні): ")
      .trim()
      .toLowerCase();
    if (answer === "так" || answer === "y") return true;
    if (answer === "ні" || answer === "n") return false;
    console.log("Введіть «так» або «ні».");
  }
}

const size = askSize();
const toppings = askToppings();
const marshmallow = askMarshmallow();

const total = calculateIceCreamPrice(size, toppings, marshmallow);

console.log("\n--- Ваше замовлення ---");
console.log(`Розмір: ${size === "small" ? "маленький" : "великий"}`);
console.log(`Начинки: ${toppings.map((t) => TOPPING_NAMES[t]).join(", ")}`);
console.log(`Маршмелоу: ${marshmallow ? "так" : "ні"}`);
console.log(`Разом до сплати: ${total} грн`);
