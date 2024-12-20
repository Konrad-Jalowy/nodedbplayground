const express = require('express');

const app = express();
var ObjectId = require('mongoose').Types.ObjectId;
const User = require("./models/userModel");
const Room = require("./models/roomModel");
const Address = require("./models/addressModel");
const Person = require("./models/personModel");
const checkID = async (req, res, next, val) => {

    if(!ObjectId.isValid(val))
        return res.status(404).json({"err": "invalid id"});
    
    let _user = await User.findOne({_id: val});

    if (_user === null) 
      return res.status(404).json({"err": "invalid id"});
    
    next();
  };

  const checkRoomID = async (req, res, next, val) => {

    if(!ObjectId.isValid(val))
        return res.status(404).json({"err": "invalid id"});
    
    let _room = await Room.findOne({_id: val});

    if (_room === null) 
      return res.status(404).json({"err": "invalid id"});
    
    next();
  };

  const checkPersonID = async (req, res, next, val) => {

    if(!ObjectId.isValid(val))
        return res.status(404).json({"err": "invalid id"});
    
    let _person = await Person.findOne({_id: val});

    if (_person === null) 
      return res.status(404).json({"err": "invalid id"});
    
    next();
  };

  const checkAddrID = async (req, res, next, val) => {

    if(!ObjectId.isValid(val))
        return res.status(404).json({"err": "invalid id"});
    
    let _addr = await Address.findOne({_id: val});

    if (_addr === null) 
      return res.status(404).json({"err": "invalid id"});
    
    next();
  };

app.use(express.json());
app.param('id', checkID);
app.param('roomID', checkRoomID);
app.param('personID', checkPersonID);
app.param('addrID', checkAddrID);
app.get('/', (req, res) => {
  res.json({"msg": "hello world"})
});

app.get("/users/all", async (req, res) => {
    let _users = await User.find({});
    return res.json({"users": _users});
});

app.get("/rooms/all", async (req, res) => {
    let _rooms = await Room.find({});
    return res.json({"rooms": _rooms});
});

app.get("/addr/all", async (req, res) => {
    let _addrs = await Address.find({});
    return res.json({"Addresses": _addrs});
});
app.get("/ppl/all", async (req, res) => {
    let _ppl = await Person.find({});
    return res.json({"People": _ppl});
});

app.get("/ppl/bucketauto", async (req, res) => {
    let _ppl = await Person.aggregate([
        {
            $bucketAuto: {
                groupBy: "$age",
                buckets: 5,
                output: {
                    names: {$push: {$concat: ["$firstName", " ", "$lastName"]}},
                    count: {$sum: 1},
                    avgAge: {$avg: "$age"}
                }
            }
        }
    ]);
    return res.json({"People bucketauto age": _ppl});
});

app.get("/ppl/addrmakenull", async (req, res) => {
    await Person.updateMany({address: {$exists: false}}, {address: null});
    return res.json({"msg": "addr set to null if they dont have one"});
});


app.get("/rooms/all2", async (req, res) => {
    let _rooms = await Room.aggregate([
        {
            $match: {_id: {$exists: true, $ne: null}}
        },
        {
            $addFields: { membersCount: {$size: "$members"}}
        },
        {
            $project: {__v: 0, createdAt: 0, updatedAt: 0}
        }
    ]);
    return res.json({"rooms": _rooms});
});

app.get("/users/withoutempty", async (req, res) => {
    let _users = await User.find({"hobbies": {$exists: true, $ne: []}});
    return res.json({"users": _users});
});

app.get("/users/project1", async(req, res) => {
    let _users = await User.aggregate([
        {
            $project: {
                _id: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            }
        }
    ]);
    return res.json({"users": _users});

});

app.get("/users/project2", async(req, res) => {
    let _users = await User.aggregate([
        {
            $project: {
                fullname: {
                    $concat: ["$firstName", " ", "$lastName"]
                },
                age: 1,
                cash: 1,
                hobbies: 1
            }
        }
    ]);
    return res.json({"users": _users});

});

app.get("/users/project3", async(req, res) => {
    let _users = await User.aggregate([
        {  
        $match:{
            hobbies: {$exists: true, $ne: []}
        }
        },
        {
            $project: {
                firstName: 1,
                lastName: 1,
                age: 1,
                cash: 1,
                hobbies: 1,
                "hobbies_number": {$size: "$hobbies"}
            }
        }
    ]);
    return res.json({"users": _users});

});

