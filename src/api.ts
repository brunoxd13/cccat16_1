import { Request, Response } from 'express';
import express from "express";
import { Signup } from './application';
import { AccountDAODatabase } from './resources';

const app = express();
app.use(express.json());


app.post("/signup", async (req: Request, res: Response) => {
  try {
    const accountDAO = new AccountDAODatabase();
    const signup = new Signup(accountDAO);
    const output = await signup.execute(req.body);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({
      message: error.message
    });
  }
});

app.listen(3000);
