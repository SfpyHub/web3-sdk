import { TokenAmount } from './fractions/tokenAmount'
import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import { FACTORY_ADDRESS, INIT_CODE_HASH, ZERO, ChainId } from '../constants'
import { Token } from './token'

let POOL_ADDRESS_CACHE: { [tokenAddress: string]: string } = {}

export class Pool {
  public readonly liquidityToken: Token
  private readonly tokenAmount: TokenAmount

  public static getAddress(token: Token): string {
    if (POOL_ADDRESS_CACHE?.[token.address] === undefined) {
      POOL_ADDRESS_CACHE = {
        ...POOL_ADDRESS_CACHE,
        [token.address]: getCreate2Address(
          FACTORY_ADDRESS,
          keccak256(['bytes'], [pack(['address'], [token.address])]),
          INIT_CODE_HASH
        ),
      }
    }
    //return "0x643520C0B4e34dE4BeEAD2F6822814353fa56Cc4"
    return POOL_ADDRESS_CACHE[token.address]
  }

  public constructor(tokenAmount: TokenAmount) {
    this.liquidityToken = new Token(
      tokenAmount.token.chainId,
      Pool.getAddress(tokenAmount.token),
      18,
      'SFPY',
      'Safepay'
    )
    this.tokenAmount = tokenAmount as TokenAmount
  }

  /**
   * Returns true if the token is token
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token)
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): ChainId {
    return this.token.chainId
  }

  public get token(): Token {
    return this.tokenAmount.token
  }

  public get reserve(): TokenAmount {
    return this.tokenAmount
  }

  public getLiquidityToBurn(totalSupply: TokenAmount, tokenAmount: TokenAmount): TokenAmount {
    invariant(totalSupply.token.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(tokenAmount.token.equals(this.token), 'TOKEN')

    if (JSBI.equal(this.reserve.raw, ZERO)) {
      return new TokenAmount(this.liquidityToken, ZERO)
    }

    const liquidity: JSBI = JSBI.divide(JSBI.multiply(tokenAmount.raw, totalSupply.raw), this.reserve.raw)

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      return new TokenAmount(this.liquidityToken, ZERO)
    }

    return new TokenAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(token: Token, totalSupply: TokenAmount, liquidity: TokenAmount): TokenAmount {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.token.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.token.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw), 'LIQUIDITY')

    let totalSupplyAdjusted: TokenAmount
    totalSupplyAdjusted = totalSupply

    if (JSBI.equal(totalSupplyAdjusted.raw, ZERO)) {
      return new TokenAmount(token, ZERO)
    }

    return new TokenAmount(token, JSBI.divide(JSBI.multiply(liquidity.raw, this.reserve.raw), totalSupplyAdjusted.raw))
  }
}
