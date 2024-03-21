/* 
** System Adapter for our simulator
*/
import { SystemInterface } from '../interfaces'
import { SystemEvents } from '../types';

export class SystemSimulatorAdapter implements SystemInterface{
    private timesCalled: number;

    constructor() {
        this.timesCalled = 1;
      }

    public readSystemEvent(): SystemEvents {
        this.timesCalled += 1;
        if (this.timesCalled > 100) {
            return SystemEvents.POWER_DOWN;
        }
        return SystemEvents.NO_EVENT;
    }
    
}    
