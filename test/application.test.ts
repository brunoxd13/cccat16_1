import { Signup } from "../src/application/usecase/Signup";
import { AccountRepositoryMemory } from "../src/infrastructure/repository/AccountRepository";
import { MailerGatewayMemory } from "../src/infrastructure/gateway/MailerGateway";

let signup: Signup;

beforeEach(() => {
	const accountRepository = new AccountRepositoryMemory()
	const mailerGateway = new MailerGatewayMemory();
	signup = new Signup(accountRepository, mailerGateway);
});

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const output = await signup.execute(input);

	expect(output).toHaveProperty("accountId");
});

test("Não deve permitir criar uma passageiro com e-mail duplicado", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	await signup.execute(input);
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Não deve permitir criar uma passageiro com nome invalido", async function () {
	const input = {
		name: "John @ Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve permitir criar uma passageiro com email invalido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve permitir criar uma passageiro com CPF invalido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748200048800",
		isPassenger: true
	};

	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve permitir criar uma motorista com placa invalida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "ABC-1234"
	};

	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
});

