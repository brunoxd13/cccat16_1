import { validate as validateCpf } from "./validateCpf";
import { AccountDAO } from "../resource/AccountDAO";
import { MailerGateway } from "../resource/MailerGateway";

export class Signup {
  constructor(readonly accountDAO : AccountDAO, readonly mailerGateway: MailerGateway){

  }

  async execute(input: any) {
    const { name, email, cpf, carPlate, isDriver } = input;

    if (await this.accountDAO.getAccountByEmail(email)) throw new Error("Account already exists");
    if (!validateName(name)) throw new Error("Invalid name");
    if (!validateEmail(email)) throw new Error("Invalid email");
    if (!validateCpf(cpf)) throw new Error("Invalid CPF");
    if (!!isDriver && !validateCarPlate(carPlate)) throw new Error("Invalid car plate");

    const id = await this.accountDAO.saveAccount(input);
    this.mailerGateway.send(email, "Welcome!", "");

    return { accountId: id }
  }

}

const validateName = (name: string) => {
  return name.match(/[a-zA-Z] [a-zA-Z]+/);
};

const validateEmail = (email: string) => {
  return email.match(/^(.+)@(.+)$/);
};

const validateCarPlate = (carPlate: string) => {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/);
};
