import { validate as validateCpf } from "./validateCpf";
import { getAccountByEmail, getAccountById, createAccount } from "./resources";

export async function signUp (input: any) {
  const { name, email, cpf, carPlate, isDriver } = input;

	if (await getAccountByEmail(email)) throw new Error("Account already exists");
  if (!validateName(name)) throw new Error("Invalid name");
	if (!validateEmail(email)) throw new Error("Invalid email");
	if (!validateCpf(cpf)) throw new Error("Invalid CPF");
	if (!!isDriver && !validateCarPlate(carPlate)) throw new Error("Invalid car plate");

	const id = await createAccount(input);
	return { accountId: id }
}

export async function getAccount(input: any) {
  const { account_id } = input.body;
  return getAccountById(account_id);
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
