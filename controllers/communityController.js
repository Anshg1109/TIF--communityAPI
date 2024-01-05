const Community = require('../models/CommunityModel');
const { Snowflake } = require('@theinternetfolks/snowflake');
const Member = require("../models/MemberModel");
const Role = require("../models/RoleModel")
const uuid = require("uuid");
const sha256 = require("sha256");
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

exports.createCommunity = async (req, res) => {
  const authHeader = req.headers.authorization;
  const bearer_token = authHeader && authHeader.split(' ')[1];
  const name = req.body.name;
  jwt.verify(bearer_token, process.env.ACCESS_TOKEN_SECERT, (err, tokenData) => {
    if (err) {
      res.send("You have not access.");
    } else {
      if (name.length < 2) {
        res.send("name shoud contain min 2 characters");
      } else {
        const id = uuid.v4();
        const new_community = new Community({
          "id": id,
          "name": name,
          "slug": name + uuid.v4(),
          "owner": tokenData,
          "created_at": new Date(),
          "updated_at": new Date(),
        });
        new_community.save().then(result => {
          const response = {
            "status": true,
            "content": {
              "data": {
                "id": result["id"],
                "name": result["name"],
                "slug": result["slug"],
                "owner": result["owner"],
                "created_at": result["created_at"],
                "updated_at": result["updated_at"]
              }
            }
          }
          res.send(response);
        }).catch(err => {
          console.log(err);
          res.send("Something went wrong.")
        })

      }
    }
  })
};

exports.getAllCommunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let data = await Community.find().skip(skip).limit(limit);;
    // res.send(data);
    let response = [];
    for (let i = 0; i < data.length; i++) {
      const owner = await User.findOne({ "id": data[i].owner });
      // res.send(data[i].owner);
      let x = {
        "id": data[i].id,
        "name": data[i].name,
        "slug": data[i].slug,
        "owner": {
          "id": data[i].owner,
          "name": owner['name']
        },
        "created_at": data[i].created_at,
        "updated_at": data[i].updated_at
      }
      response.push(x)
    }
    const total = await Community.countDocuments();
    const pages = Math.ceil(total / limit);
    response = {
      "status": true,
      "content": {
        "meta": {
          "total": total,
          "pages": pages,
          "page": page
        },
        "data": response
      }
    }
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send("Somethings went wrong.");
  }
};

exports.getAllCommunityMembers = async (req, res) => {
  const communityId = req.params.id;
  let data = [];
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const members = await Member.find({ "community": communityId }).skip(skip).limit(limit);;
    for (let i = 0; i < members.length; i++) {
      const user = await User.findOne({ "id": members[i].user });
      const user_name = user.name;
      const role = await Role.findOne({ "id": members[i].role });
      const role_name = role.name;
      const x = {
        "id": members[i].id,
        "community": members[i].community,
        "user": {
          "id": members[i].user,
          "name": user_name
        },
        "role": {
          "id": members[i].role,
          "name": role_name
        },
        "created_at": members[i].created_at
      }
      data.push(x);
    }
    const total = await Member.countDocuments();
    const pages = Math.ceil(total / limit);
    data = {
      "status": true,
      "content": {
        "meta": {
          "total": total,
          "pages": pages,
          "page": page
        },
        "data": data
      }
    }
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send("Somethings went wrong.")
  }
};

exports.getOwnedCommunities = async (req, res) => {
  const authHeader = req.headers.authorization;
  const bearer_token = authHeader && authHeader.split(' ')[1];
  jwt.verify(bearer_token, process.env.ACCESS_TOKEN_SECERT, async (err, tokenData) => {
    if (err) {
      res.send("You have not access.");
    } else {

      try {
        // console.log(tokenData);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const myOwnedCommunity = await Community.find({ "owner": tokenData }).skip(skip).limit(limit);;
        let data = [];
        for (let i = 0; i < myOwnedCommunity.length; i++) {
          const x = {
            "id": myOwnedCommunity[i].id,
            "name": myOwnedCommunity[i].name,
            "slug": myOwnedCommunity[i].slug,
            "owner": myOwnedCommunity[i].owner,
            "created_at": myOwnedCommunity[i].created_at,
            "updated_at": myOwnedCommunity[i].updated_at
          }
          data.push(x);
        }
        const total = await Community.countDocuments();
        const pages = Math.ceil(total / limit);
        const response = {
          "status": true,
          "content": {
            "meta": {
              "total": total,
              "pages": pages,
              "page": page
            },
            "data": data
          }
        }
        res.send(response);
      } catch (err) {
        console.log(err);
        res.send("Something wents wrong.");
      }

    }
  });

};

exports.getJoinedCommunities = async (req, res) => {
  const authHeader = req.headers.authorization;
  const bearer_token = authHeader && authHeader.split(' ')[1];
  jwt.verify(bearer_token, process.env.ACCESS_TOKEN_SECERT, async (err, tokenData) => {
    if (err) {
      res.send("You have not access.");
    } else {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const myMembership = await Member.find({ "user": tokenData }).skip(skip).limit(limit);;
        let data = [];
        for (let i = 0; i < myMembership.length; i++) {
          const community_data = await Community.findOne({ "id": myMembership[i].community });
          let owner_name = await User.findOne({ "id": community_data.owner });
          owner_name = owner_name.name;
          const x = {
            "id": community_data.id,
            "name": community_data.name,
            "slug": community_data.slug,
            "owner": {
              "id": community_data.owner,
              "name": owner_name,
            },
            "created_at": community_data.created_at,
            "updated_at": community_data.updated_at
          }
          data.push(x);
        }
        const total = await Member.countDocuments();
        const pages = Math.ceil(total / limit);
        const response = {
          "status": true,
          "content": {
            "meta": {
              "total": total,
              "pages": pages,
              "page": page
            },
            "data": data
          }
        }
        res.send(response);
      } catch (err) {
        console.lof(err);
        res.send("Somethings wents wrong");
      }
    }
  })
};
