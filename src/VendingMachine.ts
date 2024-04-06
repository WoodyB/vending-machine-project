import { appData } from './app-data';
import { States, SystemEvents } from './types'
import { CoinMechanismInsertedCoinsInterface } from './interfaces';
import { VendingMechanismProductSelectInterface } from './interfaces';
import { DisplayInterface } from './interfaces';
import { SystemInterface } from './interfaces';
import { delay } from './utils/delay';
import { Products } from './types';
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
    private productSelected: Products;

    constructor(
        private displayAdapter: DisplayInterface,
        private coinMechanismInsertedCoinsAdapter: CoinMechanismInsertedCoinsInterface,
        private vendingMechanismProductSelectAdapter: VendingMechanismProductSelectInterface,
        private systemAdapter: SystemInterface) {
            this.coinMechanismInsertedCoinsAdapter = coinMechanismInsertedCoinsAdapter;
            this.vendingMechanismProductSelectAdapter = vendingMechanismProductSelectAdapter;
            this.displayAdapter = displayAdapter;
            this.systemAdapter = systemAdapter;    
            this.machineOn = false;
            this.state =  States.POWER_DOWN;
            this.pendingTransactionTotal = 0;
            this.newPendingTransactionTotal = 0;
            this.productSelected = Products.NO_PRODUCT;
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

                    // This next lines causes runtime error in acceptance test smoke-test.spec.ts ?????
                    // TypeError: Cannot read properties of undefined (reading 'readProductSelection')
                    this.productSelected = this.vendingMechanismProductSelectAdapter.readProductSelection();
                    if (this.productSelected != Products.NO_PRODUCT) {
                        this.state = States.PRODUCT_SELECTED;
                        break;
                    }
                break;

                case States.PENDING_TRANSACTION:
                    this.displayAdapter.output(this.pendingTransactionTotal.toFixed(2));
                    this.state = States.IDLE;  
                break;

                case States.PRODUCT_SELECTED:
                    this.state = States.IDLE;
                    //if (this.pendingTransactionTotal >= this.productPricesMap[this.productSelected]) {
                        // this.vendingMechanismProductDispenser.dispenseProduct(this.productSelected);
                        //this.state = States.TRANSACTION_COMPLETE;
                        //this.state = States.IDLE;      
                    //}        
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