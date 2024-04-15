import { VendingMechanismProductDispenseSimulatorAdapter } from '../../src/VendingMechanismAdapters/VendingMechanismProductDispenseSimulatorAdapter';
import { TerminalInterface } from '../../src/Simulator/interfaces';
import { Products } from '../../src/types';
import { VM_STR_ACTION, VM_STR_PRODUCT_DISPENSED } from '../../src/constants/vending-machine-strings'

describe('VendingMechanismProductDispenseSimulatorAdapter', () => {
    let vendingMechanismProductDispenseSimulatorAdapter: VendingMechanismProductDispenseSimulatorAdapter;
    let terminalSpy: TerminalSpy;

    beforeEach(() => {
        terminalSpy = new TerminalSpy();
        vendingMechanismProductDispenseSimulatorAdapter = new VendingMechanismProductDispenseSimulatorAdapter(terminalSpy);
    });
    
    it(`Method dispenseProduct() should dispense ${Products.COLA} correctly`, () => {
        vendingMechanismProductDispenseSimulatorAdapter.dispenseProduct(Products.COLA);
        expect(terminalSpy.getStringsDisplayed()).toBe(`${VM_STR_ACTION} ${Products.COLA} ${VM_STR_PRODUCT_DISPENSED}`);
    });

    it(`Method dispenseProduct() should dispense ${Products.CANDY} correctly`, () => {
        vendingMechanismProductDispenseSimulatorAdapter.dispenseProduct(Products.CANDY);
        expect(terminalSpy.getStringsDisplayed()).toBe(`${VM_STR_ACTION} ${Products.CANDY} ${VM_STR_PRODUCT_DISPENSED}`);
    });

    it(`Method dispenseProduct() should dispense ${Products.CHIPS} correctly`, () => {
        vendingMechanismProductDispenseSimulatorAdapter.dispenseProduct(Products.CHIPS);
        expect(terminalSpy.getStringsDisplayed()).toBe(`${VM_STR_ACTION} ${Products.CHIPS} ${VM_STR_PRODUCT_DISPENSED}`);
    });

    it(`Method dispenseProduct() should not dispense ${Products.NO_PRODUCT} correctly`, () => {
        vendingMechanismProductDispenseSimulatorAdapter.dispenseProduct(Products.NO_PRODUCT);
        expect(terminalSpy.getStringsDisplayed()).toBe('');
    });
});

class TerminalSpy implements TerminalInterface {
    private stringsDisplayed: string;
  
    constructor() {
      this.stringsDisplayed = '';
    }

    public output(str: string): void {
      this.stringsDisplayed = str;
    }
    
    public getStringsDisplayed(): string {
        return this.stringsDisplayed;
    }
}
