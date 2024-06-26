export enum Keys {
    NO_KEY = 'No_Key',
    ENTER = '\r',
    ESC = '\u001b',
    CTL_C = '\u0003',
    One = '1',
    Two = '2',
    Three = '3',
    Q = 'q',
    D = 'd',
    N = 'n',
    P = 'p',
    S = 's',
    F = 'f',
    X = 'x',
    A = 'a',
    B = 'b',
    C = 'c',
    H = 'h',
    R = 'r'
}

export type KeyHandler = () => Promise<void>;

