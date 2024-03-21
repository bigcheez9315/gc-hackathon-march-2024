import express, { Request, Response , Application, NextFunction } from 'express';
import cors from "cors";
import {
  GalaChainResponse,
  GrantAllowanceDto,
  CreateTokenClassDto,
  RegisterUserDto,
  createValidDTO,
  TokenInstanceKey,
  MintTokenDto,
  BurnTokensDto,
  FetchBalancesDto,
  TokenBurn,
  TokenBalance,
  TokenInstance,
  AllowanceType,
  TokenAllowance
} from "@gala-chain/api";
import { ChainUser } from "@gala-chain/client";
import BigNumber from "bignumber.js";
import { instanceToPlain } from "class-transformer";

import { tokenClassMap } from './nft_classes/token_class_definitions';
import {
  adminPrivateKey,
  galaPublicKeyContractAxios,
  galaChainTokenAxios,
  adminPublicKey
  // getClientWithAuthority,
} from './config';
const maxSupply = 10000000;
type MintBurnRequest = Request<{}, {},{
  quantity: number,
  tokenKey: string,
  identityKey: string,
  privateKey: string,
}>;

// Setup Express & Middleware
const app: Application = express();
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({
  origin: /localhost:\d+$/,
}));
app.use(express.json());

// Up
app.get('/', (req: Request, res: Response) => {
  res.send('🚀');
});

// New User
app.post('/new-user', async (req: Request, res: Response, next: NextFunction) => {
  // const client = getClientWithAuthority("PublicKeyContract");
  const newUser = ChainUser.withRandomKeys();

  try {
    const dto = new RegisterUserDto();

    dto.publicKey = newUser.publicKey;
    console.log(`public key = ${dto.publicKey}`)
    if (!adminPrivateKey || !adminPublicKey) throw Error(
      'Need to define GC_ADMIN_PRIVATE_KEY and GC_ADMIN_PUBLIC_KEY environment variables')
    console.log('signing dto')
    dto.sign(adminPrivateKey);
    const payloadString = dto.serialize()
    console.log(` dto string = ${payloadString}`)

    const endpoint = '/RegisterEthUser'
    const response = await galaPublicKeyContractAxios.post(endpoint, payloadString)
    // const response = await client.RegisterEthUser(dto);
     console.log(`response = ${JSON.stringify(response.data)}`)
    res.json({
      alias: newUser.name,
      ethAddress: newUser.ethAddress,
      user: newUser,
      response: response.data
    });
  //  res.json(response.data)
  } catch (error) {
    // await client.disconnect();
    console.log(`Error registering new user = ${JSON.stringify(error)}`)
    return res.status(500).json({ error });
  }
});

