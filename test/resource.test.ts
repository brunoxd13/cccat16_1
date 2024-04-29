import { AccountRepositoryDatabase } from "../src/infrastructure/repository/AccountRepository";
import Account from "../src/domain/Account";
import { PgPromiseAdapter } from "../src/infrastructure/database/DatabaseConnection";

// Integration Test

test("Deve salvar um registro na tabela account e consultar por id", async function () {
	const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "87748248800", "", true, false);
	const connection = new PgPromiseAdapter();
	const accountDAO = new AccountRepositoryDatabase(connection);
  await accountDAO.saveAccount(account);

	const accountById = await accountDAO.getAccountById(account.accountId);
	expect(accountById.accountId).toBe(account.accountId);
	expect(accountById.name).toBe(account.name);
	expect(accountById.email).toBe(account.email);
	expect(accountById.cpf).toBe(account.cpf);
});

test("Deve salvar um registro na tabela account e consultar por email", async function () {
	const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "87748248800", "", true, false);
	
	const connection = new PgPromiseAdapter();
	const accountDAO = new AccountRepositoryDatabase(connection);

	await accountDAO.saveAccount(account);
	const accountByEmail = await accountDAO.getAccountByEmail(account.email);
	expect(accountByEmail?.accountId).toBe(account.accountId);
	expect(accountByEmail?.name).toBe(account.name);
	expect(accountByEmail?.email).toBe(account.email);
	expect(accountByEmail?.cpf).toBe(account.cpf);
});
