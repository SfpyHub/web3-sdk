import { ONE, ZERO } from '../constants'
import { ETHER } from './currency'
import { Price } from './fractions/price'
import { Fraction } from './fractions/fraction'
import { Percent } from './fractions/percent'
import { CurrencyAmount } from './fractions/currencyAmount'
import { TokenAmount } from './fractions/tokenAmount'
import invariant from 'tiny-invariant'

export class Rate {
  public readonly baseTokenAmount: CurrencyAmount
  public readonly quoteTokenAmount: CurrencyAmount

  public readonly executionPrice: Price

  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly inputAmount: CurrencyAmount

  public constructor(baseTokenAmount: CurrencyAmount, quoteTokenAmount: CurrencyAmount) {
    this.baseTokenAmount = baseTokenAmount
    this.quoteTokenAmount = quoteTokenAmount

    this.inputAmount =
      quoteTokenAmount.currency === ETHER
        ? CurrencyAmount.ether(quoteTokenAmount.raw)
        : new CurrencyAmount(this.quoteTokenAmount.currency, quoteTokenAmount.raw)

    this.executionPrice = new Price(
      this.baseTokenAmount.currency,
      this.quoteTokenAmount.currency,
      this.baseTokenAmount.raw,
      this.quoteTokenAmount.raw
    )
  }

  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public maximumAmountIn(slippageTolerance: Percent): CurrencyAmount {
    invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
    const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient
    return this.inputAmount instanceof TokenAmount
      ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn)
      : CurrencyAmount.ether(slippageAdjustedAmountIn)
  }

  public rawPrice(): CurrencyAmount {
    return this.baseTokenAmount
  }
}
