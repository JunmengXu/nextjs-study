import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

export default async function getPokemon(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Need an id parameter to query a pokemon
    const { id } = req.query;

    if (!id || typeof id !== "string"){
        res.status(400).send("Please include id and just one");
        return;
    }

    const pokemon = await prisma.pokemon.findMany({
        where: {
            id: parseInt(id),
        },
        select: {
            name: true,
            id: true,
        },
    });
    res.status(200).json({ messages: "Hello World", pokemons: pokemon });
}