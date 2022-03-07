const mongoose = require('mongoose')

const MusicSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    singer:{
        type: String,
        required: true
    },
    song:{
        type: String,
        required: true
    },
    singerImage:{
        type: String,
        required: true
    },
    video:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('music', MusicSchema)