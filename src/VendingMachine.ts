import { appData } from './app-data';
import { States, SystemEvents } from './types'
import { CoinMechanismInsertedCoinsInterface } from './interfaces'
import { DisplayInterface } from './interfaces';
import { SystemInterface } from './interfaces';
import { delay } from './utils/delay';
import {
    VM_STR_INSERT_COIN,
    VM_STR_POWERING_DOWN,
    VM_STR_VERSION
} from './constants/vending-machine-strings';

export class VendingMachine {
    private machineOn: boolean;
    private state: States;
    private pendingTransactionTotal: number;
    private newPendingTransactionTotal: number;

    constructor(
        private displayAdapter: DisplayInterface,
        private coinMechanismInsertedCoinsAdapter: CoinMechanismInsertedCoinsInterface,
        private systemAdapter: SystemInterface) {
            this.coinMechanismInsertedCoinsAdapter = coinMechanismInsertedCoinsAdapter;
            this.displayAdapter = displayAdapter;
            this.systemAdapter = systemAdapter;    
            this.machineOn = false;
            this.state =  States.POWER_DOWN;
            this.pendingTransactionTotal = 0;
            this.newPendingTransactionTotal = 0;
            this.off();
    }

    public async off() {
        while (!this.machineOn) {   
            if (this.systemAdapter.readSystemEvent() === SystemEvents.POWER_ON) {
                this.state = States.POWER_UP;
                this.machineOn =  true;
                this.start();
            }
            await delay(10);    
        }
    }

    public async start() {
        while (this.machineOn) {
            if (this.systemAdapter.readSystemEvent() === SystemEvents.POWER_DOWN) {
                this.state = States.POWER_DOWN;
            }

            switch (this.state) {

                case States.POWER_UP:
                    this.displayAdapter.output(`${VM_STR_VERSION} ${appData.version}`);
                    this.state = States.IDLE;
                break;
                
                case States.IDLE:
                    this.newPendingTransactionTotal = this.coinMechanismInsertedCoinsAdapter.readPendingTransactionTotal();
                    if (this.newPendingTransactionTotal > this.pendingTransactionTotal) {
                        this.pendingTransactionTotal = this.newPendingTransactionTotal;
                        this.state = States.PENDING_TRANSACTION;
                        break;
                    }
                    
                    if (this.pendingTransactionTotal === 0) {
                        this.displayAdapter.output(VM_STR_INSERT_COIN);
                    }                    
                break;

                case States.PENDING_TRANSACTION:
                    this.displayAdapter.output(this.pendingTransactionTotal.toFixed(2));
                    this.state = States.IDLE;  
                break;

                case States.POWER_DOWN:
                    this.displayAdapter.output(VM_STR_POWERING_DOWN);
                    this.machineOn = false;
                break;                    
            }
            await delay(10);
        }
    }
}