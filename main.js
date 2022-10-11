
(async () => {
    const yargs  = require('yargs')
    const Scraper  = require('./utils/scraper')

    const argv = yargs(process.argv.slice(2))
    .command('start', 'start scrape',  async (_argv) => {
        const {url, browser, regexp} = _argv.argv

        if(!url) {
            throw new Error('[ERROR] --url needed')
        }

        const scr = new Scraper(url , {
            isBrowser: browser,
            regexp
        })

        scr.process()
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging'
    })
    .argv;
})()