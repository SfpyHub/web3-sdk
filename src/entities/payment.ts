import { CurrencyAmount } from './fractions/currencyAmount'
import { TokenAmount } from './fractions/tokenAmount'
import { Rate } from './rate'

export class Payment {
  public readonly grandTotal: CurrencyAmount
  public readonly tokenAmount: TokenAmount
  public readonly rate: Rate

  public constructor(grandTotal: CurrencyAmount, inputAmount: TokenAmount, rate: Rate) {
    this.grandTotal = grandTotal
    this.tokenAmount = inputAmount
    this.rate = rate
  }
}
