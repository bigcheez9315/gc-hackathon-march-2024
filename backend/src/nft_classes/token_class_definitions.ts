import { TokenClassKey } from "@gala-chain/api";
import { plainToInstance } from "class-transformer";

const mineralClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'lastexpedition',
    category: "Currency",
    type: "Mineral",
    additionalKey: "none"
});
const coreClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'lastexpedition',
    category: "Currency",
    type: "Core",
    additionalKey: "none"
});
const fragmentClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'lastexpedition',
    category: "Currency",
    type: "Fragment",
    additionalKey: "none"
});
export const tokenClassMap: Record<string, TokenClassKey> = {
    "LEMIN": mineralClassKey,
    "LECC": coreClassKey,
    "LEFC": fragmentClassKey
}
