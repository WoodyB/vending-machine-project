import { Simulator } from '../../../../src/Simulator/Simulator'
export class SimulatedKeyboardInputHandler {
    constructor(private simulator: Simulator) {}
  
    simulateKeyPress(str: string): Promise<string> {
      return new Promise(resolve => {
        this.simulator.handleKeyPress(str, { sequence: str, name: str, ctrl: false, meta:false, shift:false });
        resolve(str);
      });
    }
  }
