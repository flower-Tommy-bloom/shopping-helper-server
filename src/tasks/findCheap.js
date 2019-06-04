const sendEmail = require('./sendEmail')
// 子进程
const { fork } = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')

; (async () => {
    let findCheap = async (id, price, buyOnly) => {
        console.log(`goodsId ${id} is findCheap`);
        child.send({ id, originPrice:price, buyOnly })
        child.on('exit', code => {
            if (code === 999) {
                console.log(code, '顺利退出进程')
            }
        })
        child.on('error', err => {
            console.log(err)
            reject('fail')
        })
        child.on('message', async (data) => {
            console.log(`商品${data.goodsId}:原价${data.originPrice},现价${data.price}`)
            if (data.buyOnly) {
                if (data.price < data.originPrice) {
                    await Goods.update({ goodsId: data.goodsId }, { price: data.price, isAttention: false }).exec()
                    sendEmail('415157361@qq.com', `商品${data.name}已经降价到${data.price}噜`, `购买地址:${data.url}`)
                }else{
                    console.log('没有降价')
                }
            }else{
                console.log('价格计算功能待更新')
            }
        })
    }

    const script = resolve(__dirname + './../crawler/findCheaptool')
    const child = fork(script)
    const Goods = mongoose.model("Goods")
    setInterval(async()=>{
        let attentionData = await Goods.find({ isAttention: true })
        if(attentionData.length > 0){
            for (let i in attentionData) {
                const v = attentionData[i]
                findCheap(v.goodsId, v.price, v.buyOnly)
            }
        }
    },60000)

    // setInterval(() => {
    //     attentionData.forEach(async v => {
    //         await findCheap(v.goodsId,v.price,v.buyOnly)
    //     })
    // }, 3600000 );
})()
