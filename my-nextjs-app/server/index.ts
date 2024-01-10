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