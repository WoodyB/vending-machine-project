/* 
** Display Adapter for our simulator
*/
import { DisplayInterface } from '../interfaces'

export class DisplaySimulatorAdapter implements DisplayInterface{
    public output(str: string): void {
        console.log(str);
    } 
}    
