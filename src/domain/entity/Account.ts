import crypto from "crypto";
import CarPlate from "../vo/CarPlate";
import Cpf from "../vo/Cpf";
import Email from "../vo/Email";
import Name from "../vo/Name";

export default class Account {
  private constructor(
    readonly accountId: string,
    private name: Name,
    private email: Email,
    private cpf: Cpf,
    private carPlate: CarPlate,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
  ) {}

  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    const accountId = crypto.randomUUID();
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      new CarPlate(carPlate),
      isPassenger,
      isDriver,
    );
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      new CarPlate(carPlate),
      isPassenger,
      isDriver,
    );
  }

  setName(name: string) {
    this.name = new Name(name);
  }

  getName(): string {
    return this.name.getValue();
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getCpf(): string {
    return this.cpf.getValue();
  }

  getCarPlate(): string {
    return this.carPlate.getValue();
  }
}