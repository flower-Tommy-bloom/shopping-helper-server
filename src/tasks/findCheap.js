// 子进程
const {fork} = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const sendEmail = require('./sendEmail')
let findCheap = async (id,price) => {
    const Goods = await mongoose.model("Goods")
    const script = resolve(__dirname + './../crawler/trailerGoods')
    const child = await fork(script)
    child.send({id,price})
    child.on('error', err => {
        console.log(err)
    })
    child.on('exit', code => {
        if(code === 999){
            console.log(code,'顺利退出进程')
        }
    })
    child.on('message', async (data) => {
        if(data.price == price){
            await Goods.update({id:id},{price:price}).exec()
            sendEmail('415157361@qq.com',`商品${data.name}已经降价到${data.price}噜`,'xxxxxxxxxxxx')
        }
    }) 
}

module.exports = findCheap