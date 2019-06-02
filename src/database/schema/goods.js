const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {Mixed} = Schema.Types
const goodsSchema = new Schema({
    name: {
        type: String
    },
    id: {
        unique: true,
        type: Number
    },
    price: {
        type: Number
    },
    goodsImg: {
        type: String
    },
    isAttention: {
        type:Boolean,
        default:false
    },
    attentionPrice: {
        type:Number
    },
    meta: {
        createdAt: {
            type: Date,
            default:Date.now()
        },
        updateAt: {
            type: Date,
            default:Date.now()
        }
    }
})

goodsSchema.pre('save', function(next){
    if(this.isNew) {
        this.meta.createdAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('Goods', goodsSchema)
