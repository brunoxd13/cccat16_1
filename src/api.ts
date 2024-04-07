import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  let result;
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

  try {
    const id = crypto.randomUUID();

    const [acc] = await connection.query(
      "select * from cccat16.account where email = $1",
      [req.body.email]
    );

    if (acc) return res.status(422).send("-4");
		if (!req.body.name.match(/[a-zA-Z] [a-zA-Z]+/)) return res.status(422).send("-3");
		if (!req.body.email.match(/^(.+)@(.+)$/)) return res.status(422).send("-2");
		if (!validate(req.body.cpf)) return res.status(422).send("-1");

		
		if (req.body.isDriver) {
			if (req.body.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
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

			} else {
				// invalid car plate
				return res.status(422).send("-5");
			}
		} else {
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
		}
  } finally {
    await connection.$pool.end();
  }
});

app.listen(3000);
