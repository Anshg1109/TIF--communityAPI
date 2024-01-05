const Member = require('../models/MemberModel');
const User = require('../models/UserModel');
const { Snowflake } = require('@theinternetfolks/snowflake');
const Role = require("../models/RoleModel")
const uuid = require("uuid");
const sha256 = require("sha256");
const jwt = require('jsonwebtoken');
const Community = require('../models/CommunityModel');

exports.addMember = async (req, res) => {
  const authHeader = req.headers.authorization;
  const bearer_token = authHeader && authHeader.split(' ')[1];
  const community = req.body.community;
  const user = req.body.user;
  const role = req.body.role;
  jwt.verify(bearer_token, process.env.ACCESS_TOKEN_SECERT, async (err, tokenData) => {
    if (err) {
      res.send("You have not access.");
    } else {
      const new_member = new Member({
        'id': uuid.v4(),
        'community': community,
        'user': user,
        'role': role,
        'created_at': new Date()
      });
      try {
        const community_data = await Community.findOne({ "owner": tokenData });
        // console.log(tokenData);
        // res.send(community_data)
        if (community_data) {
          new_member.save().then(result => {
            const response = {
              "status": true,
              "content": {
                "data": {
                  "id": result.id,
                  "community": result.community,
                  "user": result.user,
                  "role": result.role,
                  "created_at": result.created_at
                }
              }
            }
            res.send(response);
          }).catch(err => {
            console.log(err);
            res.send("Something went wrong.")
          })
        } else {
          res.send("NOT_ALLOWED_ACCESS")
        }

      } catch (err) {
        console.log(err);
        res.send("Somthing wents wrong.")
      }
    }
  });
};

exports.removeMember = async (req, res) => {
  const memberId = req.params.id;
  const authHeader = req.headers.authorization;
  const bearer_token = authHeader && authHeader.split(' ')[1];
  jwt.verify(bearer_token, secretKey, async (err, tokenData) => {
    if (err) {
      res.send("You have not access.");
    } else {
      const member_data = await Member.findOne({ "id": memberId });
      if (member_data) {
        const communityId = member_data.community;
        const community_data = await Community.findOne({ "id": communityId });
        const community_owner = community_data.owner;
        if (community_owner === tokenData) {
          const result = await Member.deleteOne({ "id": memberId });
          if (result.deletedCount === 0) {
            return res.status(404).send('Member not found');
          }
          return res.status(200).send({
            "status": true
          });
        } else {
          res.send("NOT_ALLOWED_ACCESS")
        }
      } else {
        return res.status(404).send('Member not found');
      }
    }
  })

};