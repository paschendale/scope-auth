# scope-auth
 A simple Node.ts authentication and scope provider wrapped in a express server

# db sql schema

This application was intended to work on a starting SQL database with this structure:

```sql
  CREATE SCHEMA IF NOT EXISTS auth;

  CREATE TABLE auth.user (
    id_user SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    "group" INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE auth.scope (
    id_scope SERIAL PRIMARY KEY,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE auth.user_scope (
    id_user_scope SERIAL PRIMARY KEY,
    id_scope INTEGER,
    id_user INTEGER,    
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Add foreign key constraint for auth.user.group referencing auth.scope.id_scope
  ALTER TABLE auth.user
  ADD CONSTRAINT user_group_fk
  FOREIGN KEY ("group")
  REFERENCES auth.user(id_user);

  -- Add foreign key constraint for auth.user_scope.id_scope referencing auth.scope.id_scope
  ALTER TABLE auth.user_scope
  ADD CONSTRAINT user_scope_scope_fk
  FOREIGN KEY (id_scope)
  REFERENCES auth.scope(id_scope);

  -- Add foreign key constraint for auth.user_scope.id_user referencing auth.user.id_user
  ALTER TABLE auth.user_scope
  ADD CONSTRAINT user_scope_user_fk
  FOREIGN KEY (id_user)
  REFERENCES auth.user(id_user);

  -- Add unique constraint on auth.user_scope(id_user, id_scope)
  ALTER TABLE auth.user_scope
  ADD CONSTRAINT user_scope_user_scope_unique_constraint
  UNIQUE (id_user, id_scope);
```

# instructions

1. copy .env.example content into .env file on the root of the repository
2. create database on your postgresql server
3. adapt `DATABASE_URL` on the environment to connect to your database
4. run `yarn` to install dependencies
5. run `yarn db:make` to generate database client and start the Prisma UI
6. run `yarn start` to start the application