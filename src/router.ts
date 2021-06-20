import invariant from 'tiny-invariant'
import { validateAndParseAddress } from './utils'
import { CurrencyAmount, TokenAmount, ETHER } from './entities'

/**
 * Options for producing the arguments to send call to the router.
 */
export interface PaymentOptions {
  /**
   * How long the swap is valid until it expires, in seconds.
   * This will be used to produce a `deadline` parameter which is computed from when the swap call parameters
   * are generated.
   */
  deadline: number
  /**
   * The account that should receive the output of the swap.
   */
  recipient: string
  /**
   * The request that the payment is being made towards
   */
  request: string
  /**
   * The compound price oracle exchange rate for the currency
   */
  rate: string
}

/**
 * The parameters to use in the call to the Safepay Router to execute a payment.
 */
export interface PayParameters {
  /**
   * The method to call on the Safepay Router.
   */
  methodName: string
  /**
   * The arguments to pass to the method, all hex encoded.
   */
  args: (string | string[])[]
  /**
   * The amount of wei to send in hex.
   */
  value: string
}

function toHex(currencyAmount: CurrencyAmount) {
  return `0x${currencyAmount.raw.toString(16)}`
}

const ZERO_HEX = '0x0'

/**
 * Represents the Safepay Router, and has static methods for helping execute trades.
 */
export abstract class Router {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given payment.
   * @param rate to produce call parameters for
   * @param options options for the call parameters
   */
  public static payCallParameters(inputAmount: CurrencyAmount, options: PaymentOptions): PayParameters {
    const etherIn = inputAmount.currency === ETHER
    invariant(!('deadline' in options) || options.deadline > 0, 'TTL')

    const to: string = validateAndParseAddress(options.recipient)
    const amountIn: string = toHex(inputAmount)
    const token: string = etherIn ? '' : inputAmount instanceof TokenAmount ? inputAmount.token.address : ''
    invariant(etherIn || token !== '', 'TOKEN')

    const deadline = `0x${(Math.floor(new Date().getTime() / 1000) + options.deadline).toString(16)}`

    let methodName: string
    let args: (string | string[])[]
    let value: string
    if (etherIn) {
      methodName = 'payETH'
      args = [options.request, to, options.rate, deadline]
      value = amountIn
    } else {
      methodName = 'pay'
      args = [token, amountIn, options.rate, options.request, to, deadline]
      value = ZERO_HEX
    }

    return {
      methodName,
      args,
      value,
    }
  }
}
