import { appData } from "./app-data";
import { CoinMechanism } from './CoinMechanism';

enum states {
    POWER_UP = 0,
    IDLE = 1,
    POWER_DOWN = 2
}

export class VendingMachine {
    private machineOn: boolean;
    private state = states.POWER_UP;
    private pendingTransactionTotal: number;

    constructor(
        private display: (str: string) => void, private coinMechanism: CoinMechanism) {
        this.coinMechanism = coinMechanism;    
        this.machineOn = false;
        this.pendingTransactionTotal = 0;
    }

    public start() {
        this.machineOn = true;
        this.state = states.POWER_UP;
        this.display(`Vending Machine Project Version ${appData.version}`);

        while (this.machineOn) {
            switch (this.state) {

                case states.POWER_UP:
                    this.state = states.IDLE;
                break;
                
                case states.IDLE:
                    this.pendingTransactionTotal = this.coinMechanism.getPendingTransactionTotal();
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
        }
    }
}