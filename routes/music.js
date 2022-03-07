const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const Music = require('../models/Music')

//Get music
//Private Route
router.get('/', auth,(req, res)=> {
    Music.find({user: req.user.id})
        .then(songs => res.json(songs))
        .catch(err => console.log(err.message))
})

//Add music
//Private Route
router.post('/', [auth, [
    check('singer', 'Singer is required').not().isEmpty(),
    check('song', 'Song name is required').not().isEmpty(),
    check('singerImg', 'Singer image is required').not().isEmpty(),
    check('video', 'Video clip is required').not().isEmpty()
]],(req, res)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return res.json({errors: errors.array()});
    }
    const {singer, song, singerImage, video} = req.body
    const newMusic = new Music({
        singer,
        song,
        singerImage,
        video,
        user: req.user.id
    })

    newMusic.save()
        .then(song => res.json(song))
        .catch(err => console.log(err.message))
})

//Update music
//Private Route
router.put('/:id', auth,(req, res)=>{
    const { singer, song, singerImage, video } = req.body

    let musicFields = {}
    if(singer) musicFields.singer = singer
    if(song) musicFields.song = song
    if(singerImage) musicFields.singerImage = singerImage
    if(video) musicFields.video = video

    Music.findById(req.params.id)
        .then(music =>{
            if(!music){
                return res.json({msg: 'Music not found'})
            }else if(music.user.toString() !== req.user.id){
                res.json({msg: 'Not authorized'})
            }else{
                Music.findByIdAndUpdate(req.params.id, {$set: musicFields}, (err, data)=>{
                    res.json({msg: "Music Updated!"})
                })
            }
        })
        .catch(err => console.log(err.message))
})

//Delete music 
//Private Route
router.delete('/:id', auth,(req, res)=>{
    Music.findById(req.params.id)
        .then(music =>{
            if(!music){
                return res.json({msg: 'Music not found'})
            }else if(music.user.toString() !== req.user.id){
                res.json({msg: 'Noth authorized'})
            }else{
                Music.findByIdAndDelete(req.params.id, (err, data)=>{
                    res.json({msg: "Music Deleted!"})
                })
            }
        })
        .catch(err => console.log(err.message))
})


module.exports = router;