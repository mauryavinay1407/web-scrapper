const puppeteer = require('puppeteer');
const { program } = require('commander');

program
    .version('1.0.0')
    .description('CLI-based Web Scraper using Puppeteer')
    .option('-u, --url <url>', 'URL to scrape')
    .option('-s, --selector <selector>', 'CSS selector to scrape')
    .parse(process.argv);

const options = program.opts();

if (!options.url || !options.selector) {
    (async () => {
        const chalk = (await import('chalk')).default;
        console.error(chalk.red('Error: URL and selector are required.'));
        process.exit(1);
    })();
} else {
    (async () => {
        const chalk = (await import('chalk')).default;
        try {
            const browser = await puppeteer.launch({
                headless:false
            });
            const page = await browser.newPage();
            await page.goto(options.url, { waitUntil: 'networkidle2' });

            await page.waitForSelector(options.selector, { timeout: 60000 });

            const result = await page.evaluate((selector) => {
                const elements = document.querySelectorAll(selector);
                return Array.from(elements).map(element => element.textContent.trim());
            }, options.selector);
         console.log(result);
            console.log(chalk.green(`Scraped Data: ${result.join(', ')}`));

            await browser.close();
        } catch (error) {
            console.error(chalk.red(`Error: ${error.message}`));
        }
    })();
}
