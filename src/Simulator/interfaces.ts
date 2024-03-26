export interface KeyboardInterface {
    inputKeySequence(key: string): void;   
}

export interface TerminalInterface {
    output(str: string): void;
}
