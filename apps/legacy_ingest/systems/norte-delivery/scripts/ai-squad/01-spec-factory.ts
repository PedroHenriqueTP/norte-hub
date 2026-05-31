import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './utils/logger';

const AGENT_NAME = 'SpecFactory';

export async function runSpecFactory() {
    Logger.section(AGENT_NAME);
    Logger.info(AGENT_NAME, 'Initiating Test Protocol...');

    const testResultsPath = path.join(process.cwd(), 'test-results.json');

    try {
        Logger.info(AGENT_NAME, 'Running tests (this might take a while)...');
        // Run tests and output JSON. Ignore exit code to process failures.
        try {
            execSync('npm test --prefix apps/api -- --json --outputFile=../../test-results.json', { stdio: 'pipe' });
            Logger.success(AGENT_NAME, 'All tests passed!');
        } catch (e) {
            Logger.warn(AGENT_NAME, 'Some tests failed. Analyzing results...');
        }

        if (fs.existsSync(testResultsPath)) {
            const results = JSON.parse(fs.readFileSync(testResultsPath, 'utf8'));

            if (results.numFailedTests > 0) {
                Logger.warn(AGENT_NAME, `Detected ${results.numFailedTests} failed tests.`);
                // Logic to patch simple mock errors would go here.
                // For this MVP, we will audit and list the failing test files.
                results.testResults.forEach((testSuite: any) => {
                    if (testSuite.status === 'failed') {
                        Logger.error(AGENT_NAME, `Failure in suite: ${path.basename(testSuite.name)}`);
                        testSuite.assertionResults.forEach((assertion: any) => {
                            if (assertion.status === 'failed') {
                                Logger.info(AGENT_NAME, `  - ${assertion.title}`);
                                // Logger.info(AGENT_NAME, `    msg: ${assertion.failureMessages[0].split('\n')[0]}`);
                            }
                        });
                    }
                });
            } else {
                Logger.success(AGENT_NAME, 'No failed tests found in report.');
            }

            // Cleanup
            fs.unlinkSync(testResultsPath);
        }

    } catch (e: any) {
        Logger.error(AGENT_NAME, 'Fatal Error during execution.', e.message);
    }
}

// Allow direct execution
if (require.main === module) {
    runSpecFactory();
}
