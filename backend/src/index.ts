import express, { Request, Response , Application, NextFunction } from 'express';
import cors from "cors";
import {
  GalaChainResponse,
  GrantAllowanceDto,
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
  getClientWithAuthority,
} from './config';

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
  const client = getClientWithAuthority("PublicKeyContract");
  const newUser = ChainUser.withRandomKeys();

  try {
    const dto = new RegisterUserDto();
    dto.publicKey = newUser.publicKey;
    dto.sign(adminPrivateKey, false);
    const response = await client.RegisterEthUser(dto);
    if (GalaChainResponse.isError(response)) {
      await client.disconnect();
      return res.status(500).json({ ...response });
    }

    await client.disconnect();
    res.json({
      alias: newUser.name,
      ethAddress: newUser.ethAddress,
      user: newUser,
      response: { 
        data: response.Data,
        status: response.Status
      }
    });
  } catch (error) {
    await client.disconnect();
    next(error);
  }
});

// Balances
app.post('/balances', async (req: MintBurnRequest, res: Response, next: NextFunction) => {
  const { identityKey, privateKey} = req.body;
  const client = getClientWithAuthority("GalaChainToken");
  
  try {

    const balancesData = []
    for (const key in tokenClassMap) {
      const nftClassKey = tokenClassMap[key]
      // get balance of nftClassKey for user
      const galaBalanceDto = await createValidDTO(FetchBalancesDto, {
        owner: identityKey,
        ...instanceToPlain(nftClassKey)
      });
      console.log("Fetching Balances for User")
      const fetchBalanceResponse: any = await client.evaluateTransaction(
        "FetchBalances",
        galaBalanceDto.signed(privateKey, false),
        // @ts-expect-error
        TokenBalance
      );
      if (GalaChainResponse.isError(fetchBalanceResponse)) {
        await client.disconnect();
        return res.status(500).json({ ...fetchBalanceResponse });
      }  
      balancesData.push(fetchBalanceResponse.Data[0])
    }
  
    await client.disconnect();
    res.json({ data: balancesData });
  } catch (error) {
    await client.disconnect();
    next(error);
  }
});

// Mint Tokens
app.post('/mint-tokens', async (req: MintBurnRequest, res: Response, next: NextFunction) => {
  const {tokenKey, quantity, identityKey, privateKey} = req.body;
  const client = getClientWithAuthority("GalaChainToken");

  try {  
    const nftClassKey = tokenClassMap[tokenKey];
    if (!nftClassKey) {
      console.log("Invalid token key!")
      await client.disconnect();
      return res.status(400).send({
        message: 'Invalid token key. Try again'
    });
    }

    // grant quantity allowance of nftClassKey to user
    const galaAllowanceDto = await createValidDTO<GrantAllowanceDto>(GrantAllowanceDto, {
      tokenInstance: TokenInstanceKey.fungibleKey(nftClassKey).toQueryKey(),
      allowanceType: AllowanceType.Mint,
      quantities: [
        { user: identityKey, quantity: new BigNumber(quantity) }
      ],
      uses: new BigNumber(10)
    });
    console.log("Granting token allowance for user")
    const grantAllowanceResult = await client.submitTransaction<TokenAllowance[]>(
      "GrantAllowance",
      galaAllowanceDto.signed(adminPrivateKey),
      TokenAllowance
    );
    console.log(`grant allowance result = ${JSON.stringify(grantAllowanceResult)}`)
    if (GalaChainResponse.isError(grantAllowanceResult)) {
      await client.disconnect();
      return res.status(500).json({ ...grantAllowanceResult });
    }

    // mint Quantity of nftClassKey to user
    const userMintDto = await createValidDTO<MintTokenDto>(MintTokenDto, {
      owner: identityKey,
      tokenClass: nftClassKey,
      quantity: new BigNumber(quantity)
    });
    console.log("Minting tokens for user")
    const mintTokenResponse = await client.submitTransaction(
      "MintToken",
      userMintDto.signed(privateKey),
      MintTokenDto
    );

    if (GalaChainResponse.isError(mintTokenResponse)) {
      await client.disconnect();
      return res.status(500).json({ ...mintTokenResponse });
    }

    await client.disconnect();
    res.json({});
  } catch (error) {
    await client.disconnect();
    next(error);
  }
});

// Burn Tokens
app.put('/burn', async (req: MintBurnRequest, res: Response, next: NextFunction) => {
  const {tokenKey, quantity, privateKey} = req.body;
  const client = getClientWithAuthority("GalaChainToken");

  try {
    const nftClassKey = tokenClassMap[tokenKey];
    if (!nftClassKey) {
      console.log("Invalid token key!")
      await client.disconnect();
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
    const burnTokenResponse = await client.submitTransaction<TokenBurn>(
      "BurnTokens",
      burnTokensDto.signed(privateKey),
      TokenBurn
    );

    if (GalaChainResponse.isError(burnTokenResponse)) {
      await client.disconnect();
      return res.status(500).json({ ...burnTokenResponse });
    }

    await client.disconnect();
    res.json({ data: burnTokenResponse.Data, status: burnTokenResponse.Status });
  } catch (error) {
    await client.disconnect();
    next(error);
  }
});

// LFG 🚀
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running: http://localhost:${port}`);
});
