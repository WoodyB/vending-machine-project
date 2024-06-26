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
    VM_STR_PRICE,
    VM_STR_SOLD_OUT,
    VM_STR_EXACT_CHANGE_ONLY
} from './constants/vending-machine-strings';

export class VendingMachine {
    private machineOn: boolean;
    private state: States;
    private pendingTransactionTotal: number;
    private productSelected: Products;
    private productSelectedWithInsufficientFunds: boolean;

    constructor(
        private displayAdapter: DisplayInterface,
        private currencyHandler: CurrencyHandler,
        private vendingHandler: VendingHandler,
        private systemAdapter: SystemInterface) {
            this.machineOn = false;
            this.state =  States.POWER_DOWN;

            this.pendingTransactionTotal = 0;
            this.productSelectedWithInsufficientFunds = false;
            
            this.productSelected = Products.NO_PRODUCT;
            this.start();
    }

    public async start() {
        while (!this.machineOn) {   
            this.systemEventsAction();
            await delay(10);    
        }

        while (this.machineOn) {
            this.systemEventsAction();

            switch (this.state) {

                case States.POWER_UP:
                    this.powerUpAction();
                break;
                
                case States.IDLE:
                    this.idleAction(States.IDLE);
                break;

                case States.PENDING_TRANSACTION:
                    this.pendingTransactionAction();  
                break;

                case States.PRODUCT_SELECTED:
                    this.productSelectedAction();         
                break;

                case States.TRANSACTION_COMPLETE:
                    await this.transactionCompleteAction();
                break;

                case States.INSUFFICIENT_FUNDS:
                    await this.insufficientFundsAction();
                break;

                case States.MAKE_CHANGE:
                    this.makeChangeAction();
                break;

                case States.RETURN_COINS:
                    this.returnCoinsAction();
                break;

                case States.SOLD_OUT:
                    await this.soldOutAction();
                break;

                case States.EXACT_CHANGE_ONLY:
                    this.idleAction(States.EXACT_CHANGE_ONLY);
                break;

                case States.POWER_DOWN:
                    this.powerDownAction();
                break;                    
            }
            await delay(10);
        }
    }

    private powerUpAction(): void {
        this.displayAdapter.output(`${VM_STR_VERSION} ${appData.version}`);
        this.state = States.IDLE;
    }
    
    private idleAction(state: States): void {
        if (state === States.IDLE && this.currencyHandler.isConditionExactChangeOnly()) {
            this.state = States.EXACT_CHANGE_ONLY;
            return;            
        }
    
        const pendingTotal = this.currencyHandler.readPendingTransactionTotal();
        const returnCoinsStatus = this.currencyHandler.readReturnCoinsStatus();
        
        if (returnCoinsStatus === true) {
            this.state = States.RETURN_COINS;
            return;
        }

        this.pendingTransactionTotal = pendingTotal.amount;
        if ( pendingTotal.changed || this.productSelectedWithInsufficientFunds) {
            this.state = States.PENDING_TRANSACTION;
            return;
        }
        
        if (this.pendingTransactionTotal === 0 && state === States.IDLE) {
            this.displayAdapter.output(VM_STR_INSERT_COIN);
        }

        if (this.pendingTransactionTotal === 0 && state === States.EXACT_CHANGE_ONLY) {
            this.displayAdapter.output(VM_STR_EXACT_CHANGE_ONLY);
        }

        this.productSelected = this.vendingHandler.readProductSelection();
        if (this.productSelected != Products.NO_PRODUCT) {
            this.state = States.PRODUCT_SELECTED;
            return;
        }
    }

    private pendingTransactionAction(): void {
        if (this.pendingTransactionTotal) {
            this.displayAdapter.output(formatCurrency(this.pendingTransactionTotal));
        }
        this.productSelectedWithInsufficientFunds = false;
        this.state = States.IDLE;  
    }
    
    private productSelectedAction(): void {
        this.state = this.vendingHandler.dispenseProduct(this.productSelected, this.pendingTransactionTotal);         
    }

    private makeChangeAction(): void {
        this.state = States.TRANSACTION_COMPLETE;
        this.currencyHandler.dispenseChange(this.pendingTransactionTotal, this.vendingHandler.getProductPrice(this.productSelected));
    }

    private async transactionCompleteAction(): Promise<void> {
        this.displayAdapter.output(VM_STR_THANK_YOU);
        await delay(1000);
        this.pendingTransactionTotal = 0;
        this.currencyHandler.transactionCompleted();    
        this.state = States.IDLE;
    }

    private async insufficientFundsAction(): Promise<void> {
        this.displayAdapter.output(`${VM_STR_PRICE} ${formatCurrency(this.vendingHandler.getProductPrice(this.productSelected))}`);
        await delay(1000);
        this.productSelectedWithInsufficientFunds = true;
        this.state = States.IDLE;
    }

    private returnCoinsAction(): void {
        this.currencyHandler.returnPendingTransactionCoins();
        this.state = States.IDLE;
    }

    private async soldOutAction(): Promise<void> {
        this.displayAdapter.output(`${VM_STR_SOLD_OUT}`);
        await delay(1000);
        this.state = States.PENDING_TRANSACTION;
    }

    private powerDownAction(): void {
        this.displayAdapter.output(VM_STR_POWERING_DOWN);
        this.machineOn = false;
    }

    private systemEventsAction(): void {
        const event = this.systemAdapter.readSystemEvent();

        if (event === SystemEvents.POWER_DOWN) {
            this.state = States.POWER_DOWN;
        }

        if (event === SystemEvents.POWER_ON) {
            this.state = States.POWER_UP;
            this.machineOn =  true;
        }
    }
}
