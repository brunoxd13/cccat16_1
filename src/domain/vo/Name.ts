export default class Name {
  private value: string;

  constructor(name: string) {
    if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
    this.value = name;
  }

  getValue(): string {
    return this.value;
  }
}