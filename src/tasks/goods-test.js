const puppeteer = require('puppeteer')
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})
let crawlGoods = async (param) => {
    let url = 'https://item.jd.com/' + param + '.html'
    console.log('Start visit the target page')
    console.log(url)
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage()

    await page.goto(url, {
        waitUntil: 'networkidle2'
    })

    await sleep(500)
    
    const result = await page.evaluate(() => {
        var $ = window.$
        let name = $('.parameter2 li') ? $('.parameter2 li')[0].innerHTML.substr(5) : '/'
        let price = $('.p-price .price').text() ? Number($('.p-price .price').text().replace(/\.00$/,'')) : 0
        let goodsImg = $('#spec-img').attr('src') || $('.preview img').attr('src')
        return {
            name,
            price,
            goodsImg:'http:'+goodsImg
        }
    })
    result.id = param
    return result
}
module.exports = crawlGoods