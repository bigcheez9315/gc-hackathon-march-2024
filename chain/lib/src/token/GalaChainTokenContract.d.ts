import { BatchMintTokenDto, BurnTokensDto, CreateTokenClassDto, DeleteAllowancesDto, FetchAllowancesDto, FetchAllowancesResponse, FetchBalancesDto, FetchBurnsDto, FetchMintRequestsDto, FetchTokenClassesDto, FetchTokenClassesResponse, FetchTokenClassesWithPaginationDto, FulfillMintDto, FullAllowanceCheckDto, FullAllowanceCheckResDto, GrantAllowanceDto, HighThroughputMintTokenDto, LockTokenDto, LockTokensDto, MintRequestDto, MintTokenDto, MintTokenWithAllowanceDto, RefreshAllowancesDto, ReleaseTokenDto, TokenAllowance, TokenBalance, TokenBurn, TokenClass, TokenClassKey, TokenInstanceKey, TransferTokenDto, UnlockTokenDto, UnlockTokensDto, UpdateTokenClassDto, UseTokenDto } from "@gala-chain/api";
import { GalaChainContext, GalaContract } from "@gala-chain/chaincode";
export default class GalaChainTokenContract extends GalaContract {
    constructor();
    CreateTokenClass(ctx: GalaChainContext, dto: CreateTokenClassDto): Promise<TokenClassKey>;
    UpdateTokenClass(ctx: GalaChainContext, dto: UpdateTokenClassDto): Promise<TokenClassKey>;
    FetchTokenClasses(ctx: GalaChainContext, dto: FetchTokenClassesDto): Promise<TokenClass[]>;
    FetchTokenClassesWithPagination(ctx: GalaChainContext, dto: FetchTokenClassesWithPaginationDto): Promise<FetchTokenClassesResponse>;
    GrantAllowance(ctx: GalaChainContext, dto: GrantAllowanceDto): Promise<TokenAllowance[]>;
    RefreshAllowances(ctx: GalaChainContext, dto: RefreshAllowancesDto): Promise<TokenAllowance[]>;
    FullAllowanceCheck(ctx: GalaChainContext, dto: FullAllowanceCheckDto): Promise<FullAllowanceCheckResDto>;
    FetchAllowances(ctx: GalaChainContext, dto: FetchAllowancesDto): Promise<FetchAllowancesResponse>;
    DeleteAllowances(ctx: GalaChainContext, dto: DeleteAllowancesDto): Promise<number>;
    FetchBalances(ctx: GalaChainContext, dto: FetchBalancesDto): Promise<TokenBalance[]>;
    RequestMint(ctx: GalaChainContext, dto: HighThroughputMintTokenDto): Promise<FulfillMintDto>;
    FulfillMint(ctx: GalaChainContext, dto: FulfillMintDto): Promise<TokenInstanceKey[]>;
    /**
     * Mint a new instance of an existing TokenClass. High-throughput implementation.
     *
     * @experimental 2023-03-23
     *
     * @decorator `@GalaTransaction(GalaTransactionOptions<HighThroughputMintTokenDto>)`
     */
    HighThroughputMint(ctx: GalaChainContext, dto: HighThroughputMintTokenDto): Promise<TokenInstanceKey[]>;
    FetchMintRequests(ctx: GalaChainContext, dto: FetchMintRequestsDto): Promise<MintRequestDto[]>;
    /**
     * Mint a new instance of an existing TokenClass.
     *
     * @deprecated 2022-12-12, replaced with high-throughput implementation.
     *
     * @decorator `@GalaTransaction(GalaTransactionOptions<MintTokenDto>)`
     */
    MintToken(ctx: GalaChainContext, dto: MintTokenDto): Promise<TokenInstanceKey[]>;
    MintTokenWithAllowance(ctx: GalaChainContext, dto: MintTokenWithAllowanceDto): Promise<TokenInstanceKey[]>;
    BatchMintToken(ctx: GalaChainContext, dto: BatchMintTokenDto): Promise<TokenInstanceKey[]>;
    UseToken(ctx: GalaChainContext, dto: UseTokenDto): Promise<TokenBalance>;
    ReleaseToken(ctx: GalaChainContext, dto: ReleaseTokenDto): Promise<TokenBalance>;
    LockToken(ctx: GalaChainContext, dto: LockTokenDto): Promise<TokenBalance>;
    LockTokens(ctx: GalaChainContext, dto: LockTokensDto): Promise<TokenBalance[]>;
    UnlockToken(ctx: GalaChainContext, dto: UnlockTokenDto): Promise<TokenBalance>;
    UnlockTokens(ctx: GalaChainContext, dto: UnlockTokensDto): Promise<TokenBalance[]>;
    TransferToken(ctx: GalaChainContext, dto: TransferTokenDto): Promise<TokenBalance[]>;
    BurnTokens(ctx: GalaChainContext, dto: BurnTokensDto): Promise<TokenBurn[]>;
    FetchBurns(ctx: GalaChainContext, dto: FetchBurnsDto): Promise<TokenBurn[]>;
}
