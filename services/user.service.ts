import bcrypt from 'bcrypt';
import { prisma } from './db';

export async function createUserService(userData: any) {

  try {

    const hashedPassword = await bcrypt.hash(userData.password as string, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });
    
    return user
  } catch (error: any) {

    if (error.code === "P2002") {

      throw {
        status: 406,
        message: `The provided email already exists`
      }
    } else {

      throw {
        status: 500,
        message: `Error creating user`
      }
    }

  }
}

export async function getAllUsersService() {

  try {
    
    const users = await prisma.user.findMany()

    return users
  } catch (error) {
    
    throw error
  }
}

export async function getUserService(userId: number) {

  try {
    
    const user = await prisma.user.findFirst({
      where: {id_user: userId}
    })

    return user
  } catch (error) {
    
    throw error
  }
}

export async function deleteUserService(userId: number) {

  try {

    const user = await prisma.user.findFirst({
      where: {id_user: userId}
    })

    if (!user) {
      throw {
        status: 400,
        message: `No user with id: ${userId}`
      }
    }

    if( user.name === 'master' ) {
      throw {
        status: 400,
        message: `This user is not deletable`
      }
    }
    
    const deleted = await prisma.user.delete({
      where: {id_user: userId}
    })

    return deleted
  } catch (error) {
    
    throw error
  }
}