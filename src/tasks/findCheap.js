const sendEmail = require('./sendEmail')
// 子进程
const { fork } = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')

;(async () => {
    let findCheap = async (id, price,buyOnly) => {
        console.log(`goodsId ${id} is findCheap`);
        child.send({ id })
        child.on('exit', code => {
            if (code === 999) {
                console.log(code, '顺利退出进程')
            }
        })
        return new Promise((resolve,reject) => {
            child.on('message', async (data) => {
                if(buyOnly){
                    if (data.price < price) {
                     Goods.update({ goodsId: id }, { price: price }).exec()
                        sendEmail('415157361@qq.com', `商品${data.name}已经降价到${data.price}噜`, data.goodsImg)
                    }
                }else{
                    console.log('还没计算');
                }
                resolve('ok')
            })
            child.on('error', err => {
                console.log(err)
                reject('fail')
            })
        })
    }

    const script = resolve(__dirname + './../crawler/findCheaptool')
    const child = fork(script)
    const Goods = await mongoose.model("Goods")
    let attentionData = await Goods.find({ isAttention: true })

    attentionData.forEach(async v => {
        await findCheap(v.goodsId,v.price,v.buyOnly)
    })

    // setInterval(() => {
    //     attentionData.forEach(async v => {
    //         await findCheap(v.goodsId,v.price,v.buyOnly)
    //     })
    // }, 3600000 );
})()
