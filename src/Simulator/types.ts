export enum Keys {
    NO_KEY = 'No_Key',
    ENTER = '\r',
    ESC = '\u001b',
    CTL_C = '\u0003',
    Q = 'q',
    D = 'd',
    N = 'n',
    P = 'p',
    S = 's',
    F = 'f',
    X = 'x'
}

export type KeyHandler = () => Promise<void>;

