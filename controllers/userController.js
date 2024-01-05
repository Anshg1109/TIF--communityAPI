const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Snowflake } = require('@theinternetfolks/snowflake');
const uuid = require("uuid");
const sha256 = require("sha256");

// Function to generate a JWT token
// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user.id,
//       email: user.email,
//     },
//     process.env.ACCESS_TOKEN_SECERT, // Ensure you have this secret set in your environment variables
//     {
//       expiresIn: '1h', // Token expires in 1 hour, modify as per your requirements
//     }
//   );
// };




exports.signup = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (name.length < 2) {
    res.send("name shoud contain min 2 characters");
  }
  else if (email.length < 1) { res.send("email is required."); }
  else if (password.length < 6) { res.send("password shoud contain min 6 characters"); }
  else {
    const id = uuid.v4();
    const new_user = new User({
      'id': id,
      'name': name,
      'email': email,
      'password': sha256(password),
      'created_at': new Date(),
    });

    const access_token = jwt.sign(id, process.env.ACCESS_TOKEN_SECERT);

    User.findOne({ 'email': email }).then(result => {
      if (result) {
        res.send("Email is already registerd.");
      }
      else {
        new_user.save().then(result => {
          const response = {
            "status": true,
            "content": {
              "data": {
                "id": result['id'],
                "name": result['name'],
                "email": result['email'],
                "created_at": result['created_at']
              },
              "meta": {
                "access_token": access_token
              }
            }
          }
          res.send(response);
        }).catch(err => {
          res.send("Something went wrong.");
        })
      }
    }).catch(error => {
      res.send("Something went wrong.")
    })

  }
};

exports.signin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ "email": email, "password": sha256(password) }).then(result => {
    if (result) {
      const response = {
        "status": true,
        "content": {
          "data": {
            "id": result['id'],
            "name": result['name'],
            "email": result['email'],
            "created_at": result['created_at']
          },
          "meta": {
            "access_token": jwt.sign(result['id'], process.env.ACCESS_TOKEN_SECERT)
          }
        }
      }
      res.send(response);
    } else {
      res.send("User not found.")
    }
  }).catch(err => { res.send("Something wet wrong.") })
};

exports.getMe = async (req, res) => {
  const authHeader = req.headers.authorization;
  const bearer_token = authHeader && authHeader.split(' ')[1];
  jwt.verify(bearer_token, process.env.ACCESS_TOKEN_SECERT, (err, tokenData) => {
    if (err) {
      res.send("You have not access.");
    } else {
      const id = tokenData;
      User.findOne({ "id": id }).then(result => {
        if (result) {
          const response = {
            "status": true,
            "content": {
              "data": {
                "id": result['id'],
                "name": result['name'],
                "email": result['email'],
                "created_at": result['created_at']
              }
            }
          }
          res.send(response);
        } else {
          res.send("user not found.");
        }
      }).catch(err => {
        console.log(err);
        res.send("Something went wrong");
      })
    }
  })
};