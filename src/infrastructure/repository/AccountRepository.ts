import pgp from "pg-promise";
import Account from "../../domain/Account";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/app";

export interface AccountRepository {
  getAccountByEmail(email: string): Promise<Account | undefined>;
  getAccountById(accountId: string): Promise<Account>;
  saveAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  async getAccountByEmail(email: string): Promise<Account | undefined> {
    const connection = pgp()(DATABASE_URL);
    const [accountData] = await connection.query(
      "select * from cccat16.account where email = $1",
      [email]
    );
    await connection.$pool.end();
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
    const connection = pgp()(DATABASE_URL);
    const [accountData] = await connection.query(
      "select * from cccat16.account where account_id = $1",
      [accountId]
    );
    await connection.$pool.end();
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
    const connection = pgp()(DATABASE_URL);
    try {
      const { accountId, name, email, cpf, carPlate, isPassenger, isDriver } = account;
      await connection.query(
        "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
        [accountId, name, email, cpf, carPlate, !!isPassenger, !!isDriver]
      );
    } finally {
      await connection.$pool.end();
    }
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  private accounts: any[] = [];

  async getAccountByEmail(email: string) {
    return this.accounts.find((acc) => acc.email === email);
  }

  async getAccountById(accountId: string) {
    return this.accounts.find((acc) => acc.accountId === accountId);
  }

  async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }
}
