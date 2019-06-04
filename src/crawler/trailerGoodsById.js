const puppeteer = require('puppeteer')

process.on('message', (param) => {
    const id = param.id
    const url = 'https://item.jd.com/' + param.id + '.html'
    findNewPrice(id, url)
})
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

const findNewPrice = async (id, url) => {
    console.log(`goodsId:  ${id} is Updating data`)

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage()

    await page.goto(url, {
        waitUntil: 'networkidle2'
    })
    const result = await page.evaluate((id) => {
        var $ = window.$
        let name = $('.parameter2 li')[0].innerHTML.substr(5)
        let price = $('.p-price .price').text() ? Number($('.p-price .price').text()) : 0
        let goodsImg = $('#spec-img').attr('src')
        return {
            name,
            price,
            goodsImg
        }
    })
    result.goodsId = Number(id)
    browser.close()
    process.send(result)
    process.exit(999)
}
