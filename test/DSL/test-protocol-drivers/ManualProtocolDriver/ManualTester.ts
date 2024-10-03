import {MANUAL_TEST_TIMEOUT} from '../../constants';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompt = require('async-prompt');

export class ManualTester {
    public async instruct(instruction: string): Promise<void> {
        if (process.env.DOCUMENT) {
            console.log(`   INSTRUCTION: ${instruction} then press Enter`);
            return;
        }
        const myTimeout = setTimeout(timeoutError, MANUAL_TEST_TIMEOUT);
        await prompt(`   INSTRUCTION: ${instruction} then press Enter`);
        clearTimeout(myTimeout); 
    }

    public async queryYesNo(question: string): Promise<boolean> {
        if (process.env.DOCUMENT) {
            console.log(`   QUESTION: ${question}? [y,n] Yes=PASS No=FAIL`);
            return true;
        }

        let result = '';
        const myTimeout = setTimeout(timeoutError, MANUAL_TEST_TIMEOUT);

        do {
            result = await prompt(`   QUESTION: ${question}? [y,n] `);
            if (result === '') {
                result = ' ';
            }
            result = result.toLowerCase();
        } while (result !== 'y' && result !== 'n');

        clearTimeout(myTimeout);

        if (result === 'y') {
            return true;
        }
        return false;
    }
}

function timeoutError(): void {
    console.log('\n>>>>> Error: Timed out waiting for tester input <<<<<\n');
    process.exit(1);
}