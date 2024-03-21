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
  privateKey: string
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
   const magicSwordDto: CreateTokenClassDto =
      await createValidDTO<CreateTokenClassDto>(CreateTokenClassDto, {
        decimals: 2,
        tokenClass: tokenClassMap.MGSD,
        name: "Magic Sword",
        symbol: "MGSD",
        description:
          "Magic Sword Non-Fungible Token for Wizard Game",
        isNonFungible: true,
        image:
          "https://files.slack.com/files-tmb/T018SUFPRNU-F06JNH22RE0-c43278d8ca/nft_cores_360.gif",
        maxSupply: new BigNumber(20),
      });
    console.log('creating poisonous snake dto')

   // create poisonous snake dto
   const poisonousSnakeDto: CreateTokenClassDto =
   await createValidDTO<CreateTokenClassDto>(CreateTokenClassDto, {
     decimals: 2,
     tokenClass: tokenClassMap.PSNK,
     name: "Poisonous Snake",
     symbol: "PSNK",
     description:
       "Poisonous Snake Non-Fungible Token for Wizard Game",
     isNonFungible: true,
     image:
       "https://files.slack.com/files-tmb/T018SUFPRNU-F06JNH22RE0-c43278d8ca/nft_cores_360.gif",
     maxSupply: new BigNumber(15),
   });
   // store all dtos in an array
   const dtoArray: CreateTokenClassDto[] = [dragonStoneDto, dragonTearsDto, magicSwordDto, poisonousSnakeDto]
   const failed = []
   // Make api request to /CreateTokenClass endpoint
   try {

    if (!adminPrivateKey ) throw Error(
      'Need to define GC_ADMIN_PRIVATE_KEY and GC_ADMIN_PUBLIC_KEY environment variables')

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
// // Balances
// app.post('/balances', async (req: MintBurnRequest, res: Response, next: NextFunction) => {
//   const { identityKey, privateKey} = req.body;
//   const client = getClientWithAuthority("GalaChainToken");
  
//   try {

//     const balancesData = []
//     for (const key in tokenClassMap) {
//       const nftClassKey = tokenClassMap[key]
//       // get balance of nftClassKey for user
//       const galaBalanceDto = await createValidDTO(FetchBalancesDto, {
//         owner: identityKey,
//         ...instanceToPlain(nftClassKey)
//       });
//       console.log("Fetching Balances for User")
//       const fetchBalanceResponse: any = await client.evaluateTransaction(
//         "FetchBalances",
//         galaBalanceDto.signed(privateKey, false),
//         // @ts-expect-error
//         TokenBalance
//       );
//       if (GalaChainResponse.isError(fetchBalanceResponse)) {
//         await client.disconnect();
//         return res.status(500).json({ ...fetchBalanceResponse });
//       }  
//       balancesData.push(fetchBalanceResponse.Data[0])
//     }
  
//     await client.disconnect();
//     res.json({ data: balancesData });
//   } catch (error) {
//     await client.disconnect();
//     next(error);
//   }
// });

// // Mint Tokens
// app.post('/mint-tokens', async (req: MintBurnRequest, res: Response, next: NextFunction) => {
//   const {tokenKey, quantity, identityKey, privateKey} = req.body;
//   const client = getClientWithAuthority("GalaChainToken");

//   try {  
//     const nftClassKey = tokenClassMap[tokenKey];
//     if (!nftClassKey) {
//       console.log("Invalid token key!")
//       await client.disconnect();
//       return res.status(400).send({
//         message: 'Invalid token key. Try again'
//     });
//     }

//     // grant quantity allowance of nftClassKey to user
//     const galaAllowanceDto = await createValidDTO<GrantAllowanceDto>(GrantAllowanceDto, {
//       tokenInstance: TokenInstanceKey.fungibleKey(nftClassKey).toQueryKey(),
//       allowanceType: AllowanceType.Mint,
//       quantities: [
//         { user: identityKey, quantity: new BigNumber(quantity) }
//       ],
//       uses: new BigNumber(10)
//     });
//     console.log("Granting token allowance for user")
//     if (!adminPrivateKey) throw Error('Need to define GC_ADMIN_PRIVATE_KEY environment variable')

//     const grantAllowanceResult = await client.submitTransaction<TokenAllowance[]>(
//       "GrantAllowance",
//       galaAllowanceDto.signed(adminPrivateKey),
//       TokenAllowance
//     );
//     console.log(`grant allowance result = ${JSON.stringify(grantAllowanceResult)}`)
//     if (GalaChainResponse.isError(grantAllowanceResult)) {
//       await client.disconnect();
//       return res.status(500).json({ ...grantAllowanceResult });
//     }

//     // mint Quantity of nftClassKey to user
//     const userMintDto = await createValidDTO<MintTokenDto>(MintTokenDto, {
//       owner: identityKey,
//       tokenClass: nftClassKey,
//       quantity: new BigNumber(quantity)
//     });
//     console.log("Minting tokens for user")
//     const mintTokenResponse = await client.submitTransaction(
//       "MintToken",
//       userMintDto.signed(privateKey),
//       MintTokenDto
//     );

//     if (GalaChainResponse.isError(mintTokenResponse)) {
//       await client.disconnect();
//       return res.status(500).json({ ...mintTokenResponse });
//     }

//     await client.disconnect();
//     res.json({});
//   } catch (error) {
//     await client.disconnect();
//     next(error);
//   }
// });

// // Burn Tokens
// app.put('/burn', async (req: MintBurnRequest, res: Response, next: NextFunction) => {
//   const {tokenKey, quantity, privateKey} = req.body;
//   const client = getClientWithAuthority("GalaChainToken");

//   try {
//     const nftClassKey = tokenClassMap[tokenKey];
//     if (!nftClassKey) {
//       console.log("Invalid token key!")
//       await client.disconnect();
//       return res.status(400).send({
//         message: 'Invalid token key. Try again'
//      });
//     }

//     // burn quantity of tokens for user
//     const burnTokensDto = await createValidDTO<BurnTokensDto>(BurnTokensDto, {
//       tokenInstances: [
//         {
//           tokenInstanceKey: TokenInstanceKey.fungibleKey(nftClassKey),
//           quantity: new BigNumber(quantity)
//         }
//       ]
//     });
//     console.log("burning tokens for user")
//     const burnTokenResponse = await client.submitTransaction<TokenBurn>(
//       "BurnTokens",
//       burnTokensDto.signed(privateKey),
//       TokenBurn
//     );

//     if (GalaChainResponse.isError(burnTokenResponse)) {
//       await client.disconnect();
//       return res.status(500).json({ ...burnTokenResponse });
//     }

//     await client.disconnect();
//     res.json({ data: burnTokenResponse.Data, status: burnTokenResponse.Status });
//   } catch (error) {
//     await client.disconnect();
//     next(error);
//   }
// });

// LFG 🚀
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running: http://localhost:${port}`);
});
