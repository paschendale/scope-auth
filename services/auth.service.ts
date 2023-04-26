import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { secret } from "../app";
import { exclude } from "../utils";

const prisma = new PrismaClient();

function validateTokenService(token: string): any {

  try {
    
    const decodedToken = jwt.verify(token, secret);
    return decodedToken
  } catch (error) {
    
    throw error
  }
}

export async function authenticateService(token: string) {

  try {

    const decodedToken = validateTokenService(token) 

    const user = await prisma.user.findUnique({
      where: { id_user: decodedToken.id_user },
      include: { user_scope: { select: { scope: { select: { description: true } } } } },
    });

    return user
  } catch (error) {
    
    throw error
  }
}

export async function validateMasterScopeService(token: string) {

  try {
    
    const decodedToken = validateTokenService(token) 
  
    const user = await prisma.user.findUnique({
      where: { id_user: decodedToken.id_user },
      select: { user_scope: { select: { scope: { select: { description: true } } } } },
    });
  
    if (!user) {
      return null;
    }
  
    const scopeDescriptions = user.user_scope.map((userScope) => userScope.scope?.description).filter((description) => description !== null) as string[];
  
    return scopeDescriptions.includes('Master scope')
  } catch (error) {
    
    return false
  }
}

export async function loginService(userData: any) {

  const user = await prisma.user.findUnique({
    where: { email: userData.email },
    include: { user_scope: { select: { scope: { select: { description: true } } } } },
  });

  if (!user) {
    throw {
      status: 401,
      message: `Invalid credentials`
    }
  }

  const isValidPassword = await bcrypt.compare(userData.password, user.password as string);

  if (!isValidPassword) {
    throw {
      status: 401,
      message: `Invalid credentials`
    };
  }

  const token = jwt.sign(
    { id_user: user.id_user },
    secret,
    { expiresIn: '1h' }
  );

  return {
    user: exclude(user, ['password']),
    apikey: token
  }
}