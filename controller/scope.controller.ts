import { Request, Response } from "express";
import { validateMasterScopeService } from "../services/auth.service";
import { exclude } from "../utils";
import { addScopeToUserService, createScopeService, deleteScopeService, getAllScopesService, getScopeService, removeScopeFromUserService } from "../services/scope.service";

export async function createScopeController(req: Request, res: Response) {

  const { description } = req.body;
  const { apikey } = req.headers

  const isMaster = await validateMasterScopeService(apikey as string)
  
  if (!isMaster) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  if (!description) {
      
    return res.status(400).json({ message: 'Error: no description provided' });
  }

  try {
    
    const scope = await createScopeService({
      description: description
    })

    res.status(200).json(scope)
  } catch (error: any) {
    
    if (error.message) {

      res.status(error.status).json({ message: error.message});
    } else {

      res.status(500).json({ message: `Error creating scope`});
    }
  }
}

export async function getAllScopesController(req: Request, res: Response) {
  const { apikey } = req.headers

  const isMaster = await validateMasterScopeService(apikey as string)
  
  if (!isMaster) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  try {

    const scopes = await getAllScopesService()

    res.json(scopes)
  } catch (error) {
    
    res.status(500).json({ message: `Error getting scopes list`})
  }
}

export async function getScopeController(req: Request, res: Response) {
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

    const scope = await getScopeService(Number(id))

    if(!scope) {
      return res.status(200).json({})
    }

    res.status(200).json(scope)
  } catch (error) {
    
    res.status(500).json({ message: `Error getting scope`})
  }
}

export async function deleteScopeController(req: Request, res: Response) {
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

    const scope = await deleteScopeService(Number(id))

    return res.status(200).json({message: `Scope with id: ${scope.id_scope} succesfully deleted`})
  } catch (error: any) {
    
    if (error.message) {

      res.status(error.status).json({ message: error.message});
    } else {

      res.status(500).json({ message: `Error deleting scope`})
    }

  }
}

export async function addScopeToUserController(req: Request, res: Response) {
  const { apikey } = req.headers
  const { id_scope, id_user } = req.params

  const isMaster = await validateMasterScopeService(apikey as string)
  
  if (!isMaster) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  if (!id_scope) {
    
    return res.status(400).json({ message: 'Error: no scope id provided' });
  }

  if (!id_user) {
    
    return res.status(400).json({ message: 'Error: no user id provided' });
  }

  if (!Number(id_scope)) {
    
    return res.status(400).json({ message: 'Error: provided scope id is invalid' });
  }

  if (!Number(id_user)) {
    
    return res.status(400).json({ message: 'Error: provided user id is invalid' });
  }

  try {

    const scope = await addScopeToUserService(Number(id_scope),Number(id_user))

    return res.json(scope)
  } catch (error: any) {
    
    if (error.message) {

      res.status(error.status).json({ message: error.message});
    } else {

      res.status(500).json({ message: `Error creating scope relation`})
    }

  }
}

export async function removeScopeFromUserController(req: Request, res: Response) {
  const { apikey } = req.headers
  const { id_scope, id_user } = req.params

  const isMaster = await validateMasterScopeService(apikey as string)
  
  if (!isMaster) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  if (!id_scope) {
    
    return res.status(400).json({ message: 'Error: no scope id provided' });
  }

  if (!id_user) {
    
    return res.status(400).json({ message: 'Error: no user id provided' });
  }

  if (!Number(id_scope)) {
    
    return res.status(400).json({ message: 'Error: provided scope id is invalid' });
  }

  if (!Number(id_user)) {
    
    return res.status(400).json({ message: 'Error: provided user id is invalid' });
  }

  try {

    const scope = await removeScopeFromUserService(Number(id_scope),Number(id_user))

    return res.status(200).json({message: `${scope.count} scope ~ user relation(s) succesfully deleted`})
  } catch (error: any) {
    
    if (error.message) {

      res.status(error.status).json({ message: error.message});
    } else {

      res.status(500).json({ message: `Error deleting scope relation`})
    }

  }
}