import { CoinMechanismDispenseCoinsInterface } from '../interfaces'
import { Coins } from '../types';
import { Terminal } from '../Simulator/Terminal';
import { VM_STR_ACTION, VM_STR_COIN_WAS_DISPENSED } from '../constants/vending-machine-strings';

export class CoinMechanismDispenseCoinsSimulatorAdapter implements CoinMechanismDispenseCoinsInterface{
  private terminal: Terminal;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }
  
  public dispenseCoin(coin: Coins): void {
    if (coin === Coins.NO_COIN) {
      return;
    }
    this.terminal.output(`${VM_STR_ACTION} ${coin} ${VM_STR_COIN_WAS_DISPENSED}`);
  }
}