/* 
** System Adapter for our simulator
*/
import { SystemInterface } from '../interfaces'
import { systemEvents } from '../types';

export class SystemSimulatorAdapter implements SystemInterface{
    private timesCalled: number;

    constructor() {
        this.timesCalled = 1;
      }

    public readSystemEvent(): systemEvents {
        this.timesCalled += 1;
        if (this.timesCalled > 100) {
            return systemEvents.POWER_DOWN;
        }
        return systemEvents.NO_EVENT;
    }
    
}    