// Create Token Class Definitions
app.post('/create-token-classes', async (req: Request, res: Response, next: NextFunction) => {
  // create dragon stone fungible token
  console.log('creating dragon stone dto')
  const dragonStoneDto: CreateTokenClassDto =
      await createValidDTO<CreateTokenClassDto>(CreateTokenClassDto, {
        decimals: 2,
        tokenClass: tokenClassMap.DRST,
        name: "Dragon Stone",
        symbol: "DRST",
        description:
          "Dragon Stone Fungible In-Game Currency",
        isNonFungible: false,
        image:
          "https://files.slack.com/files-tmb/T018SUFPRNU-F06JNH22RE0-c43278d8ca/nft_cores_360.gif",
        maxSupply: new BigNumber(maxSupply),
      });
   // create dragon tears dto
   console.log('creating dragon tears dto')

   const dragonTearsDto: CreateTokenClassDto =
    await createValidDTO<CreateTokenClassDto>(CreateTokenClassDto, {
      decimals: 2,
      tokenClass: tokenClassMap.DRTR,
      name: "Dragon Tears",
      symbol: "DRTR",
      description:
        "Dragon Tears Fungible In-Game Currency",
      isNonFungible: false,
      image:
        "https://files.slack.com/files-tmb/T018SUFPRNU-F06JNH22RE0-c43278d8ca/nft_cores_360.gif",
      maxSupply: new BigNumber(maxSupply),
    });
    console.log('creating magic sword dto')

   // create magicSword dto
   const ultraSwordDto: CreateTokenClassDto =
      await createValidDTO<CreateTokenClassDto>(CreateTokenClassDto, {
        decimals: 0,
        tokenClass: tokenClassMap.ULSW,
        name: "Ultra Sword",
        symbol: "ULSW",
        description:
          "Ultra Sword Non-Fungible Token for Wizard Game",
        isNonFungible: true,
        image:
          "https://files.slack.com/files-tmb/T018SUFPRNU-F06JNH22RE0-c43278d8ca/nft_cores_360.gif",
        maxSupply: new BigNumber(20),
      });
    console.log('creating ultra sword dto')

   // create poisonous snake dto
   const friendlySnakeDto: CreateTokenClassDto =
   await createValidDTO<CreateTokenClassDto>(CreateTokenClassDto, {
     decimals: 0,
     tokenClass: tokenClassMap.FRSN,
     name: "Friendly Snake",
     symbol: "FRSN",
     description:
       "Friendly Snake Non-Fungible Token for Wizard Game",
     isNonFungible: true,
     image:
       "https://files.slack.com/files-tmb/T018SUFPRNU-F06JNH22RE0-c43278d8ca/nft_cores_360.gif",
     maxSupply: new BigNumber(15),
   });
   // store all dtos in an array
   const dtoArray: CreateTokenClassDto[] = [dragonStoneDto, dragonTearsDto, ultraSwordDto, friendlySnakeDto]
   const failed = []
   // Make api request to /CreateTokenClass endpoint
   try {

    if (!adminPrivateKey ) throw Error(
      'Need to define GC_ADMIN_PRIVATE_KEY  environment variables')

    const endpoint = '/CreateTokenClass'
    for (const dto of dtoArray) {
      try {
        console.log('signing dto')
        dto.sign(adminPrivateKey);
        const payloadString = dto.serialize()
        console.log(` dto string = ${payloadString}`)
    
        console.log(`Creating token class definition for ${dto.name}`)
        const response = await galaChainTokenAxios.post(endpoint, payloadString)
        // const response = await client.RegisterEthUser(dto);
         console.log(`response = ${JSON.stringify(response.data)}`)
      } catch (e) {
        console.log(`Error creating token class definition for ${dto.name}: ${JSON.stringify(e)}`)
      }
     
    }
    
    res.json({});
  //  res.json(response.data)
  } catch (error) {
    // await client.disconnect();
    console.log(`Error creating token classes = ${JSON.stringify(error)}`)
    return res.status(500).json({ error });
  }
  
})
// Balances
app.post('/balances', async (req: MintBurnRequest, res: Response, next: NextFunction) => {
  const { identityKey, privateKey} = req.body;
  try {

    const balancesData = []
    for (const key in tokenClassMap) {
      const nftClassKey = tokenClassMap[key]
      // get balance of nftClassKey for user
      const galaChainBalanceDto = await createValidDTO(FetchBalancesDto, {
        owner: identityKey,
        ...instanceToPlain(nftClassKey)
      });
      console.log(`Fetching Balances for ${galaChainBalanceDto.type} token`)
      const endpoint = '/FetchBalances'
      galaChainBalanceDto.sign(privateKey);
      const payloadString = galaChainBalanceDto.serialize()
      console.log(` dto string = ${payloadString}`)
      const fetchBalanceResponse = await galaChainTokenAxios.post(endpoint, payloadString)
      console.log(`Fetch balance response = ${JSON.stringify(fetchBalanceResponse.data)}`)

      balancesData.push(fetchBalanceResponse.data.Data[0])
    }
  
    // await client.disconnect();
    res.json({ data: balancesData });
  } catch (error) {
    // await client.disconnect();
    console.log(`Error fetching balances = ${JSON.stringify(error)}`)
  }
});

