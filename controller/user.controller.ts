import { Request, Response } from "express";
import { createUserService, deleteUserService, getAllUsersService, getUserService } from "../services/user.service";
import { validateMasterScopeService } from "../services/auth.service";
import { exclude } from "../utils";

export async function createUserController(req: Request, res: Response) {

  const { name, email, password } = req.body;
  const { apikey } = req.headers

  const isMaster = await validateMasterScopeService(apikey as string)
  
  if (!isMaster) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  if (!name) {
      
    return res.status(400).json({ message: 'Error: no name provided' });
  }

  if (!email) {
    
    return res.status(400).json({ message: 'Error: no email provided' });
  }

  if (!password) {
    
    return res.status(400).json({ message: 'Error: no password provided' });
  }

  try {
    
    const user = await createUserService({
      name: name, 
      email: email, 
      password: password
    })

    res.status(200).json(exclude(user, ['password']))
  } catch (error: any) {
    
    if (error.message) {

      res.status(error.status).json({ message: error.message});
    } else {

      res.status(500).json({ message: `Error creating user`});
    }
  }
}

export async function getAllUsersController(req: Request, res: Response) {
  const { apikey } = req.headers

  const isMaster = await validateMasterScopeService(apikey as string)
  
  if (!isMaster) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  try {

    const users = await getAllUsersService()

    res.json(users.map((e: any) => exclude(e, ['password'])))
  } catch (error) {
    
    res.status(500).json({ message: `Error getting user list`})
  }
}

export async function getUserController(req: Request, res: Response) {
  const { apikey } = req.headers

  const isMaster = await validateMasterScopeService(apikey as string)
  
  if (!isMaster) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  const { id } = req.params

  if (!id) {
    
    return res.status(400).json({ message: 'Error: no id provided' });
  }

  if (!Number(id)) {
    
    return res.status(400).json({ message: 'Error: provided id is invalid' });
  }

  try {

    const user = await getUserService(Number(id))

    if(!user) {
      return res.status(200).json({})
    }

    exclude(user,['password'] as string[])

    res.status(200).json(user)
  } catch (error) {
    
    res.status(500).json({ message: `Error getting user`})
  }
}

export async function deleteUserController(req: Request, res: Response) {
  const { apikey } = req.headers

  const isMaster = await validateMasterScopeService(apikey as string)
  
  if (!isMaster) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  const { id } = req.params

  if (!id) {
    
    return res.status(400).json({ message: 'Error: no id provided' });
  }

  if (!Number(id)) {
    
    return res.status(400).json({ message: 'Error: provided id is invalid' });
  }

  try {

    const user = await deleteUserService(Number(id))

    res.status(200).json(user)
  } catch (error: any) {
    
    if (error.message) {

      res.status(error.status).json({ message: error.message});
    } else {

      res.status(500).json({ message: `Error deleting user`})
    }

  }
}