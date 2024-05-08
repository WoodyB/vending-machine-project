import { VendingMechanismProductSelectInterface } from "../interfaces";
import { Products } from "../types";
import { Terminal } from "../Simulator/Terminal";
import { VM_STR_ACTION, VM_STR_PRODUCT_EMPTY_SWITCH_SET } from "../constants/vending-machine-strings";

export class VendingMechanismProductSelectSimulatorAdapter implements VendingMechanismProductSelectInterface {
    private selectedProduct!: Products;
    private outOfStock: Map<Products, boolean>;
    private terminal: Terminal;

    constructor(terminal: Terminal) {
        this.terminal = terminal;
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
        this.terminal.output(`${VM_STR_ACTION} ${product} ${VM_STR_PRODUCT_EMPTY_SWITCH_SET}`);
    }

    public readProductOutOfStockStatus(product: Products): boolean {
        if (this.outOfStock.get(product)) {
            return true;
        }
        return false;
    }
}