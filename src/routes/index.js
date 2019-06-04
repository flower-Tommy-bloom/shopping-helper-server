const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()
const crawlGoods = require('./../tasks/crawlGoods')
const { isArray } = require('./../util/tool')
router.post('/api/login', async (ctx, next) => {
    const User = mongoose.model('User')
    const { username, password } = ctx.request.body
    const isUser = await User.findOne({ username })
    if (isUser) {
        if (isUser.password === password) {
            ctx.body = {
                token: 'tokentokentokentokentoken',
                success: true,
                msg: '登录成功'
            }
        } else {
            ctx.body = {
                msg: '用户名或密码错误',
                success: false
            }
        }
    } else {
        ctx.body = {
            msg: '用户名或密码错误',
            success: false
        }
    }
})

router.get('/api/searchgoods', async (ctx, next) => {
    const { type, param = undefined  } = ctx.request.query
    const Goods = mongoose.model('Goods')
    let data
    switch (type) {
        case 'goodsId':
            data = await Goods.find({ goodsId: param })
            break;
        case 'isAttention':
            data = await Goods.find({ isAttention: true })
            break;
        case 'spoor':
            data = await Goods.find().limit(10).sort({ 'meta.updateAt':1 })
            break;
    }
    if (data && data.length != 0) {
        ctx.body = {
            msg: '查询成功',
            success: true,
            data: data
        }
    } else {
        let goodsdata = await crawlGoods(param)
        ctx.body = {
            msg: '查询成功',
            success: true,
            data: goodsdata
        }
        let goodslist = new Goods(goodsdata)
        goodslist.save()
    }
})

router.post('/api/attention', async (ctx, next) => {
    const Goods = mongoose.model('Goods')
    const { goodsId, isAttention, attentionPrice, buyOnly } = ctx.request.body
    if (!isAttention) {
        const res = await Goods.update({ goodsId: goodsId }, { isAttention: false }).exec()
        if (res) {
            ctx.body = {
                msg: '取消关注成功!!!',
                success: true
            }
        }
    } else {
        const res = await Goods.update({ goodsId: goodsId }, { isAttention: true, attentionPrice,buyOnly }).exec()
        if (res) {
            ctx.body = {
                msg: `关注成功!,价格降至${attentionPrice}将邮件通知您`,
                success: true
            }
        }
    }
})

module.exports = router