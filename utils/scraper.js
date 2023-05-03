const browserHtml = require('./browserHtml')
const Dictionary = require('./dictionary')
const strUtil = require('./string')

const stateMachineConfig = (sourceUrl, config = {}) => {
    const isBrowser = config.isBrowser
    const regexp = config.regexp
    const dicTodo = new Dictionary(`./${strUtil.onlyDigitChar(sourceUrl)}-todo.txt`)
    const dicDone = new Dictionary(`./${strUtil.onlyDigitChar(sourceUrl)}-done.txt`)
    dicTodo.init()
    dicDone.init()
    return {
        start: (url) => {
            console.log('[STATE] start, ',url)
            return {
                next: 'checkTodoDone',
                value: url
            }
        },
        summary: () => {
            const doneListUrl = dicDone.readLineAsArray()

            console.log('[STATE] summary, found links: ',doneListUrl.length)
            console.log('[STATE] summary, open file: ', dicDone.path)
            dicTodo.deleteFile()

            return {
                next: 'done',
                value: doneListUrl.length
            }
        },
        scrapeSingleUrl: async (url) => {
            console.log('[STATE] scrapeSingleUrl, ',url)
    
            const fetcher = isBrowser? browserHtml.fetchHtml : browserHtml.fetchHtmlAxios
            
            const html = await fetcher(url)
            const _links = await browserHtml.extraxtInternalLinksFromHtml(html, url)
            const links =regexp
            ? _links.filter(item => {
                const pattern = new RegExp(regexp);
                return pattern.test(item)
            })
            : _links

            //1) move todo done
            dicTodo.deleteLineByString(url)
            dicDone.appendLine(url)
    
            //2) append new url to todo
            const todoListUrl = dicTodo.readLineAsArray()
            const doneListUrl = dicDone.readLineAsArray()
            const totleListUrl = [...new Set([...todoListUrl, ...doneListUrl])]
    
            let count = 0
            for(let i=0;i<=links.length;i++){ 
                const newUrl = links[i]
                if(newUrl && !totleListUrl.includes(newUrl)) {
                    dicTodo.appendLine(newUrl)
                    count +=1
                }
            }
            console.log('[STATE] scrapeSingleUrl, found new links: ',count,'/(',count,'+',todoListUrl.length,'+',doneListUrl.length,')')

    
            //3) extract the 1st url from todo
            const nextUrl = todoListUrl[0] || links[0]
            if(!nextUrl) {
                return {
                    next: 'summary',
                }
            }
            return {
                next: 'start',
                value: nextUrl
            }
        },
        checkTodoDone: (url) => {
            console.log('[STATE] checkTodoDone, ',url)
    
            const isFoundInTodo = dicTodo.search(url).length >=1
            const isFoundInDone = dicDone.search(url).length >=1
    
            //1- not done, not todo
            if(!isFoundInDone && !isFoundInTodo) {
                dicTodo.appendLine(url)
                return {
                    next: 'start',
                    value: url
                }
            }
    
            //2- not done, in todo
            if(!isFoundInDone && isFoundInTodo) {
                return {
                    next: 'scrapeSingleUrl',
                    value: url
                }
            }

            //3- done , --
            if(isFoundInDone) {
                const todoListUrl = dicTodo.readLineAsArray()
                const nextUrl = todoListUrl[0]

                if(!nextUrl) {
                    return {
                        next: 'summary',
                    }
                }

                return {
                    next: 'start',
                    value: nextUrl
                }
            }
    
            return {
                next: 'summary',
            }
        }
    }
}





class StateMachine {
    constructor(url, config = {}) {
        this.state = 'start'
        this.param = url
        this.sourceUrl = url
        this.SM = stateMachineConfig(this.sourceUrl, config)
    }
    async process() {
        const {state, param, SM} = this
        const {next, value} = await SM[state](param)
        return this.next(next, value)
    }
    async next(nextState, nextParam){
        this.state = nextState
        this.param = nextParam

        if(nextState === 'done') {
            return
        }

        return await this.process()
    }
}

module.exports = StateMachine