import { AccountRepository } from "../../infrastructure/repository/AccountRepository";
import { MailerGateway } from "../../infrastructure/gateway/MailerGateway";
import Account from "../../domain/Account";

export default class Signup {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly mailerGateway: MailerGateway
  ) {}

  async execute(input: any) {
    const { name, email, cpf, carPlate, isPassenger, isDriver } = input;
    if (await this.accountRepository.getAccountByEmail(email)) throw new Error("Account already exists");
    const account = Account.create(name, email, cpf, carPlate, isPassenger, isDriver);
    await this.accountRepository.saveAccount(account);
    this.mailerGateway.send(email, "Welcome!", "");
    return { accountId: account.accountId };
  }
}
