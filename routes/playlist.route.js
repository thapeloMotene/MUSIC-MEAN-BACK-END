
var router = require('express').Router();
var Playlist = require('../models/playlist.model');
var async = require('async');

router.get('/playlist/:id', (req,res,next)=>{
    Playlist.findOne({_id: req.params.id}, (err,playlist)=>{
        if (err){
            return res.json({"message": "playlist does not exist"});
        }else{
            return res.json(playlist);
        }
    });
})

router.get('/playlists/:owner',(req,res,next)=>{
    Playlist.find({owner: req.params.owner}, (err, playlist)=>{
            if (err) return next(err);
            res.json(playlist);
    });
});

router.post('/new-playlist', (req,res,next)=>{
var playlist = new Playlist();
playlist.owner = req.body.owner;
playlist.name = req.body.playlist;
playlist.description = req.body.description;

Playlist.findOne({name: req.body.playlist}, (err,existingPlaylist)=>{
    if (!existingPlaylist){
        playlist.save((err,play)=> {
            return res.json(play);
        });
    }
    else{
         return res.json({"message": "Playlist with that name already Exists"});
    }
});
});


router.post('/remove-playlist/:id',(req,res,next)=>{
    Playlist.findByIdAndRemove(req.params.id,(err,playlist)=>{
        if (err){
            return res.json({"message":"error deleting playlist"});
        }
        return res.json(playlist);
    })


});

router.post('/add-to-list',(req,res,next)=>{
    async.waterfall([
        (callback)=>{
            Playlist.findOne({_id: req.body.pid},(err,playlist)=>{
                    if (err){
                       return res.json({"message":"could not find playlist"}) ;
                    }else{
                        callback(null,playlist);
                    }
                })}
                    ,
                    (playlist)=>{
                            let obj = {
                                "name": req.body.name,
                                "artist": req.body.artist,
                                "track_url": req.body.url
                            }

                        playlist.tracks.push(obj);
                        playlist.save((err,playlist)=>{
                            if (err){
                                return res.json({"message": "error saving track to playlist"});
                            } else{
                                return res.json(playlist);
                            }
                        })
                    }
    ]);


});

router.post('/rem-track',(req,res,next)=>{
    
     async.waterfall([
        (callback)=>{
            Playlist.findOne({_id: req.body.id},(err,foundplaylist)=>{
                    if (err){
                       return res.json({"message":"could not find playlist"}) ;
                    }else{
                        callback(null,foundplaylist);
                    }
                })}
                      ,
                    (playlist)=>{
                        playlist.tracks.pull((req.body.track));
                       console.log('playlist',playlist);
                         playlist.save((err,pl)=>{
                            if (err){
                                return res.json({"message": "error removing track from playlist"});
                            } else{
                                return res.json(pl);
                            }
                        })
                    }
    ]);

});


module.exports = router;


