import { CoinMechanismInsertedCoinsInterface, CoinHandlerInterface } from '../interfaces'
import { Coins } from '../types';
import { Terminal } from '../Simulator/Terminal';
import { VM_STR_ACTION, VM_STR_COIN_REJECTED } from '../constants/vending-machine-strings';

export class CoinMechanismInsertedCoinsSimulatorAdapter implements CoinMechanismInsertedCoinsInterface{
  private pendingTransactionTotal: number;
  private coinHandlers: Map<Coins, CoinHandlerInterface>;
  private terminal: Terminal;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
    this.pendingTransactionTotal = 0;
    this.coinHandlers = new Map<Coins, CoinHandlerInterface>();
    this.coinHandlers.set(Coins.QUARTER, new QuarterHandler);
    this.coinHandlers.set(Coins.DIME, new DimeHandler);
    this.coinHandlers.set(Coins.NICKEL, new NickelHandler);
  }

  public insertCoin(coin: Coins): void {
    const coinHandler = this.coinHandlers.get(coin);
    if (coinHandler) {
      this.pendingTransactionTotal = coinHandler.handleCoin(this.pendingTransactionTotal);
      return;
    }

    this.terminal.output(`${VM_STR_ACTION} ${coin} ${VM_STR_COIN_REJECTED}`);
  }

  public readPendingTransactionTotal(): number {
    return this.pendingTransactionTotal;
  }

  public resetPendingTransactionTotal(): void {
    this.pendingTransactionTotal = 0;
  }
}    

class QuarterHandler implements CoinHandlerInterface {
  handleCoin(total: number): number {
    return total + 0.25;
  }
}

class DimeHandler implements CoinHandlerInterface {
  handleCoin(total: number): number {
    return total + 0.10;
  }
}

class NickelHandler implements CoinHandlerInterface {
  handleCoin(total: number): number {
    return total + 0.05;
  }
}