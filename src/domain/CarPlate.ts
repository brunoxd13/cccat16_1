export default class CarPlate {
  private value: string;

  constructor(carPlate: string) {
    if (carPlate && !carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate")
    this.value = carPlate;
  }

  getValue(): string {
    return this.value;
  }
}