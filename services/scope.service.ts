import { prisma } from "./db";

export async function createScopeService(scopeData: any) {

  try {

    const scope = await prisma.scope.create({
      data: {
        description: scopeData.description
      },
    });
    
    return scope
  } catch (error: any) {
  
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

export async function addScopeToUserService(id_scope: number, id_user: number) {

  try {

    var scopeRelation = await prisma.user_scope.findFirst({
      where: {id_user: id_user, id_scope: id_scope}
    })

    if(scopeRelation) {

      return {
        status: 200,
        message: 'Scope ~ User relation already exists'
      }
    } else {

      var createRelation = await prisma.user_scope.create({
        data: {
          id_scope,
          id_user
        }
      })

      return createRelation
    }

  } catch (error: any) {

    if (error.code === 'P2003') {

      throw {
        status: 400,
        message: 'Provided id_user or id_scope does not exist'
      }
    }
    
    throw error
  }
}

export async function removeScopeFromUserService(id_scope: number, id_user: number) {

  try {

    var scopeRelation = await prisma.user_scope.findFirst({
      where: {id_user: id_user, id_scope: id_scope}
    })

    if(!scopeRelation) {

      throw {
        status: 200,
        message: 'Provided scope ~ User relation doesn`t exists'
      }
    } else {

      var deleteRelation = await prisma.user_scope.deleteMany({
        where: {
          id_scope: id_scope,
          id_user: id_user
        }
      })

      return deleteRelation
    }

  } catch (error) {
    
    throw error
  }
}