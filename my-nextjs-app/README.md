This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


# Next.js Study

## What is CRA?

**CRA** stands for "Create React App." It is a command-line tool designed to assist developers in quickly setting up and scaffolding new React.js projects. CRA provides a predefined and optimized project structure, abstracting away the configuration complexities involved in setting up a React application. This allows developers to focus more on building user interfaces.

## How to Use Next.js in a React App

Using Next.js in a React app is straightforward. Simply create a directory named `pages/api`:

- **API Compilation:** Next.js efficiently compiles APIs, utilizing serverless Lambda functions.
  
- **Versatile Language Support:** By using the `/api` directory, you can employ four different languages, including Node.js, Go, Python, and Ruby.

### Building a Next.js Project - A Simplified Guide

**Prerequisites:**
1. **Node.js and npm:** Ensure that Node.js and npm are installed on your machine. Download them from the [official Node.js website](https://nodejs.org/).

**Steps:**
1. **Create a Next.js App:**
    - Open a terminal and run:
        ```bash
        npx create-next-app my-nextjs-app
        ```
    - Replace `my-nextjs-app` with your desired project name.
2. **Navigate to Your Project:**
    ```bash
    cd my-nextjs-app
    ```
3. **Run Your Next.js App:**
    - Execute:
        ```bash
        npm run dev
        ```
    - Open [http://localhost:3000](http://localhost:3000/) in your browser to view the app.

**Project Structure:**
- Key folders include `pages` (for routing), `public` (static assets), and `styles` (global styles).

**API Routes:**
- For serverless functions or API routes, create `.js` or `.ts` files in the `pages/api` folder.

## Prisma

**Prisma** is an open-source next-generation ORM, consisting of:

- **Prisma Client:** Auto-generated, type-safe query builder for Node.js & TypeScript.
- **Prisma Migrate:** Migration system.
- **Prisma Studio:** GUI to view and edit database data.

**Setup Steps:**
1. Install Prisma CLI:
    ```bash
    npm install prisma --save-dev
    ```
2. Set up Prisma with:
    ```bash
    npx prisma init --datasource-provider sqlite
    ```
### Supabase

#### Set up a free PostgreSQL database on Supabase to use with Prisma

[Supabase](https://supabase.com/) is a backend-as-a-service built on top of open-source technologies. It provides a comprehensive suite of services, including a database, authentication, a REST API, real-time subscriptions, and storage. Supabase offers a free plan that includes a hosted PostgreSQL database.

Follow these steps to set up a free PostgreSQL database on Supabase and integrate it with Prisma:

1. Go to [Supabase](https://supabase.com/) and log in with your GitHub account.

2. **Create a new project:**
   - After logging in, create a new project from the Supabase dashboard.

3. **Get the connection string from the project settings:**
   - Navigate to the ‘Project settings’ page from the sidebar.
   - Go to the ‘Database’ tab. You'll find the database's connection string with a placeholder for the password you provided when creating the project.

4. **Choose a suitable connection string:**
   - For this project, we choose the URI format:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.pcwofoliznnrcxlmuajd.supabase.co:5432/postgres
     ```

5. **Testing the connection:**
   - Set the `DATABASE_URL` to the connection string (including the password) in your `.env` file.

This project comes with TypeScript configured and has the following structure:

- A `prisma` directory which contains:
  - A `dev.db` file: This is a SQLite database.
  - A `schema.prisma` file: Where we define the different database models and relations between them.
- A `.env` file: Contains the `DATABASE_URL` variable, which Prisma will use.
- A `script.ts` file: where we will run some queries using Prisma Client.

By following these steps, you'll have a PostgreSQL database hosted on Supabase integrated with your Prisma setup for efficient and type-safe database interactions.

### Configuring for PostgreSQL

Delete `prisma/dev.db` and inside the `prisma/.env` file, update the value of the `DATABASE_URL` variable to the connection string you got in the “Connection string.” The URL might look as follows:

**This is what your .env file should look like:**
```prisma
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.pcwofoliznnrcxlmuajd.supabase.co:5432/postgres"
```

**This is what your schema.prisma file should look like:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    Pokemon?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model Pokemon {
  id    Int     @id @default(autoincrement())
  ball String  @unique
  name  String?
  posts Post[]
}
```

Generate migration:
```bash
npx prisma migrate dev --name init
```
This will create a `prisma/migrations` folder inside your `prisma` directory and synchronize your Prisma schema with your database schema.

If you go to your Supabase project, in the table editor, you should see that two tables have been created, a `Post` and a `Pokemon` table.

**Install and Generate Prisma Client:**
```bash
npm install @prisma/client
npx prisma generate
```

## Using Next.js as a Backend

- For websockets, webRTC, or functions beyond request/response, consider using Next.js alongside other solutions.
- Next.js is a best-in-class serverless backend solution

**Example API Endpoint:**
```javascript
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

export default async function getPokemon(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const pokemon = await prisma.pokemon.findMany({
        select: {
            name: true,
            id: true,
        },
    });
    res.status(200).json({ messages: "Hello World" });
}
```

## tRPC

**tRPC (end-to-end typesafe APIs):**

When making network requests and API calls, tRPC ensures you know the parameter and response data types. This allows for better type hinting and improved development experience.

tRPC is a TypeScript-based remote procedure call framework designed to simplify the communication process between clients and servers and provide efficient type safety. It allows you to call remote functions in a similar way to local function calls, while automatically handling the underlying details such as serialization and deserialization, error handling and communication protocols.

```bash
npm install @trpc/server @trpc/client
```

**Server Definition:**
Create `server/trpc.ts`:
```typescript
import { initTRPC } from '@trpc/server';
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
```

Create `server/index.ts`:
```typescript
import { publicProcedure, router } from '../server/trpc'
import { prisma } from "../utils/prisma";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const appRouter = router({
  pokemonById: publicProcedure
    // The input is unknown at this time. A client could have sent
    // us anything so we won't assume a certain data type.
    .input((val: unknown) => {
      // If the value is of type string, return it.
      // It will now be inferred as a string.
      if (typeof val === 'string') return val;
 
      // Uh oh, looks like that input wasn't a string.
      // We will throw an error instead of running the procedure.
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query(async (opts) => {
        const { input } = opts;
        console.log(input);
        // Retrieve the user with the given ID
        try {
            // Attempt to parse the input as an integer
            const pokemonId = parseInt(input, 10);
    
            if (isNaN(pokemonId)) {
              throw new Error('Invalid Pokemon ID');
            }
    
            // Retrieve the user with the given ID
            const pokemon = await prisma.pokemon.findFirst({
              where: {
                id: pokemonId,
              },
              select: {
                name: true,
                id: true,
              },
            });
    
            if (!pokemon) {
              throw new Error('Failed to find pokemon');
            }
    
            return pokemon;
          } catch (error) {
            console.error('Error in pokemonById query:', error);
            throw new Error('Failed to process pokemonById query');
          }
    }),
})

export type AppRouter = typeof appRouter

const server = createHTTPServer({
    router: appRouter,
});

server.listen(3000);
```

## NextAuth.js

**NextAuth.js** is a complete open-source authentication solution for Next.js applications, designed to support Next.js and Serverless.

**Advantages:**
- Own your own data
    -- An open-source solution that allows you to keep control of your data
    -- Supports Bring Your Own Database (BYOD) and can be used with any database
    -- Built-in support for MySQL, MariaDB, Postgres, SQL Server, MongoDB and SQLite](https://next-auth.js.org/configuration/databases)
    -- Works great with databases from popular hosting providers
    -- Can also be used *without a database* (e.g. OAuth + JWT)

## Reference
- https://www.youtube.com/watch?v=2cB5Fh46Vi4&t=1017s
- https://www.prisma.io/docs/
- https://trpc.io/docs
- https://dev.to/prisma/set-up-a-free-postgresql-database-on-supabase-to-use-with-prisma-3pk6
- https://zhuanlan.zhihu.com/p/102087731
- https://zhuanlan.zhihu.com/p/612310833