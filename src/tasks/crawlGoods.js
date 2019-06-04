// 子进程
const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')

const goodsList = ["100002979886", "7306981", "100002928171", "8443496", "100002288664", "7108222", "6072622", "100001521818", "100003150363", "7306975", "100005114598", "1555771170", "7382138", "100004995386", "100002892925", "100004364088", "1381544225", "8249434", "7019143", "6111324", "100005322602", "7306961", "100000769432", "100003383325", "100001956897", "100000305435", "100003052761", "5225346", "100002942749", "100005606316"]
let crawlGoods = async (id) => {
    const script = resolve(__dirname + './../crawler/trailerGoodsById')
    console.log('script', script)
    const child = await cp.fork(script, [])
    await child.send({ id })
    child.on('exit', code => {
        console.log(code, '退出进程')
    })
    return new Promise((resolve, reject) => {
        child.on('message', async (data) => {
            resolve(data)
        })
        child.on('error', err => {
            reject(err)
        })
    })

}
module.exports = crawlGoods