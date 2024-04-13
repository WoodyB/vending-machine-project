import { appData } from './app-data';
import { States, SystemEvents } from './types'
import { CurrencyHandler } from './CurrencyHandler';
import { VendingHandler } from './VendingHandler';
import { DisplayInterface } from './interfaces';
import { SystemInterface } from './interfaces';
import { delay } from './utils/delay';
import { formatCurrency } from './utils/formatCurrency';
import { Products } from './types';
import {
    VM_STR_INSERT_COIN,
    VM_STR_POWERING_DOWN,
    VM_STR_VERSION,
    VM_STR_THANK_YOU,
    VM_STR_PRICE
} from './constants/vending-machine-strings';

export class VendingMachine {
    private machineOn: boolean;
    private state: States;
    private pendingTransactionTotal: number;
    private newPendingTransactionTotal: number;
    private productSelected: Products;
    private productSelectedWithInsufficientFunds: boolean;

    constructor(
        private displayAdapter: DisplayInterface,
        private currencyHandler: CurrencyHandler,
        private vendingHandler: VendingHandler,
        private systemAdapter: SystemInterface) {
            this.currencyHandler = currencyHandler;
            this.displayAdapter = displayAdapter;
            this.systemAdapter = systemAdapter;    
            this.machineOn = false;
            this.state =  States.POWER_DOWN;
            this.pendingTransactionTotal = 0;
            this.newPendingTransactionTotal = 0;
            this.productSelectedWithInsufficientFunds = false;
            this.productSelected = Products.NO_PRODUCT;
            this.start();
    }

    public async start() {
        while (!this.machineOn) {   
            if (this.systemAdapter.readSystemEvent() === SystemEvents.POWER_ON) {
                this.state = States.POWER_UP;
                this.machineOn =  true;
                this.start();
            }
            await delay(10);    
        }

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
                    this.newPendingTransactionTotal = this.currencyHandler.readPendingTransactionTotal();
                    if (this.newPendingTransactionTotal > this.pendingTransactionTotal || this.productSelectedWithInsufficientFunds) {
                        this.pendingTransactionTotal = this.newPendingTransactionTotal;
                        this.state = States.PENDING_TRANSACTION;
                        break;
                    }
                    
                    if (this.pendingTransactionTotal === 0) {
                        this.displayAdapter.output(VM_STR_INSERT_COIN);
                    }

                    this.productSelected = this.vendingHandler.readProductSelection();
                    if (this.productSelected != Products.NO_PRODUCT) {
                        this.state = States.PRODUCT_SELECTED;
                        break;
                    }
                break;

                case States.PENDING_TRANSACTION:
                    if (this.pendingTransactionTotal) {
                        this.displayAdapter.output(formatCurrency(this.pendingTransactionTotal));
                    }
                    this.productSelectedWithInsufficientFunds = false;
                    this.state = States.IDLE;  
                break;

                case States.PRODUCT_SELECTED:
                    if (this.pendingTransactionTotal >= this.vendingHandler.getProductPrice(this.productSelected)) {
                        this.vendingHandler.dispenseProduct(this.productSelected);
                        this.state = States.TRANSACTION_COMPLETE;
                        break;
                    }
                    this.state = States.INSUFFICIENT_FUNDS;         
                break;

                case States.TRANSACTION_COMPLETE:
                    this.displayAdapter.output(VM_STR_THANK_YOU);
                    await delay(1000);
                    this.pendingTransactionTotal = 0;
                    this.newPendingTransactionTotal = 0;
                    this.currencyHandler.resetPendingTransactionTotal();    
                    this.state = States.IDLE;
                break;

                case States.INSUFFICIENT_FUNDS:
                    this.displayAdapter.output(`${VM_STR_PRICE} ${formatCurrency(this.vendingHandler.getProductPrice(this.productSelected))}`);
                    await delay(1000);
                    this.productSelectedWithInsufficientFunds = true;
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
