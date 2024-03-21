import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios'
// import {
//   ChainUser,
//   ContractConfig,
//   HFClientConfig,
//   RestApiClientConfig,
//   buildChainUserAPI,
//   commonContractAPI,
//   gcclient,
//   publicKeyContractAPI
// } from "@gala-chain/client";

export const env = dotenv.config();
// export const networkRoot = path.resolve(__dirname, '..', process.env.GALA_NETWORK_ROOT_PATH ?? '../../chain/test-network');
//export const adminPrivateKey = fs.readFileSync(path.resolve(networkRoot, "dev-admin-key/dev-admin.priv.hex.txt")).toString();
export const { 
  GC_ADMIN_PRIVATE_KEY: adminPrivateKey, CHAIN_CODE_NAME: chainCodeName, CHAIN_HOST: chainHost, GC_ADMIN_PUBLIC_KEY: adminPublicKey
} = process.env

export const galaChainTokenBaseUrl = `${chainHost}/api/${chainCodeName}-GalaChainToken`
const galaPublicKeyContractBaseUrl = `${chainHost}/api/${chainCodeName}-PublicKeyContract`
export const galaChainTokenAxios = axios.create({
  baseURL: galaChainTokenBaseUrl,
  headers: {'accept': 'application/json', 'Content-Type': 'application/json'}
});
export const galaPublicKeyContractAxios = axios.create({
  baseURL: galaPublicKeyContractBaseUrl,
  headers: {'accept': 'application/json', 'Content-Type': 'application/json'}
});
// export const clientConfig: HFClientConfig = {
//   orgMsp: "CuratorOrg",
//   userId: "admin",
//   userPass: "adminpw",
//   connectionProfilePath: path.resolve(networkRoot, "connection-profiles/cpp-curator.json")
// };
// const params: RestApiClientConfig = {
//   orgMsp: "CuratorOrg",
//   apiUrl: "http://localhost:3000/api",
//   configPath: path.resolve(__dirname, "api-config.json")
// };

// export const contract: ContractConfig = {
//   channelName: "product-channel",
//   chaincodeName: "basic-product",
//   contractName: "PublicKeyContract"
// };

// export function getClientWithAuthority(contractName?: "PublicKeyContract" | "GalaChainToken") {
//   return gcclient
//   .forApiConfig(params)
//   .forContract(contract)
//   .extendAPI(publicKeyContractAPI);
// }


// export function getClientWithAuthority(contractName?: "PublicKeyContract" | "GalaChainToken") {
//   return gcclient
//     .forConnectionProfile(clientConfig)
//     .forContract({ ...contract, contractName: contractName ?? "PublicKeyContract" })
//     .extendAPI(publicKeyContractAPI);
// }
