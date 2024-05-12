import Account from "../../domain/entity/Account";
import DatabaseConnection from "../database/DatabaseConnection";

export interface AccountRepository {
  getAccountByEmail(email: string): Promise<Account | undefined>;
  getAccountById(accountId: string): Promise<Account>;
  saveAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async getAccountByEmail(email: string): Promise<Account | undefined> {
    const [accountData] = await this.databaseConnection.query(
      "select * from cccat16.account where email = $1",
      [email]
    );
    if (!accountData) return;
    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver
    );
  }

  async getAccountById(accountId: string): Promise<Account> {
    const [accountData] = await this.databaseConnection.query(
      "select * from cccat16.account where account_id = $1",
      [accountId]
    );

    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver
    );
  }

  async saveAccount(account: Account) {
    await this.databaseConnection.query(
      "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver]
    );
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  private accounts: Account[] = [];

  async getAccountByEmail(email: string) : Promise<any>{
    return this.accounts.find((acc: Account) => acc.getEmail() === email);
  }

  async getAccountById(accountId: string) : Promise<any> {
    return this.accounts.find((acc : Account) => acc.accountId === accountId);
  }

  async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }
}
