
(async () => {
    const yargs  = require('yargs')
    const Scraper  = require('./utils/scraper')

    const argv = yargs(process.argv.slice(2))
    .command('start', 'start scrape',  async (_argv) => {
        const {url, browser, regexp, v = false} = _argv.argv

        if(!url) {
            throw new Error('[ERROR] --url needed')
        }

        const scr = new Scraper(url , {
            isBrowser: browser,
            regexp,
            isLog: v
        })

        scr.process()
    })
    .option('url', {
      type: 'string',
      description: 'The url of the page that is going to scrape'
    })
    .option('regexp', {
      type: 'string',
      description: 'The regular expression that all the links should match'
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging'
    })
    .argv;
})()