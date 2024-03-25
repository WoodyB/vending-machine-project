//import { Coins } from '../../src/types';
export interface KeyboardInterface {
    inputKeySequence(key: string): void;   
}

export interface TerminalInterface {
    output(str: string): void;
}

// export interface KeyHandlerInterface {
//     handleKey(): Coins;
//   }