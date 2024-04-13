import { VendingMechanismProductSelectInterface } from "../interfaces";
import { Products } from "../types";

export class VendingMechanismProductSelectSimulatorAdapter implements VendingMechanismProductSelectInterface {
    private selectedProduct!: Products;

    constructor() {
        this.selectedProduct = Products.NO_PRODUCT;
    }

    public selectProduct(product: Products): void {
        this.selectedProduct = product;
    }

    public readProductSelection(): Products {
        const product = this.selectedProduct;
        this.selectedProduct = Products.NO_PRODUCT;
        return product;
    }
}