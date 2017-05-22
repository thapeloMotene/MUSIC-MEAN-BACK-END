var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayListSchema = new Schema({
    "owner": {type: Schema.Types.ObjectId , ref: 'User'},
    "name": String,
    "description": String,
    "date_created":{type: String, default: Date.now},
    "tracks": [{
        "name": String,
        "artist": String,
        "track_url":String
    }]
});
module.exports = mongoose.model('Playlist',PlayListSchema);