import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate as validateCpf } from "./validateCpf";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const { name, email, cpf, carPlate, isPassenger, isDriver } = req.body;

  if (await validateAccountExists(email)) return res.status(422).send("Account already exists");
  if (!validateName(name)) return res.status(422).send("Invalid name");
  if (!validateEmail(email)) return res.status(422).send("Invalid email");
  if (!validateCpf(cpf)) return res.status(422).send("Invalid CPF");
  if (!!isDriver && !validateCarPlate(carPlate)) return res.status(422).send("Invalid car plate");

  const id = await createAccount(name, email, cpf, carPlate, isPassenger, isDriver);
	
  return res.json({
    accountId: id,
  });
});

const validateAccountExists = async (email: string) => {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const [acc] = await connection.query(
      "select * from cccat16.account where email = $1",
      [email]
    );
    return !!acc;
  } finally {
    connection.$pool.end();
  }
};

const validateName = (name: string) => {
  return name.match(/[a-zA-Z] [a-zA-Z]+/);
};

const validateEmail = (email: string) => {
  return email.match(/^(.+)@(.+)$/);
};

const validateCarPlate = (carPlate: string) => {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/);
};

const createAccount = async (
  name: string,
  email: string,
  cpf: string,
  carPlate: string,
  isPassenger: boolean,
  isDriver: boolean
) => {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const id = crypto.randomUUID();
    await connection.query(
      "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [id, name, email, cpf, carPlate, !!isPassenger, !!isDriver]
    );
    return id;
  } finally {
    await connection.$pool.end();
  }
};

app.listen(3000);