app.get("/users/stats", async(req, res) => {
    let _users = await User.aggregate([
        {  
        $match:{
            _id: {$exists: true}
        }
        },
        {
            $group: {
                _id: "Stats for all users",
                avgAge: {$avg: "$age"},
                minAge: {$min: "$age"},
                maxAge: {$max: "$age"},
                avgCash: {$avg: "$cash"},
                minCash: {$min: "$cash"},
                maxCash: {$max: "$cash"},
                allUsers: {$sum: 1}
            }
        }
    ]);
    return res.json({"users": _users});

});

app.get("/users/toupper", async(req, res) => {
    let _users = await User.aggregate([
        {  
            $match:{
                hobbies: {$exists: true, $size: 0}
            }
        },
        {
            $project: {
                age: 1,
                cash: 1,
                firstName: {$toUpper: "$firstName"},
                lastName: {$toUpper: "$lastName"},
                fullName: {$toUpper: {$concat: ["$firstName", " ", "$lastName"]},
                
            }
            }
        }

    ]);
    return res.json({"users": _users});

});

app.get("/users/addfields", async(req, res) => {
    let _users = await User.aggregate([
        {  
            $match:{
                hobbies: {$exists: true, $ne: []}
            }
        },
        {
            $addFields: {
                firstName: {$toUpper: "$firstName"},
                lastName: {$toUpper: "$lastName"},
                fullName: {$toUpper: {$concat: ["$firstName", " ", "$lastName"]}},
                hobbies_count: {$size: "$hobbies"}
            }
        },
        {
            $project: {
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
                _id: 0
            }
        }

    ]);
    return res.json({"users": _users});

});

app.get("/users/unwind1", async(req, res) => {
    let _users = await User.aggregate([
        {
            $unwind: "$hobbies"
        }
    ]);
    return res.json({"users": _users});

});

app.get("/users/unwind2", async(req, res) => {
    let _users = await User.aggregate([
        {
            $unwind: "$hobbies"
        },
        {
            $match: {
                hobbies: {
                    $in: ['Coding', "SQL"]
                }
            }
        }
    ]);
    return res.json({"users": _users});

});


app.get("/users/unwind3", async(req, res) => {
    let _users = await User.aggregate([
        {
            $unwind: "$hobbies"
        },
        {
            $group: {
                _id: "$hobbies"
            }
        }
    ]);
    return res.json({"hobbies": _users});

});

app.get("/users/unwind4", async(req, res) => {
    let _users = await User.aggregate([
        {
            $unwind: "$hobbies"
        },
        {
            $group: {
                _id: "$hobbies",
                count: {$sum: 1}
            }
        }
    ]);
    return res.json({"hobbies": _users});

});

app.get("/users/:id", async (req, res) => {
    let _user = await User.findOne({_id: req.params.id});
    return res.json({"id": _user});
});


app.get("/ppl/:personID", async (req, res) => {
    let _person = await Person.findOne({_id: req.params.personID});
    return res.json({"person": _person});
});

app.patch("/ppl/:personID/addr", async (req, res) => {
    let _personID = req.params.personID;
    let _addrID =req.body.addrID;
    await Person.updateOne({_id: _personID}, {address: _addrID});

    return res.json({"msg" : "ok"});
});
app.get("/addr/:addrID", async (req, res) => {
    let _addr = await Address.findOne({_id: req.params.addrID});
    return res.json({"person": _addr});
});

app.get("/addr/:addrID/lookup", async (req, res) => {
    let _addr = await Address.aggregate([
        {
            $match: {_id: new ObjectId(req.params.addrID) }
        },
        {
            $lookup: {
                from: 'people',
                localField: '_id',
                foreignField: "address",
                as: "person_info",
                pipeline: [
                    {
                        $addFields: { hobbiesCount: {$size: "$hobbies"}}
                    }
                ]
            }
        },
        {
            $project: {
                "person_info._id": 0,
                "person_info.createdAt" : 0,
                "person_info.updatedAt" : 0,
                "person_info.address": 0,
                "person_info.__v": 0
            }
        }
    ]);
    console.log(_addr)
    return res.json({"person lookup": _addr});
});
app.get("/users/:id/withrooms", async (req, res) => {
    let _user = await User.findOne({_id: req.params.id});
    let _rooms = await Room.find({members: {$in: [req.params.id]}}, {members: 0, __v: 0, createdAt: 0, updatedAt: 0, _id:0} );
    let _flatRooms = _rooms.map((room) => room.name);
    // console.log(_flatRooms);
    // console.log({..._user});
    
    return res.json({"user": {..._user._doc, rooms: _flatRooms}});
});

