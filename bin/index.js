"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendingMachine = void 0;
var VendingMachine = /** @class */ (function () {
    function VendingMachine(display) {
        this.display = display;
    }
    VendingMachine.prototype.start = function () {
        this.display('Hello world');
    };
    return VendingMachine;
}());
exports.VendingMachine = VendingMachine;
var vendingMachine = new VendingMachine(console.log);
vendingMachine.start();
