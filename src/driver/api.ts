import { Request, Response } from 'express';
import express from "express";
import { Signup } from '../application/Signup';
import { AccountDAODatabase } from '../resource/AccountDAO';
import { MailerGatewayMemory } from '../resource/MailerGateway';

const app = express();
app.use(express.json());


app.post("/signup", async (req: Request, res: Response) => {
  try {
    const accountDAO = new AccountDAODatabase();
    const mailerGateway = new MailerGatewayMemory();

    const signup = new Signup(accountDAO, mailerGateway);
    const output = await signup.execute(req.body);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({
      message: error.message
    });
  }
});

app.listen(3000);
