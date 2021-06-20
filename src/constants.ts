import JSBI from 'jsbi'

export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  GANACHE = 1337,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const FACTORY_ADDRESS: string = "0x533f19e1382a9458B7B0D74413EcBdD52a04e623"

export const ROUTER_ADDRESS: string = "0x4BcEeBCE68093cd4E1B61c5911cbdFBd97eeB99E"

export const INIT_CODE_HASH = "0x299fc1dd996bb3989ecb29cbe15651bd653d7f3cba7229ed963bff23482465bc"

export const ZERO_ADDRESS: string = "0x0000000000000000000000000000000000000000"

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _1000 = JSBI.BigInt(1000)
export const _1_ETHER = JSBI.exponentiate(ONE, JSBI.BigInt(18))

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
}

// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20
