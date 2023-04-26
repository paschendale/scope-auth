import { PrismaClient, scope } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function createScopeService(scopeData: any) {

  try {

    const scope = await prisma.scope.create({
      data: {
        description: scopeData.description
      },
    });
    
    return scope
  } catch (error: any) {
  
    console.log("🚀 ~ file: scope.service.ts:18 ~ createScopeService ~ error:", error)
    throw {
      status: 500,
      message: `Error creating scope`
    }
  }
}

export async function getAllScopesService() {

  try {
    
    const scopes = await prisma.scope.findMany()

    return scopes
  } catch (error) {
    
    throw error
  }
}

export async function getScopeService(scopeId: number) {

  try {
    
    const scope = await prisma.scope.findFirst({
      where: {id_scope: scopeId}
    })

    return scope
  } catch (error) {
    
    throw error
  }
}

export async function deleteScopeService(scopeId: number) {

  try {

    const scope = await prisma.scope.findFirst({
      where: {id_scope: scopeId}
    })

    if (!scope) {
      throw {
        status: 400,
        message: `No scope with id: ${scopeId}`
      }
    }

    if( scope.description === 'Master scope' ) {
      throw {
        status: 400,
        message: `This scope is not deletable`
      }
    }
    
    const deleted = await prisma.scope.delete({
      where: {id_scope: scopeId}
    })

    return deleted
  } catch (error) {
    
    throw error
  }
}