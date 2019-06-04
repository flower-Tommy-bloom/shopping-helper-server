const mongoose = require('mongoose')
const Schema = mongoose.Schema
const goodsSchema = new Schema({
    name: {
        type: String
    },
    goodsId: {
        unique: true,
        type: Number
    },
    price: {
        type: Number,
        default: 0
    },
    goodsImg: {
        type: String
    },
    isAttention: {
        type: Boolean,
        default: false
    },
    attentionPrice: {
        type: Number,
        default: 0
    },
    buyOnly:{
        type:Boolean,
        default:false
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

goodsSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})
goodsSchema.pre('find',async function (next) {
    const Goods = await mongoose.model("Goods")
    await Goods.update({goodsId:this._conditions.goodsId},{ $set: { "meta.updateAt" : Date.now() } }).exec()
    next()
})

mongoose.model('Goods', goodsSchema)
