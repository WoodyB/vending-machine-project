import { VendingMechanismProductSelectSimulatorAdapter } from '../../src/VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter';
import { Products } from '../../src/types';

describe('VendingMechanismProductSelectSimulatorAdapter', () => {
    let vendingMechanismProductSelectSimulatorAdapter: VendingMechanismProductSelectSimulatorAdapter;

    beforeEach(() => {
        vendingMechanismProductSelectSimulatorAdapter = new VendingMechanismProductSelectSimulatorAdapter();
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
});
