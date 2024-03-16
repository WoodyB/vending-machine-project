/* 
** Place Holder: For a real System Adapter
*/
import { SystemInterface } from '../interfaces'
import { systemEvents } from '../types';

export class SystemAdapter implements SystemInterface{
   
    public readSystemEvent(): systemEvents {
        throw new Error('Method not implemented.');
    }
    
}    

