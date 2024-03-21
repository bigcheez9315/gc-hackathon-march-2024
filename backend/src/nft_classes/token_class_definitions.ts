import { TokenClassKey } from "@gala-chain/api";
import { plainToInstance } from "class-transformer";

const dragonStoneClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'dragonGame',
    category: "Currency",
    type: "DragonStone",
    additionalKey: "none"
});
const dragonTearsClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'dragonGame',
    category: "Currency",
    type: "DragonTears",
    additionalKey: "none"
});
const magicSwordClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'wizardGame',
    category: "Collectible",
    type: "MagicSword",
    additionalKey: "none"
});
const poisonousSnakeClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'wizardGame',
    category: "Collectible",
    type: "PoisonousSnake",
    additionalKey: "none"
});
export const tokenClassMap: Record<string, TokenClassKey> = {
    DRST: dragonStoneClassKey,
    DRTR: dragonTearsClassKey,
    MGSD: magicSwordClassKey,
    PSNK: poisonousSnakeClassKey
}
