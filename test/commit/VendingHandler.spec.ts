import { VendingHandler } from '../../src/VendingHandler';
import { TerminalInterface } from '../../src/Simulator/interfaces';
import { VendingMechanismProductSelectSimulatorAdapter } from '../../src/VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter';
import { VendingMechanismProductDispenseSimulatorAdapter } from '../../src/VendingMechanismAdapters/VendingMechanismProductDispenseSimulatorAdapter';
import { Products } from '../../src/types';
import { VM_STR_ACTION, VM_STR_PRODUCT_DISPENSED } from '../../src/constants/vending-machine-strings';

describe('VendingHandler', () => {
    let vendingHandler!: VendingHandler;
    let vendingMechanismProductSelectSimulatorAdapter!: VendingMechanismProductSelectSimulatorAdapter;
    let vendingMechanismProductDispenseSimulatorAdapter!: VendingMechanismProductDispenseSimulatorAdapter;
    let terminalSpy!: TerminalSpy;
 
    beforeEach(() => {
        terminalSpy = new TerminalSpy();
        vendingMechanismProductSelectSimulatorAdapter = new VendingMechanismProductSelectSimulatorAdapter();
        vendingMechanismProductDispenseSimulatorAdapter = new VendingMechanismProductDispenseSimulatorAdapter(terminalSpy);
        vendingHandler = new VendingHandler(vendingMechanismProductSelectSimulatorAdapter, vendingMechanismProductDispenseSimulatorAdapter);
    });
    
    
    it('Method readProductSelection() should return NO_PRODUCT if no product has been selected', () => {
        const product = vendingHandler.readProductSelection();
        expect(product).toBe(Products.NO_PRODUCT);
    });

    it('Method readProductSelection() should return COLA if COLA has been selected', () => {
        vendingHandler.selectProduct(Products.COLA);
        const product = vendingHandler.readProductSelection();
        expect(product).toBe(Products.COLA);
    });

    it(`Method dispenseProduct() should dispense ${Products.CANDY} correctly`, () => {
        vendingHandler.dispenseProduct(Products.CANDY);
        expect(terminalSpy.getStringsDisplayed()).toBe(`${VM_STR_ACTION} ${Products.CANDY} ${VM_STR_PRODUCT_DISPENSED}`);
    });

    it(`Method getProductPrice() should return 100 for ${Products.COLA}`, () => {
        const price = vendingHandler.getProductPrice(Products.COLA);
        expect(price).toBe(100);
    });

    it(`Method getProductPrice() should return 65 for ${Products.CANDY}`, () => {
        const price = vendingHandler.getProductPrice(Products.CANDY);
        expect(price).toBe(65);
    });

    it(`Method getProductPrice() should return 50 for ${Products.CHIPS}`, () => {
        const price = vendingHandler.getProductPrice(Products.CHIPS);
        expect(price).toBe(50);
    });

    it(`Method getProductPrice() should return 0 for ${Products.NO_PRODUCT}`, () => {
        const price = vendingHandler.getProductPrice(Products.NO_PRODUCT);
        expect(price).toBe(0);
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
