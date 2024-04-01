import { TerminalInterface } from "../../../../src/Simulator/interfaces";

export class FakeTerminal implements TerminalInterface {
    private stringsDisplayed: string[];
  
    constructor() {
      this.stringsDisplayed = [];
    }

    public output(str: string): void {
      this.stringsDisplayed.push(str);
    }
    
    public getStringsDisplayed(): string[] {
        return this.stringsDisplayed;
    }
}
