/* 
** Place Holder: For a real Display Adapter
*/
import { DisplayInterface } from '../interfaces'

export class DisplayAdapter implements DisplayInterface{
    public output(str: string): void {
        throw new Error(`Method not implemented. Parameter ${str}`);
    } 
}    
