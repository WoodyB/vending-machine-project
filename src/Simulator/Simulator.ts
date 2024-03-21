import { CoinMechanismInsertedCoinsInterface} from '../interfaces';
import { TerminalInterface } from './interfaces';
import { Coins } from '../types'
import { Keys } from './types';

export class Simulator {
    private terminal: TerminalInterface;
    private coinMechanismAdapter: CoinMechanismInsertedCoinsInterface;
    private previousKey: Keys;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(terminal: TerminalInterface, coinMechanismAdapter: CoinMechanismInsertedCoinsInterface) {
        this.terminal = terminal;
        this.coinMechanismAdapter = coinMechanismAdapter;
        this.previousKey = Keys.NO_KEY;
        this.terminal.output('Simulator started');    
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    public handleKeyPress(str: string, key: any): void {        
        if (key.sequence !== Keys.ENTER) {
            this.previousKey = key.sequence;
            return;
        }

        if (this.previousKey === Keys.Q) {
            this.coinMechanismAdapter.insertCoin(Coins.QUARTER)
        }
        
        if (this.previousKey === Keys.D) {
            this.coinMechanismAdapter.insertCoin(Coins.DIME)
        }
        
        if (this.previousKey === Keys.N) {
            this.coinMechanismAdapter.insertCoin(Coins.NICKEL)
        }        

        if (this.previousKey === Keys.P) {
            this.coinMechanismAdapter.insertCoin(Coins.PENNY)
        }

        if (this.previousKey === Keys.S) {
            this.coinMechanismAdapter.insertCoin(Coins.SLUG)
        }        

        if (this.previousKey === Keys.F) {
            this.coinMechanismAdapter.insertCoin(Coins.FOREIGN_COIN)
        }        
    }
}