// Mint Tokens
app.post('/mint-tokens', async (req: MintBurnRequest, res: Response, next: NextFunction) => {
  const {tokenKey, quantity, identityKey, privateKey} = req.body;
  // const client = getClientWithAuthority("GalaChainToken");

  try {  
    const nftClassKey = tokenClassMap[tokenKey];
    if (!nftClassKey) {
      console.log("Invalid token key!")
      // await client.disconnect();
      return res.status(400).send({
        message: 'Invalid token key. Try again'
    });
    }
    const tokenInstance = TokenInstanceKey.fungibleKey(nftClassKey).toQueryKey()
    console.log(`token instance = ${JSON.stringify(tokenInstance)}`)
    // grant quantity allowance of nftClassKey to user
    const galaAllowanceDto = await createValidDTO<GrantAllowanceDto>(GrantAllowanceDto, {
      tokenInstance,
      allowanceType: AllowanceType.Mint,
      quantities: [
        { user: identityKey, quantity: new BigNumber(quantity) }
      ],
      uses: new BigNumber(10)
    });
    if (!adminPrivateKey) throw Error('Need to define GC_ADMIN_PRIVATE_KEY environment variable')

    let endpoint = '/GrantAllowance'
    galaAllowanceDto.sign(adminPrivateKey);
    let payloadString = galaAllowanceDto.serialize()
    console.log(` dto string = ${payloadString}`)
    console.log("Granting token allowance for user")
    const grantAllowanceResponse = await galaChainTokenAxios.post(endpoint, payloadString)
    console.log(`Grant Allowance response = ${JSON.stringify(grantAllowanceResponse.data)}`)

    // mint Quantity of nftClassKey to user
    const userMintDto = await createValidDTO<MintTokenDto>(MintTokenDto, {
      owner: identityKey,
      tokenClass: nftClassKey,
      quantity: new BigNumber(quantity)
    });
    console.log("Minting tokens for user")
    endpoint = '/MintToken'
    userMintDto.sign(privateKey);
    payloadString = userMintDto.serialize()
    console.log(`dto string = ${payloadString}`)
    console.log("Mint token for user")
    const mintTokenResponse = await galaChainTokenAxios.post(endpoint, payloadString)
    console.log(`Mint Token response = ${JSON.stringify(mintTokenResponse.data)}`)

    res.json({});
  } catch (error) {
    console.log(`error minting token for user: ${JSON.stringify(error)}`)
    return res.status(500).json({ error });
  }
});

// Burn Tokens
app.post('/burn', async (req: MintBurnRequest, res: Response, next: NextFunction) => {
  const {tokenKey, quantity, privateKey} = req.body;

  try {
    const nftClassKey = tokenClassMap[tokenKey];
    if (!nftClassKey) {
      console.log("Invalid token key!")
      return res.status(400).send({
        message: 'Invalid token key. Try again'
     });
    }

    // burn quantity of tokens for user
    const burnTokensDto = await createValidDTO<BurnTokensDto>(BurnTokensDto, {
      tokenInstances: [
        {
          tokenInstanceKey: TokenInstanceKey.fungibleKey(nftClassKey),
          quantity: new BigNumber(quantity)
        }
      ]
    });
    console.log("burning tokens for user")
    let endpoint = '/BurnTokens'
    burnTokensDto.sign(privateKey);
    let payloadString = burnTokensDto.serialize()
    console.log(`dto string = ${payloadString}`)
    console.log("Burn Tokens for user")
    const burnTokensResponse = await galaChainTokenAxios.post(endpoint, payloadString)
    console.log(`Burn Token response = ${JSON.stringify(burnTokensResponse.data)}`)
    res.json(burnTokensResponse.data);
  } catch (error) {
    // await client.disconnect();
    console.log(`Error burning tokens: ${JSON.stringify(error)}`)
    return res.status(500).json({error})
  }
});

// LFG 🚀
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running: http://localhost:${port}`);
});
