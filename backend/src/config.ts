import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  ChainUser,
  ContractConfig,
  HFClientConfig,
  buildChainUserAPI,
  commonContractAPI,
  gcclient,
  publicKeyContractAPI
} from "@gala-chain/client";

export const env = dotenv.config();
export const networkRoot = path.resolve(__dirname, '..', process.env.GALA_NETWORK_ROOT_PATH ?? '../../chain/test-network');
export const adminPrivateKey = fs.readFileSync(path.resolve(networkRoot, "dev-admin-key/dev-admin.priv.hex.txt")).toString();

export const clientConfig: HFClientConfig = {
  orgMsp: "CuratorOrg",
  userId: "admin",
  userPass: "adminpw",
  connectionProfilePath: path.resolve(networkRoot, "connection-profiles/cpp-curator.json")
};

export const contract: ContractConfig = {
  channelName: "product-channel",
  chaincodeName: "basic-product",
  contractName: "PublicKeyContract"
};

export function getClientWithAuthority(contractName?: "PublicKeyContract" | "GalaChainToken") {
  return gcclient
    .forConnectionProfile(clientConfig)
    .forContract({ ...contract, contractName: contractName ?? "PublicKeyContract" })
    .extendAPI(publicKeyContractAPI);
}
