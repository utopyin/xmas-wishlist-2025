import { customAlphabet } from "nanoid";

const alphabet =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const nanoid = customAlphabet(alphabet, 8);
