import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate as validateCpf } from "./validateCpf";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const { name, email, cpf, carPlate, isPassenger, isDriver } = req.body;

  try {
    const id = crypto.randomUUID();

    const [acc] = await connection.query(
      "select * from cccat16.account where email = $1",
      [req.body.email]
    );

    if (acc) return res.status(422).send("-4");
		if (!validateName(name)) return res.status(422).send("-3");
		if (!validateEmail(email)) return res.status(422).send("-2");
		if (!validateCpf(cpf)) return res.status(422).send("-1");		
		if (!!isDriver && !validateCarPlate(carPlate)) return res.status(422).send("-5");
		

		await connection.query(
			"insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
			[
				id,
				req.body.name,
				req.body.email,
				req.body.cpf,
				req.body.carPlate,
				!!req.body.isPassenger,
				!!req.body.isDriver,
			]
		);
		
		return res.json({
			accountId: id,
		});

		// } 
  } finally {
    await connection.$pool.end();
  }
});

const validateName = (name: string) => {
	return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

const validateEmail = (email: string) => {
	return email.match(/^(.+)@(.+)$/);
}

const validateCarPlate = (carPlate: string) => {
	return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}


app.listen(3000);
