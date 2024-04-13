import { CoinMechanismInsertedCoinsInterface } from '../interfaces'
import { Coins } from '../types';
import { Terminal } from '../Simulator/Terminal';
import { VM_STR_ACTION, VM_STR_COIN_REJECTED } from '../constants/vending-machine-strings';

export class CoinMechanismInsertedCoinsSimulatorAdapter implements CoinMechanismInsertedCoinsInterface{
  private insertedCoin = Coins.NO_COIN;
  private terminal: Terminal;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }

  public insertCoin(coin: Coins): void {
    if (this.isValidCoin(coin)) {
      this.insertedCoin = coin;
      return;  
    }

    this.terminal.output(`${VM_STR_ACTION} ${coin} ${VM_STR_COIN_REJECTED}`);
  }

  public readInsertedCoin(): Coins {
    const coin = this.insertedCoin; 
    this.insertedCoin = Coins.NO_COIN;
    return coin;
  }

  private isValidCoin(coin: Coins) {
    return (coin === Coins.QUARTER || coin === Coins.DIME || coin === Coins.NICKEL);
  }
}