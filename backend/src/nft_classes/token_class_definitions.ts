import { TokenClassKey } from "@gala-chain/api";
import { plainToInstance } from "class-transformer";

const dragonStoneClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'lastexpedition',
    category: "Currency",
    type: "DragonStone",
    additionalKey: "none"
});
const dragonTearsClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'lastexpedition',
    category: "Currency",
    type: "DragonTears",
    additionalKey: "none"
});
const magicSwordClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'lastexpedition',
    category: "Currency",
    type: "MagicSword",
    additionalKey: "none"
});
const ultraSwordClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'wizardGame',
    category: "swords",
    type: "UltraSword",
    additionalKey: "legendary"
});
const poisonousSnakeClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'wizardGame',
    category: "Collectible",
    type: "PoisonousSnake",
    additionalKey: "none"
});
const turboSwordClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'wizards',
    category: "Swords",
    type: "TurboSword",
    additionalKey: "epic"
});
const friendlySnakeClassKey: TokenClassKey = plainToInstance(TokenClassKey, {
    collection: 'wizards',
    category: "Snakes",
    type: "FriendlySnake",
    additionalKey: "epic"
});
export const tokenClassMap: Record<string, TokenClassKey> = {
    DRST: dragonStoneClassKey,
    DRTR: dragonTearsClassKey,
    TBSW: turboSwordClassKey,
    FRSN: friendlySnakeClassKey,
    PSNK: poisonousSnakeClassKey,
    ULSW: ultraSwordClassKey
}
