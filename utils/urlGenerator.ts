// utils/urlGenerator.ts
import { customAlphabet } from "nanoid";

export function generateUrl(baseString: string): string {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 10); // 10 is the length of the generated ID
  const uniqueId = nanoid();
  return `${baseString}-${uniqueId}`;
}
