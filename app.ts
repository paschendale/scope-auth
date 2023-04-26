import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { router } from "./routes/routes"

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

export const secret = process.env.AUTH_SECRET || 'paschendale'

async function upsertMasterUser() {

  
  const email = process.env.AUTH_MASTER_EMAIL
  const password = process.env.AUTH_MASTER_PASSWORD
  
  const hashedPassword = await bcrypt.hash(password!, 10);

  const masterScope = await prisma.scope.upsert({
    where: { id_scope: 1 },
    update: { description: 'Master scope' },
    create: {
      id_scope: 1,
      description: 'Master scope'
    }
  })
  
  const masterUser = await prisma.user.upsert({
    where: { email: email },
    update: { password: hashedPassword },
    create: {
      name: "master",
      email: email,
      password: hashedPassword
    }
  })
  
  const scopeRelation = await prisma.user_scope.upsert({
    where: { id_user_id_scope: { id_scope: await masterScope.id_scope, id_user: masterUser.id_user } },
    update: {  },
    create: {
      id_scope: await masterScope.id_scope,
      id_user: await masterUser.id_user
    }
  })
  
  console.log(`Master user set to: master - ${await masterUser.email}`)
}

if (process.env.AUTH_MASTER_EMAIL && process.env.AUTH_MASTER_PASSWORD) {

  upsertMasterUser()
}

app.listen(3000, () => console.log('scope-auth server running on port 3000'));
app.use(`/api`,router)