import { Request, Response } from "express";
import { loginService, validateTokenService } from "../services/auth.service";

export async function loginController(req: Request, res: Response) {
  const {  email, password } = req.body;

  if (!email) {
    
    return res.status(406).json({ message: 'Error: no email provided' });
  }

  if (!password) {
    
    return res.status(406).json({ message: 'Error: no password provided' });
  }

  try {
    
    const login = await loginService({email,password})

    res.json(login)
  } catch (error: any) {
    
    if (error.message) {

      res.status(error.status).json({ message: error.message});
    } else {

      res.status(500).json({ message: `Error on login`});
    }
  }
}

export async function validateTokenController(req: Request, res: Response) {
  const { apikey } = req.body

  if (!apikey) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {

    const validatedToken = await validateTokenService(apikey)

    res.status(200).json(validatedToken)
  } catch (error) {

    res.status(401).json({ message: 'Invalid token' });
  }
}