import { TerminalInterface } from "../../../../src/Simulator/interfaces";
import { VM_STR_DISPLAY, VM_STR_ACTION } from "../../../../src/constants/vending-machine-strings";

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

    public clearDisplayMessages(): void {
      this.stringsDisplayed = this.stringsDisplayed.filter(
          (msg) => !msg.startsWith(VM_STR_DISPLAY)
      );
    }    

    public clearActionMessages(): void {
      this.stringsDisplayed = this.stringsDisplayed.filter(
        (msg) => !msg.startsWith(VM_STR_ACTION)
      );
    }

    public clearAllMessages(): void {
      this.stringsDisplayed = [];      
    }
}
