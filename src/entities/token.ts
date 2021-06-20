import invariant from 'tiny-invariant'
import { ChainId, ZERO_ADDRESS } from '../constants'
import { Currency } from './currency'
import { validateAndParseAddress } from '../utils'

export class Token extends Currency {
  public readonly chainId: ChainId
  public readonly address: string

  public constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  public equals(other: Token): boolean {
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

export const UNKNOWN = (chainId: ChainId) => {
  return new Token(
    chainId,
    ZERO_ADDRESS,
    18,
    "UNKN",
    'Unknown Token'
  )
}

export const USDC = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x07865c6E87B9F70255377e024ace6630C1Eaa37F', 6, 'USDC', 'USD Coin'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, '0xbEC731D6e75E78a4e6A4E70CAFd1B37542d7f2e4', 6, 'USDC', 'USD Coin'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0x33b5b322D39692b018d9811A72E474F0176a72f1', 6, 'USDC', 'USD Coin'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0xAbb9c02BCb1A7E59d448bE947Db381Abbd3D9ef5', 6, 'USDC', 'USD Coin'),
  [ChainId.GANACHE]: new Token(ChainId.GANACHE, '0xAbb9c02BCb1A7E59d448bE947Db381Abbd3D9ef5', 6, 'USDC', 'USD Coin'),
}

export const WETH = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.GANACHE]: new Token(ChainId.GANACHE, '0x5EEb081D2efbc82AD21543582fe46BE797541FE6', 18, 'WETH', 'Wrapped Ether'),
}
