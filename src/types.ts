export enum Coins {
    NO_COIN = 'NO_COIN',
    PENNY = 'PENNY',
    NICKEL = 'NICKEL',
    DIME = 'DIME',
    QUARTER = 'QUARTER',
    SLUG = 'SLUG',
    FOREIGN_COIN = 'FOREIGN_COIN'
}

export enum States {
    POWER_UP = 'POWER_UP',
    IDLE = 'IDLE',
    PENDING_TRANSACTION = 'PENDING_TRANSACTION',
    PRODUCT_SELECTED = 'PRODUCT_SELECTED',
    TRANSACTION_COMPLETE = 'TRANSACTION_COMPLETE',
    INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
    POWER_DOWN = 'POWER_DOWN',
    MAKE_CHANGE = 'MAKE_CHANGE',
    RETURN_COINS = 'RETURN_COINS',
    SOLD_OUT = 'SOLD_OUT'
}

export enum SystemEvents {
    POWER_DOWN = 'POWER_DOWN',
    POWER_ON = 'POWER_ON',
    NO_EVENT = 'NO_EVENT'
}

export enum Products {
    COLA = 'COLA',
    CHIPS = 'CHIPS',
    CANDY = 'CANDY',
    NO_PRODUCT = 'NO_PRODUCT'
}

export type PendingTotal = {changed: boolean, amount: number};
export type CoinsInventory = {quarters: number, dimes: number, nickels: number};