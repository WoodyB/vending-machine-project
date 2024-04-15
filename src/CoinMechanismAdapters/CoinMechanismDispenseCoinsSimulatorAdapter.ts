import { CoinMechanismDispenseCoinsInterface } from '../interfaces'
import { Coins } from '../types';
import { Terminal } from '../Simulator/Terminal';
//import { VM_STR_ACTION, VM_STR_COIN_REJECTED } from '../constants/vending-machine-strings';

export class CoinMechanismDispenseCoinsSimulatorAdapter implements CoinMechanismDispenseCoinsInterface{
  private terminal: Terminal;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public dispenseCoin(coin: Coins): void {
    
  }
}