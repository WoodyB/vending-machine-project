import { appData } from './app-data';
import { states,systemEvents } from './types'
import { CoinMechanismInsertedCoinsAdapter } from './CoinMechanismAdapters/CoinMechanismInsertedCoinsAdapter';
import { DisplayAdapter } from './DisplayAdapters/DisplayAdapter';
import { SystemAdapter } from './SystemAdapters/SystemAdapter';
import { delay } from './utils/delay';



export class VendingMachine {
    private machineOn: boolean;
    private state = states.POWER_UP;
    private pendingTransactionTotal: number;

    constructor(
        private displayAdapter: DisplayAdapter,
        private coinMechanismInsertedCoinsAdapter: CoinMechanismInsertedCoinsAdapter,
        private systemAdapter: SystemAdapter) {
            this.coinMechanismInsertedCoinsAdapter = coinMechanismInsertedCoinsAdapter;
            this.displayAdapter = displayAdapter;
            this.systemAdapter = systemAdapter;    
            this.machineOn = false;
            this.pendingTransactionTotal = 0;
    }

    public async start() {
        this.machineOn = true;
        this.state = states.POWER_UP;

        while (this.machineOn) {
            if (this.systemAdapter.readSystemEvent() === systemEvents.POWER_DOWN) {
                this.state = states.POWER_DOWN;
            }

            switch (this.state) {

                case states.POWER_UP:
                    this.displayAdapter.output(`Vending Machine Project Version ${appData.version}`);
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
                break;
                
                case states.POWER_DOWN:
                    this.displayAdapter.output('Vending Machine Powering Down');
                    this.machineOn = false;
                break;                    
            }
            await delay(10);
        }
    }
}