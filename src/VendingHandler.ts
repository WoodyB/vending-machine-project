import { VendingMechanismProductSelectInterface } from './interfaces';
import { VendingMechanismProductDispenseInterface } from './interfaces';
import { Products } from './types';

export class VendingHandler {
    private productPricesMap: Record<Products, number> = {
        [Products.COLA]: 100,
        [Products.CANDY]: 65,
        [Products.CHIPS]: 50,
        [Products.NO_PRODUCT]: 0,
    };

    constructor(
        private vendingMechanismProductSelectAdapter: VendingMechanismProductSelectInterface,
        private vendingMechanismProductDispenseAdapter: VendingMechanismProductDispenseInterface
    ) {
        this.vendingMechanismProductSelectAdapter = vendingMechanismProductSelectAdapter;
        this.vendingMechanismProductDispenseAdapter = vendingMechanismProductDispenseAdapter;
    }

    public readProductSelection(): Products {
        return this.vendingMechanismProductSelectAdapter.readProductSelection();
    }

    public selectProduct(product: Products): void {
        this.vendingMechanismProductSelectAdapter.selectProduct(product);
    }
    
    public dispenseProduct(product: Products) {
        this.vendingMechanismProductDispenseAdapter.dispenseProduct(product);
    }

    public getProductPrice(product: Products): number {
        return this.productPricesMap[product];
    }
}