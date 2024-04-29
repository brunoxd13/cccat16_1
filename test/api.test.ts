import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);

	expect(output.status).toBe(200);
	expect(output.data).toHaveProperty("accountId");
});

test("Não deve permitir criar uma passageiro com e-mail duplicado", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(200);
	expect(output.data).toHaveProperty("accountId");
	
	const output2 = await axios.post("http://localhost:3000/signup", input);

	expect(output2.data).not.toHaveProperty("accountId");
	expect(output2.status).toBe(422);
	expect(output2.data.message).toBe("Account already exists");
});

test("Não deve permitir criar uma passageiro com nome invalido", async function () {
	const input = {
		name: "John @ Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	const output = await axios.post("http://localhost:3000/signup", input);

	expect(output.data).not.toHaveProperty("accountId");
	expect(output.status).toBe(422);
	expect(output.data.message).toBe("Invalid name");
});

test("Não deve permitir criar uma passageiro com email invalido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	const output = await axios.post("http://localhost:3000/signup", input);

	expect(output.data).not.toHaveProperty("accountId");
	expect(output.status).toBe(422);
	expect(output.data.message).toBe("Invalid email");
});

test("Não deve permitir criar uma passageiro com CPF invalido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748200048800",
		isPassenger: true
	};

	const output = await axios.post("http://localhost:3000/signup", input);

	expect(output.data).not.toHaveProperty("accountId");
	expect(output.status).toBe(422);
	expect(output.data.message).toBe("Invalid CPF");
});

test("Não deve permitir criar uma motorista com placa invalida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "ABC-1234"
	};

	const output = await axios.post("http://localhost:3000/signup", input);

	expect(output.data).not.toHaveProperty("accountId");
	expect(output.status).toBe(422);
	expect(output.data.message).toBe("Invalid car plate");
});

