import pgp from "pg-promise";

export default interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  private connection: any;

  constructor() {
    this.connection = pgp()(process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/app");
  }

  async query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close() {
      await this.connection.$pool.end();
  }
}