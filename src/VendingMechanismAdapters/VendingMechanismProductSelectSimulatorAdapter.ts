import { VendingMechanismProductSelectInterface } from "../interfaces";
import { Products } from "../types";

export class VendingMechanismProductSelectSimulatorAdapter implements VendingMechanismProductSelectInterface {
    private selectedProduct!: Products;
    private outOfStock: Map<Products, boolean>;
   

    constructor() {
        this.selectedProduct = Products.NO_PRODUCT;
        this.outOfStock = new Map<Products, boolean>();
        this.outOfStock.set(Products.COLA, false);
        this.outOfStock.set(Products.CANDY, false);
        this.outOfStock.set(Products.CHIPS, false);  
    }

    public selectProduct(product: Products): void {
        this.selectedProduct = product;
    }

    public readProductSelection(): Products {
        const product = this.selectedProduct;
        this.selectedProduct = Products.NO_PRODUCT;
        return product;
    }

    public setProductOutOfStockStatus(product: Products): void {
        this.outOfStock.set(product, true);
    }

    public readProductOutOfStockStatus(product: Products): boolean {
        if (this.outOfStock.get(product)) {
            return true;
        }
        return false;
    }
}