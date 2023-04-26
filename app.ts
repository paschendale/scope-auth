import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const secret = process.env.AUTH_SECRET || 'paschendale'

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

function validateUser(token: string): any {

    const decodedToken = jwt.verify(token, secret);
    return decodedToken
}

async function validateMasterScope(token: string) {

  try {
    
    const decodedToken = validateUser(token) 
  
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

if (process.env.AUTH_MASTER_EMAIL && process.env.AUTH_MASTER_PASSWORD) {

  upsertMasterUser()
}

app.listen(3000, () => console.log('scope-auth server running on port 3000'));

app.post('/login', async (req: Request, res: Response) => {
  const {  email, password } = req.body;

  // Retrieve user from database
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password as string);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { id_user: user.id_user, name: user.name, email: user.email },
    secret,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

app.post('/validate', (req, res) => {
  const { token } = req.body

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {

    const decodedToken = validateUser(token);
    res.json(decodedToken);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/user', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { apikey } = req.headers

  const isMaster = await validateMasterScope(apikey as string)
  
  if (!isMaster) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  try {

    if (!name) {
      
      return res.status(400).json({ message: 'Error: no name provided' });
    }

    if (!email) {
      
      return res.status(400).json({ message: 'Error: no email provided' });
    }

    if (!password) {
      
      return res.status(400).json({ message: 'Error: no password provided' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.json(user);
  } catch (error: any) {

    if (error.code === "P2002") {

      res.status(500).json({ message: `The provided email already exists`});
    } else {

      res.status(500).json({ message: `Error creating user`});
    }

  }
});