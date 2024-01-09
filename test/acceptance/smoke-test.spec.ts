import { fork } from 'child_process';

describe('Smoke Test Vending Machine', () => {
    it('Should display Hello world', async () => {
      const result = await runVendingMachine('./bin/index.js'); 
      expect(result).toBe('Hello world\n');
    });
});


async function runVendingMachine(scriptPath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let stdoutData = '';

    const child = fork(scriptPath, [], {
      stdio: 'pipe'});
      
      child.stdout!.on('data', (data) => {
        stdoutData = `${data}`;
      });
      child.on('exit', () => resolve(`${stdoutData}`));
      child.on('error', err => reject(`${err}`));
      child.stderr!.on('data', function(data) {
        reject(`${data}`);
      });
  });
}      



