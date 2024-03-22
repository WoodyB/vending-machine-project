import { CoinMechanismInsertedCoinsInterface, SystemInterface} from '../interfaces';
import { TerminalInterface } from './interfaces';
import { Coins, SystemEvents } from '../types'
import { Keys } from './types';
import { delay } from '../utils/delay';

export class Simulator {
    private terminal: TerminalInterface;
    private coinMechanismAdapter: CoinMechanismInsertedCoinsInterface;
    private systemAdapter: SystemInterface;
    private previousKey: Keys;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(terminal: TerminalInterface,
        coinMechanismAdapter: CoinMechanismInsertedCoinsInterface,
        systemAdapter: SystemInterface) {
        this.terminal = terminal;
        this.coinMechanismAdapter = coinMechanismAdapter;
        this.systemAdapter = systemAdapter;
        this.previousKey = Keys.NO_KEY;
        this.terminal.output('Simulator started');
        this.systemAdapter.reportSystemEvent(SystemEvents.POWER_ON);    
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    public async handleKeyPress(str: string, key: any): Promise<void> {        
        if (key.sequence === Keys.X ||
            key.sequence === Keys.ESC ||
            key.sequence === Keys.CTL_C) {
                this.terminal.output('Simulator shutting down');
                this.systemAdapter.reportSystemEvent(SystemEvents.POWER_DOWN);
                await delay(1000);
                this.stop();
        }
        
        if (key.sequence !== Keys.ENTER) {
            this.previousKey = key.sequence;
            return;
        }

        if (this.previousKey === Keys.Q) {
            this.coinMechanismAdapter.insertCoin(Coins.QUARTER);
        }
        
        if (this.previousKey === Keys.D) {
            this.coinMechanismAdapter.insertCoin(Coins.DIME);
        }
        
        if (this.previousKey === Keys.N) {
            this.coinMechanismAdapter.insertCoin(Coins.NICKEL);
        }        

        if (this.previousKey === Keys.P) {
            this.coinMechanismAdapter.insertCoin(Coins.PENNY);
        }

        if (this.previousKey === Keys.S) {
            this.coinMechanismAdapter.insertCoin(Coins.SLUG);
        }        

        if (this.previousKey === Keys.F) {
            this.coinMechanismAdapter.insertCoin(Coins.FOREIGN_COIN);
        }
        
        this.previousKey = Keys.NO_KEY;        
    }

    public stop(): void {
        process.exit(0);
    }
}