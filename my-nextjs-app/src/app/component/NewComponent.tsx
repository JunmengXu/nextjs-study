// components/NewComponent.tsx
'use client'

import React from 'react';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server'

const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000',
      }),
    ],
  });

const NewComponent: React.FC = () => {
    React.useEffect(() => {
        const getPokemon = async (id: string) => {
          const pokemon = await trpc.pokemonById.query(id);
          console.log('Pokemon ', id, ':', pokemon);
          return pokemon.name;
        };
    
        getPokemon('1');
      }, []); // empty dependency array ensures the effect runs once on mount
    

  return (
    <div>
      <h1>New Component</h1>
      {/* Add your component content here */}
    </div>
  );
};

export default NewComponent;
