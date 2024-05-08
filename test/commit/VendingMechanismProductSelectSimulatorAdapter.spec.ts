import { VendingMechanismProductSelectSimulatorAdapter } from '../../src/VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter';
import { Products } from '../../src/types';
import { TerminalInterface } from '../../src/Simulator/interfaces';
import {
    VM_STR_ACTION,
    VM_STR_PRODUCT_EMPTY_SWITCH_SET
} from '../../src/constants/vending-machine-strings';

let terminalOutput: string[] = [];

describe('VendingMechanismProductSelectSimulatorAdapter', () => {
    let vendingMechanismProductSelectSimulatorAdapter: VendingMechanismProductSelectSimulatorAdapter;
    let terminalSpy: TerminalSpy;

    beforeEach(() => {
        terminalSpy = new TerminalSpy();
        vendingMechanismProductSelectSimulatorAdapter = new VendingMechanismProductSelectSimulatorAdapter(terminalSpy);
      });

      afterEach(() => {
        terminalOutput = [];
    });

    
    it('Method readProductSelection() should return NO_PRODUCT if no product has been selected', () => {
        const product = vendingMechanismProductSelectSimulatorAdapter.readProductSelection();
        expect(product).toBe(Products.NO_PRODUCT);
    });

    it('Method readProductSelection() should return COLA if COLA has been selected', () => {
        vendingMechanismProductSelectSimulatorAdapter.selectProduct(Products.COLA);
        const product = vendingMechanismProductSelectSimulatorAdapter.readProductSelection();
        expect(product).toBe(Products.COLA);
    });

    it('Method readProductSelection() should return CANDY if CANDY has been selected', () => {
        vendingMechanismProductSelectSimulatorAdapter.selectProduct(Products.CANDY);
        const product = vendingMechanismProductSelectSimulatorAdapter.readProductSelection();
        expect(product).toBe(Products.CANDY);
    });

    it('Method readProductSelection() should return CHIPS if CHIPS has been selected', () => {
        vendingMechanismProductSelectSimulatorAdapter.selectProduct(Products.CHIPS);
        const product = vendingMechanismProductSelectSimulatorAdapter.readProductSelection();
        expect(product).toBe(Products.CHIPS);
    });

    it('Method readProductSelection() should return NO_PRODUCT on second call after CANDY has been selected (destructive read)', () => {
        vendingMechanismProductSelectSimulatorAdapter.selectProduct(Products.CANDY);
        let product = vendingMechanismProductSelectSimulatorAdapter.readProductSelection();
        expect(product).toBe(Products.CANDY);
        product = vendingMechanismProductSelectSimulatorAdapter.readProductSelection();
        expect(product).toBe(Products.NO_PRODUCT);
    });

    it('Method setProductOutOfStockStatus(Products.COLA) should set product out of stock status to true', () => {
        vendingMechanismProductSelectSimulatorAdapter.setProductOutOfStockStatus(Products.COLA);
        const productStatus = vendingMechanismProductSelectSimulatorAdapter.readProductOutOfStockStatus(Products.COLA);
        expect(productStatus).toBe(true);
    });

    it('Method setProductOutOfStockStatus(Products.COLA) should report that out of stock status has been set', () => {
        vendingMechanismProductSelectSimulatorAdapter.setProductOutOfStockStatus(Products.COLA);
        expect(terminalOutput[0]).toContain(`${VM_STR_ACTION} ${Products.COLA} ${VM_STR_PRODUCT_EMPTY_SWITCH_SET}`);
    });

    it('Method setProductOutOfStockStatus(Products.CANDY) should set product out of stock status to true', () => {
        vendingMechanismProductSelectSimulatorAdapter.setProductOutOfStockStatus(Products.CANDY);
        const productStatus = vendingMechanismProductSelectSimulatorAdapter.readProductOutOfStockStatus(Products.CANDY);
        expect(productStatus).toBe(true);
    });

    it('Method setProductOutOfStockStatus(Products.CANDY) should report that out of stock status has been set', () => {
        vendingMechanismProductSelectSimulatorAdapter.setProductOutOfStockStatus(Products.CANDY);
        expect(terminalOutput[0]).toContain(`${VM_STR_ACTION} ${Products.CANDY} ${VM_STR_PRODUCT_EMPTY_SWITCH_SET}`);
    });

    it('Method setProductOutOfStockStatus(Products.CHIPS) should set product out of stock status to true', () => {
        vendingMechanismProductSelectSimulatorAdapter.setProductOutOfStockStatus(Products.CHIPS);
        const productStatus = vendingMechanismProductSelectSimulatorAdapter.readProductOutOfStockStatus(Products.CHIPS);
        expect(productStatus).toBe(true);
    });

    it('Method setProductOutOfStockStatus(Products.CHIPS) should report that out of stock status has been set', () => {
        vendingMechanismProductSelectSimulatorAdapter.setProductOutOfStockStatus(Products.CHIPS);
        expect(terminalOutput[0]).toContain(`${VM_STR_ACTION} ${Products.CHIPS} ${VM_STR_PRODUCT_EMPTY_SWITCH_SET}`);
    });
});

class TerminalSpy implements TerminalInterface {
    output(str: string): void {
      terminalOutput.push(str);
    }
}
