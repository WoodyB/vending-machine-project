import { VendingMechanismProductSelectInterface } from './interfaces';
import { VendingMechanismProductDispenseInterface } from './interfaces';
import { Products, States } from './types';

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
    
    public getProductPrice(product: Products): number {
        return this.productPricesMap[product];
    }

    public dispenseProduct(product: Products, pendingTransactionTotal: number): States {
        if ( pendingTransactionTotal >= this.getProductPrice(product)) {
            this.vendingMechanismProductDispenseAdapter.dispenseProduct(product);
            return(States.TRANSACTION_COMPLETE);
        }
    
        return States.INSUFFICIENT_FUNDS;
    }
}