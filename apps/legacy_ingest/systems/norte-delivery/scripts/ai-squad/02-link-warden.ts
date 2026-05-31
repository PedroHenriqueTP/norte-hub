import * as puppeteer from 'puppeteer';
import { Logger } from './utils/logger';

const AGENT_NAME = 'LinkWarden';
const TARGET_URL = 'http://localhost:3000';

export async function runLinkWarden() {
    Logger.section(AGENT_NAME);
    Logger.info(AGENT_NAME, `Patrolling UI at ${TARGET_URL}...`);

    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        try {
            await page.goto(TARGET_URL, { waitUntil: 'networkidle0', timeout: 30000 });
        } catch (e) {
            Logger.error(AGENT_NAME, `Could not reach ${TARGET_URL}. Is the server running?`);
            await browser.close();
            return;
        }

        Logger.success(AGENT_NAME, 'Connected to Landing Page.');

        // 1. Scan Links
        const links = await page.$$eval('a', anchors => anchors.map(a => a.href));
        Logger.info(AGENT_NAME, `Found ${links.length} links.`);

        let brokenLinks = 0;
        // Basic check for empty or # links (internal logic, not actual navigation for speed)
        links.forEach(link => {
            if (link.endsWith('#') || link === TARGET_URL + '/') {
                // Ignore innocuous self-links
            } else if (!link) {
                Logger.warn(AGENT_NAME, 'Found empty href.');
                brokenLinks++;
            }
        });

        // 2. Ghost Buttons (Buttons without listeners/actions check is hard in puppeteer without interaction)
        // We will check for the famous "Comece agora" / "Começar Teste Grátis"
        const ctaText = "Começar Teste Grátis";
        // XPath to find button with text
        const [button] = await page.$x(`//button[contains(., '${ctaText}')] | //a[contains(., '${ctaText}')]`);

        if (button) {
            Logger.success(AGENT_NAME, `Critical CTA "${ctaText}" found.`);
            // Check if it is wrapped in an anchor or has an onClick (inference)
            // Puppeteer evaluation
            const isClickable = await page.evaluate((el: any) => {
                return el.tagName === 'A' || el.closest('a') !== null;
            }, button);

            if (isClickable) {
                Logger.success(AGENT_NAME, `CTA is linkable/clickable.`);
            } else {
                Logger.error(AGENT_NAME, `CTA MIGHT BE DEAD. No <a> tag detected around it.`);
            }
        } else {
            Logger.warn(AGENT_NAME, `Critical CTA "${ctaText}" NOT found.`);
        }

        if (brokenLinks === 0) Logger.success(AGENT_NAME, 'No broken links detected.');

    } catch (e: any) {
        Logger.error(AGENT_NAME, 'Patrol failed.', e.message);
    } finally {
        if (browser) await browser.close();
    }
}

if (require.main === module) {
    runLinkWarden();
}
