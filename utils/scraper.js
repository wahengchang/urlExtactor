const browserHtml = require('./browserHtml')
const Dictionary = require('./dictionary')
const strUtil = require('./string')

class Scraper {
    constructor(url, config = {}) {
        this.url = url
        this.isBrowser = config.isBrowser
        this.regexp = config.regexp
        this.dicResultFetch = new Dictionary(`./dicResultFetch-${strUtil.onlyDigitChar(url)}.txt`)
    }

    async process () {
        const {url, isBrowser, dicResultFetch, regexp} = this
    
        console.log('process: ', url)
    
        const fetcher = isBrowser? browserHtml.fetchHtml : browserHtml.fetchHtmlAxios
    
        dicResultFetch.init()
    
        let nextUniqueUrlList = [url]
    
        while(true) {
            const preUrlList = [...nextUniqueUrlList]
            nextUniqueUrlList = await this.processLoopUrl(fetcher, preUrlList)

            console.log('nextUniqueUrlList: ', nextUniqueUrlList)


            for(let i=0;i<preUrlList.length;i++) {
                const url = preUrlList[i]

                if(dicResultFetch.search(url).length <=0) {
                    dicResultFetch.appendLine(url)
                }
            }

            if(nextUniqueUrlList && nextUniqueUrlList.length <=0) {
                return
            }
        }
    }

    async processLoopUrl(fetcher, preUrlList) {        
        let nextUniqueUrlList = []

        for(let i=0;i<preUrlList.length;i++) {
            const url = preUrlList[i]
    
            const nextUrlList = await this.processSingleUrl(fetcher, url) 
            nextUniqueUrlList = [...new Set([...nextUniqueUrlList, ...nextUrlList])]
        }
    
        return [...nextUniqueUrlList]
    }

    async processSingleUrl(fetcher, url) {
        console.log('processSingleUrl: ', url)
        const {dicResultFetch, regexp} = this    

        const html = await fetcher(url)

        const links = await browserHtml.extraxtInternalLinksFromHtml(html, url)

        const discoveryNewLinks = regexp
        ? links.filter(item => {
            const pattern = new RegExp("/learn/");
            return pattern.test(item)
        })
        : links
       
        const nextUniqueUrlList = []

        discoveryNewLinks.forEach(url => {
            if(dicResultFetch.search(url).length <=0) {
                nextUniqueUrlList.push(url)
            }
        })

        return nextUniqueUrlList
    }

}

module.exports = Scraper