export enum coins {
    NO_COIN = 0,
    PENNY = 1,
    NICKEL = 2,
    DIME = 3,
    QUARTER = 4
}

export type CoinType = {
    name: coins;
    value: number;
};

export enum states {
    POWER_UP = 0,
    IDLE = 1,
    POWER_DOWN = 2
}

export enum systemEvents {
    POWER_DOWN = 0,
    POWER_ON = 1,
    NO_EVENT = 2
}

