const Role = require('../models/RoleModel');
const { Snowflake } = require("@theinternetfolks/snowflake");
const uuid = require("uuid");

exports.createRole = async (req, res) => {
  const name = req.body.name;
  if (name.length < 2) {
    res.send("name shoud contain min 2 characters");
  } else {
    const currentDate = new Date();
    // const dateString = currentDate.toISOString();
    // const snowflake = new Snowflake();
    // const id = Snowflake.generate;
    const id = uuid.v4();
    let new_role = {
      'id': id,
      'name': name,
      'created_at': currentDate,
      'updated_at': currentDate
    }
    let _role = new Role(new_role);

    _role.save().then(result => res.send({
      "status": true,
      "content": {
        "data": result
      }
    })).catch(err => res.send("something wents wrong."));

  }
};

exports.getAllRoles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  Role.find().skip(skip)
    .limit(limit)
    .then(result => {
      let data = [];
      for (let i = 0; i < result.length; i++) {
        const x = {
          "id": result[i].id,
          "name": result[i].name,
          "created_at": result[i].created_at,
          "updated_at": result[i].updated_at,
        }
        data.push(x);
      }
      const total = result.length;
    const pages = Math.ceil(total / limit);
      const response = {
        "status": true,
        "content": {
          "meta": {
            "total": total,
            "pages": pages,
            "page":page
          },
          "data": data
        }
      }

      res.send(response)

    }).catch(err => res.send("data not found"));
};