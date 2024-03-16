import { appData } from './app-data';
import { states } from './types'
import { CoinMechanismInsertedCoinsAdapter } from './CoinMechanismAdapters/CoinMechanismInsertedCoinsAdapter';
import { DisplayAdapter } from './DisplayAdapters/DisplayAdapter';
import { delay } from './utils/delay';



export class VendingMachine {
    private machineOn: boolean;
    private state = states.POWER_UP;
    private pendingTransactionTotal: number;

    constructor(
        private displayAdapter: DisplayAdapter,
        private coinMechanismInsertedCoinsAdapter: CoinMechanismInsertedCoinsAdapter) {
            this.coinMechanismInsertedCoinsAdapter = coinMechanismInsertedCoinsAdapter;
            this.displayAdapter = displayAdapter;    
            this.machineOn = false;
            this.pendingTransactionTotal = 0;
    }

    public async start() {
        this.machineOn = true;
        this.state = states.POWER_UP;
        this.displayAdapter.output(`Vending Machine Project Version ${appData.version}`);

        while (this.machineOn) {
            switch (this.state) {

                case states.POWER_UP:
                    this.state = states.IDLE;
                break;
                
                case states.IDLE:
                    this.pendingTransactionTotal = this.coinMechanismInsertedCoinsAdapter.readPendingTransactionTotal();
                    if (this.pendingTransactionTotal > 0) {
                        this.displayAdapter.output(this.pendingTransactionTotal.toFixed(2));
                    }
                    else {
                        this.displayAdapter.output('Insert Coin');
                    }
                    this.state = states.POWER_DOWN;
                break;
                
                case states.POWER_DOWN:
                    this.machineOn = false;
                break;                    
            }
            await delay(10);
        }
    }
}