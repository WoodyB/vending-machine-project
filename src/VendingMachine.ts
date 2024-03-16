import { appData } from './app-data';
import { states } from './types'
import { CoinMechanismInsertedCoinsAdapter } from './CoinMechanismAdapters/CoinMechanismInsertedCoinsAdapter';
import { delay } from './utils/delay';



export class VendingMachine {
    private machineOn: boolean;
    private state = states.POWER_UP;
    private pendingTransactionTotal: number;

    constructor(
        private display: (str: string) => void, private coinMechanismInsertedCoinsAdapter: CoinMechanismInsertedCoinsAdapter) {
        this.coinMechanismInsertedCoinsAdapter = coinMechanismInsertedCoinsAdapter;    
        this.machineOn = false;
        this.pendingTransactionTotal = 0;
    }

    public async start() {
        this.machineOn = true;
        this.state = states.POWER_UP;
        this.display(`Vending Machine Project Version ${appData.version}`);

        while (this.machineOn) {
            switch (this.state) {

                case states.POWER_UP:
                    this.state = states.IDLE;
                break;
                
                case states.IDLE:
                    this.pendingTransactionTotal = this.coinMechanismInsertedCoinsAdapter.readPendingTransactionTotal();
                    if (this.pendingTransactionTotal > 0) {
                        this.display(this.pendingTransactionTotal.toFixed(2));
                    }
                    else {
                        this.display('Insert Coin');
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