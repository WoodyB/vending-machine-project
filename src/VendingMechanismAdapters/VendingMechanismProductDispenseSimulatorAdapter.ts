import { VendingMechanismProductDispenseInterface } from '../interfaces';
import { Terminal } from '../Simulator/Terminal';
import { VM_STR_ACTION, VM_STR_PRODUCT_DISPENSED } from '../constants/vending-machine-strings';
import { Products } from '../types';

export class VendingMechanismProductDispenseSimulatorAdapter implements VendingMechanismProductDispenseInterface{
    constructor(private terminal: Terminal) {
        this.terminal = terminal;
    }

    public dispenseProduct(product: Products): void {
        if (product === Products.NO_PRODUCT) {
            return;
        }
        this.terminal.output(`${VM_STR_ACTION} ${product} ${VM_STR_PRODUCT_DISPENSED}`);
    }
}    
