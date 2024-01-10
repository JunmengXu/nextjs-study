import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

const SUPER_SECRET_TOKEN = "lol";

export default async function signThing(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { contents } = req.query;

    if (!contents || typeof contents !== "string"){
        res.status(400).send("Please include contents and just one");
        return;
    }

    const encrypted = Base64.stringify(hmacSHA512(contents, SUPER_SECRET_TOKEN));
    res.status(200).send(encrypted);
}