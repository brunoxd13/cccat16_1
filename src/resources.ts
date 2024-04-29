import crypto from "crypto";
import pgp from "pg-promise";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/app";

export interface AccountDAO {
  getAccountByEmail(email: string): Promise<any>;
  getAccountById(accountId: string): Promise<any>;
  saveAccount(account: any): Promise<string>;
}

export class AccountDAODatabase implements AccountDAO {
  async getAccountByEmail(email: string) {
    const connection = pgp()(DATABASE_URL);
    const [acc] = await connection.query(
      "select * from cccat16.account where email = $1",
      [email]
    );
    await connection.$pool.end();
    return acc;
  }
  
  async getAccountById(accountId: string) {
    const connection = pgp()(DATABASE_URL);
    const [acc] = await connection.query(
      "select * from cccat16.account where account_id = $1",
      [accountId]
    );
    await connection.$pool.end();
    return acc;
  }
  
  async saveAccount(account: any) {
    const connection = pgp()(DATABASE_URL);
    try {
      const { name, email, cpf, carPlate, isPassenger, isDriver } = account;
      const id = crypto.randomUUID();
      await connection.query(
        "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
        [id, name, email, cpf, carPlate, !!isPassenger, !!isDriver]
      );
      return id;
    } finally {
      await connection.$pool.end();
    }
  }
}



