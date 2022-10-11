const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio')
const RETRY = 3

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchHtml = async (url, count = 0) => {
    try {
        const browser = await puppeteer.launch();
        const [page] = await browser.pages();
        await page.goto(url, { waitUntil: 'networkidle0' });
        const html = await page.evaluate(() => document.querySelector('*').outerHTML);
        await browser.close()
        return html
    }
    catch (e) {
        if (count <=RETRY) {
            console.log(`[ERROR] fetchHtml, browser failed x${count}. ${url}`)
            await sleep(3000)
            return fetchHtml(url, count+1)
        }

        throw new Error(e)
    }
}

const fetchHtmlAxios = async (url, count= 0 ) => {
    try {
        const res = await axios.get(url)
        return res.data
    }
    catch (e) {
        if (count <=RETRY) {
            console.log(`[ERROR] fetchHtml, browser failed x${count}. ${url}`)
            await sleep(3000)
            return fetchHtml(url, count+1)
        }

        throw new Error(e)
    }
}

const extraxtLinksFromHtml = async (html) => {
  $ = cheerio.load(html);
  links = $('a'); //jquery get all hyperlinks
  const _result = []
  $(links).each(function(i, link){
    _result.push($(link).attr('href'))
  });

  const result = _result.filter(url => url)
  return [...new Set(result)]
}

const extraxtInternalLinksFromHtml = async (html, url) => {
    const links = await extraxtLinksFromHtml(html)

    const urlObject = new URL(url);

    const linkStartWithSameOrigin = links.filter(url => {
        return url[0] === '/'
    }).map(url => {
        return `${urlObject.origin}${url}`
    })

    const linkWithSameOrigin = links.filter(url => {
        return url.includes(urlObject.host)
    }).filter( _url => {
        const urlObjectTemp = new URL(_url)
        return urlObject.host === urlObjectTemp.host
    })

    return [
        ...linkStartWithSameOrigin,
        ...linkWithSameOrigin
    ]
}

module.exports = {
    fetchHtml,
    fetchHtmlAxios,
    extraxtLinksFromHtml,
    extraxtInternalLinksFromHtml,
}