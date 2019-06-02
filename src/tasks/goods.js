// 子进程
const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')

let crawlGoods = (id) => {
    const script = resolve(__dirname + './../crawler/trailer-goods')
    console.log('script',script)
    const child = cp.fork(script, [])
    console.log('child',child)
    console.log(id)

    child.on('error', err => {
        console.log(err)
    })
    child.on('exit', code => {
        console.log(code,'退出进程')
    })

    child.on('message', async (data) => {
        const result = data.result
        const Goods = await mongoose.model("Goods")
        await Goods.update({doubanId:result},data).exec()
    }) 
}
module.exports = crawlGoods