import { Request, Response } from 'express';
import express from "express";
import { signUp } from './application';

const app = express();
app.use(express.json());


app.post("/signup", async (req: Request, res: Response) => {
  try {
    const output = await signUp(req.body);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({
      message: error.message
    });
  }
});

app.listen(3000);
