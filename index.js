const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async (event, context) => {
    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        let page = await browser.newPage();
        if(event.url) {
            await page.goto(event.url);
            const result = event.options ? await page.pdf(event.options) : await page.pdf();
            return context.succeed(result);
        } else if(event.html) {
            await page.setContent(event.html);
            const result = event.options ? await page.pdf(event.options) : await page.pdf();
            return context.succeed(result);
        } else {
            return context.fail(Error("event.url or event.html is required"));
        }
    } catch (error) {
        return context.fail(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};
module.exports = exports.handler;