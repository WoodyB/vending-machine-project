import { appData } from './app-data';
import { States, SystemEvents } from './types'
import { CoinMechanismInsertedCoinsInterface } from './interfaces'
import { DisplayInterface } from './interfaces';
import { SystemInterface } from './interfaces';
import { delay } from './utils/delay';



export class VendingMachine {
    private machineOn: boolean;
    private state = States.POWER_UP;
    private pendingTransactionTotal: number;

    constructor(
        private displayAdapter: DisplayInterface,
        private coinMechanismInsertedCoinsAdapter: CoinMechanismInsertedCoinsInterface,
        private systemAdapter: SystemInterface) {
            this.coinMechanismInsertedCoinsAdapter = coinMechanismInsertedCoinsAdapter;
            this.displayAdapter = displayAdapter;
            this.systemAdapter = systemAdapter;    
            this.machineOn = false;
            this.pendingTransactionTotal = 0;
    }

    public async start() {
        this.machineOn = true;
        this.state = States.POWER_UP;

        while (this.machineOn) {
            if (this.systemAdapter.readSystemEvent() === SystemEvents.POWER_DOWN) {
                this.state = States.POWER_DOWN;
            }

            switch (this.state) {

                case States.POWER_UP:
                    this.displayAdapter.output(`Vending Machine Project Version ${appData.version}`);
                    this.state = States.IDLE;
                break;
                
                case States.IDLE:
                    this.pendingTransactionTotal = this.coinMechanismInsertedCoinsAdapter.readPendingTransactionTotal();
                    if (this.pendingTransactionTotal > 0) {
                        this.displayAdapter.output(this.pendingTransactionTotal.toFixed(2));
                    }
                    else {
                        this.displayAdapter.output('Insert Coin');
                    }
                break;
                
                case States.POWER_DOWN:
                    this.displayAdapter.output('Vending Machine Powering Down');
                    this.machineOn = false;
                break;                    
            }
            await delay(10);
        }
    }
}