app.get("/rooms/:roomID", async (req, res) => {
    // let _room = await Room.findOne({_id: req.params.roomID}).populate("members");
    let _room = await Room.findOne({_id: req.params.roomID});
    return res.json({"id": _room});
});


app.patch("/users/:id", async (req, res) => {
    const _filter = {_id: req.params.id};
    const _update = {...req.body};
    if(Object.keys(_update).length > 0){
        // await User.findOneAndUpdate(_filter, _update);
        await User.updateOne(_filter, _update);
    }
    let _updatedUsr = await User.findOne(_filter);
    return res.json({"updated user": _updatedUsr});
});

app.patch("/users/:id/newhobby", async (req, res) => {
    const _filter = {_id: req.params.id};
    const _update = { $addToSet: {hobbies: req.body.newHobby}};
    if(Object.keys(_update).length > 0){
        await User.updateOne(_filter, _update);
    }
    let _updatedUsr = await User.findOne(_filter);
    return res.json({"updated user with new hobby": _updatedUsr});
});

app.patch("/users/:id/addtoroom", async (req, res) => {
    let _userID = new ObjectId(req.params.id);
    let _roomID = new ObjectId(req.body.roomID);
    let _room = await Room.findOneAndUpdate({_id: _roomID}, {$addToSet: {members: _userID}});
    if(_room === null){
        return res.json({"err": "room doesnt exist"});
    }
    console.log(_room);

    return res.json({"msg" : "ok"});
});

app.patch("/users/:id/removehobby", async (req, res) => {
    const _filter = {_id: req.params.id};
    const _update = { $pull: {hobbies: {$eq: req.body.removeHobby}}};
    if(Object.keys(_update).length > 0){
        await User.updateOne(_filter, _update);
    }
    let _updatedUsr = await User.findOne(_filter);
    return res.json({"updated user with removed hobby": _updatedUsr});
});

app.delete("/users/:id", async (req, res) => {
    await User.deleteOne({_id: req.params.id});
    return res.json({"msg": "such user is not in db anymore"});
});

app.get("/users/:id/withrooms2", async (req, res) => {
    
    let _user = await User.aggregate([
        {
            $match: {_id: new ObjectId(req.params.id) }
        },
        {
            $lookup: {
                from: 'rooms',
                localField: '_id',
                foreignField: "members",
                as: "rooms",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            members: 0,
                            _id: 0,
                            createdAt: 0,
                            updatedAt: 0,
                        }
                    }
                ]
                
            }
        },
        {
            $addFields: {
                hobbiesCount: {$size: "$hobbies"},
                roomsCount: {$size: "$rooms"}
            }
        },
        {
            $project: {
                hobbies: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            }
        }
    ]);
    
    //todo - find a way to join two tables like that... 
    //its done!
    
    return res.json({"user": _user});
});


app.get("/users/:id/withrooms3", async (req, res) => {

    //TODO - FIND SOME WAY TO USE LOOKUP TO RETURN FLAT ARRAY...
    
    let _user = await User.aggregate([
        {
            $match: {_id: new ObjectId(req.params.id) }
        },
        {
            $lookup: {
                from: 'rooms',
                localField: '_id',
                foreignField: "members",
                as: "rooms",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            members: 0,
                            _id: 0,
                            createdAt: 0,
                            updatedAt: 0,
                        }
                    }
                ]
                
            }
        },
        {
            $addFields: {
                hobbiesCount: {$size: "$hobbies"},
                roomsCount: {$size: "$rooms"},
                roomNames: {
                    $map: {
                        input: "$rooms",
                        as: "room",
                        in: {
                            $mergeObjects: {}
                        }
                    }
                }
            }
        },
        {
            $project: {
                hobbies: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                rooms: 0
            }
        }
    ]);
    
    //todo - i want array of names...
  
    
    return res.json({"user": _user});
});

module.exports = app;