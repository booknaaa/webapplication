const express = require("express");
const router = express.Router();
const db = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { SerialPort } = require("serialport");
const { instruments } = require("../db/models");
const { User } = require("../db/models");
const { Post } = require("../db/models");
const { value } = require("../db/models");
dotenv.config();

exports.admin = async (req, res) => {
  if (req.session.userId) {
    const user = await db.User.findByPk(req.session.userId, {
      include: [{ model: db.Post }],
    });
    if (user.role === "Admin") {
      const postall = await db.Post.findAll();
      res.render("admin", { user, postall });
    } else {
      res.redirect("/login");
    }
  }
};

exports.admininstru = async (req, res) => {
  if (req.session.userId) {
    const user = await db.User.findByPk(req.session.userId, {
      include: [{ model: db.Post }],
    });
    const post = await db.Post.findAll();
    const func = await db.instruments.findAll();
    res.render("admininstru", { user, post, func });
  } else {
    res.redirect("/admin");
  }
};

exports.admindelete = async (req, res) => {
  const postId = req.params.id;
  const post = await db.Post.findByPk(postId);

  if (post) {
    await post.destroy();
    res.redirect(`/admin/instruments`);
  } else {
    res.status(404).send("Post not found");
  }
};

exports.adminpost = async (req, res) => {
  if (req.session.userId) {
    const user = await db.User.findByPk(req.session.userId);
    if (user) {
      const { title, content, port, baudrate } = req.body;
      await db.Post.create({ content, title, port, baudrate, UserId: user.id });
    }
  }
  res.redirect("/admin/instruments");
};

exports.admindeletefuc = async (req, res) => {
  const postId = req.params.id;
  console.log(postId);
  if (postId) {
    await db.instruments.destroy({
      where: { id: postId },
    });
    res.redirect(`/admin/instruments`);
  } else {
    res.status(404).send("Post not found");
  }
};

exports.adminpostfuc = async (req, res) => {
  const { funcname, func, postId, portId, baudrateId, count } = req.body;
  await db.instruments.create({
    funcname,
    func,
    postId,
    portId,
    baudrateId,
    count,
  });
  res.redirect("/admin/instruments");
};

exports.adminuser = async (req, res) => {
  if (req.session.userId) {
    const user = await db.User.findByPk(req.session.userId, {
      include: [{ model: db.Post }],
    });
    const users = await db.User.findAll();
    res.render("adminusers", { user, users });
  } else {
    res.redirect("/admin");
  }
};
//ทำต่อ
exports.admindeleteuser = async (req, res) => {
  const postId = req.params.id;
  if (postId) {
    await db.User.destroy({
      where: { id: postId },
    });
    res.redirect(`/admin/users`);
  } else {
    res.status(404).send("Post not found");
  }
};

exports.adminpostuser = async (req, res) => {
  try {
    //res.status(201).json(req.body);
    //add new user and return 201
    const salt = await bcrypt.genSalt(10);
    var usr = {
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      gender: req.body.gender,
      role: req.body.role,
      //password : await bcrypt.hash(req.body.password, salt),
      password: await bcrypt.hashSync(req.body.password, salt),
    };
    created_user = await db.User.create(usr);
    //res.status(201).json(created_user);
    //console.log("User registered successfully!")
    //res.status(201).json({ message: "User registered successfully" });
    res.redirect("/admin/users");
    //console.log(req.body)
    // return res.redirect('/')
  } catch (err) {
    // console.log(error.errors)

    req.flash("validationErrors", validationErrors);
    req.flash("data", req.body);
    res.status(500).json({ error: "An error occurred" });
    //return res.redirect('/register')
  }
};

exports.adminedit = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  //const role = req.body.role || 'User';
  const user = await db.User.findByPk(userId);
  if (user) {
    user.role = role;
    await user.save();
    res.redirect("/admin/users");
  } else {
    res.status(404).send("Post not found");
  }
};

exports.admindashboard = async (req, res) => {
  const user = await db.User.findByPk(req.session.userId);
  const postall = await db.Post.findAll({
    include: [{ model: db.instruments, include: [{ model: db.value }] }],
  });
  res.render("admindashboard", { user, postall });
};

/*  const post = await db.Post.findAll({
      include: [{ model: db.instruments,
           include: [{ model: db.value }]
       }]
    });
*/

exports.profileadmin = async (req, res) => {
  if (req.session.userId) {
    const user = await db.User.findByPk(req.session.userId, {
      include: [{ model: db.Post }],
    });
    const userall = await db.User.findAll();
    res.render("profileadmin", { user, userall });
  } else {
    res.redirect("/profile");
  }
};

exports.editadmin = async (req, res) => {
  const dataId = req.params.id;
  const user = await db.User.findByPk(dataId);
  if (user) {
    res.render("editadmin", { user });
  } else {
    res.status(404).send("Post not found");
  }
};

exports.editadmin = async (req, res) => {
  const postId = req.params.id;
  const post = await db.Post.findByPk(postId);
  if (post) {
    res.render("editadmin", { user });
  } else {
    res.status(404).send("Post not found");
  }
};

exports.profile = async (req, res) => {
  if (req.session.userId) {
    const user = await db.User.findByPk(req.session.userId, {
      include: [{ model: db.Post }],
    });
    if (user.role === "User") {
      res.render("profile", { user });
    } else if (user.role === "Admin") {
      const userall = await db.User.findAll();
      res.render("profileadmin", { user, userall });
    } else {
      res.redirect("/login");
    }
  }
};

exports.serialportadmin = async (req, res) => {
  const funcId = req.params.id;
  const func = await db.instruments.findByPk(funcId);
  let count = 1;
  if (func) {
    const c2o2mmands = ["SENSe:CHANnel 1", "SENSe:PROBe 1", "INIT", "FETCh?"];
    const input = func.func;
    const output = input.split(",").map((item) => item.trim());
    const Commands = output.join("\r\n");

    const port = func.portId;
    const baudRate = func.baudrateId;
    const funcid = func.id;
    const postId = func.postId;
    let countins = func.count;

    const serialPort = new SerialPort({
      path: port,
      baudRate: baudRate, // อัตราเร็วของ Serial Port
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      flowControl: false,
    });

    serialPort.on("open", () => {
      console.log("Serial Port is open.");
      sendDataInterval = setInterval(() => {
        serialPort.write(Commands + "\r\n", (err) => {
          if (err) {
            console.error("Error writing to serial port:", err);
          } else {
            console.log("Commands sent to serial port.", Commands);
          }
        });
      }, 5000); // ส่งทุก 5 วินาที
    });
    let receivedData = Buffer.alloc(0);
    let dataCount = 0;

    serialPort.on("data", async (data) => {
      console.log(data);
      const newBuffer = Buffer.from(data);
      receivedData = Buffer.concat([receivedData, newBuffer]);
      dataCount++;

      if (dataCount === 2) {
        const receivedString = receivedData.toString(); // แปลงเป็น string
        const receivedNumber = parseFloat(receivedString);
        const formattedNumber = receivedNumber.toFixed(4); // จัดรูปแบบทศนิยม 4 หลัก
        console.log("Received data:", formattedNumber);
        dataCount = 0;
        receivedData = Buffer.alloc(0); // เคลียร์ Buffer สำหรับรับข้อมูลใหม่.

        await instruments.update(
          {
            value: formattedNumber,
          },
          {
            where: { id: funcid },
          }
        );
        if (count <= countins) {
          value.create({
            datavalue: formattedNumber,
            instrumentId: funcid,
            postId: postId,
            countId: count++,
          });
        } else {
          count = 1;
          serialPort.close(() => {
            console.log("ปิดการเชื่อมต่อ Serial Port");
          });
        }
      }
    });
    serialPort.on("error", (err) => {
      console.error("Serial Port error:", err);
    });

    process.on("SIGINT", () => {
      clearInterval(sendDataInterval);
      serialPort.close(() => {
        console.log("ปิดการเชื่อมต่อ Serial Port");
        process.exit();
      });
    });

    //res.redirect(`/home/dashboard/${post.postId}`);
    res.redirect(`/admin/dashboard`);
  } else {
    res.send("Post not found");
  }
};

exports.admindeletevalue = async (req, res) => {
  const valueId = req.params.id;
  if (valueId) {
    const func = await db.instruments.findByPk(valueId);
    const postId = func.postId;
    value.destroy({
      where: { instrumentId: valueId },
    });

    res.redirect(`/admin/dashboard`);
  } else {
    res.send("Ins not found");
  }
};

exports.adminadmin = async (req, res) => {
  const user = await db.User.findByPk(req.session.userId);
  const postall = await db.Post.findAll({
    include: [{ model: db.instruments, include: [{ model: db.value }] }],
  });

  const male = await db.User.count({
    where: { gender: "male" },
  });
  const female = await db.User.count({
    where: { gender: "female" },
  });
  const other = await db.User.count({
    where: { gender: "other" },
  });
  const gender = [male, female, other];

  const admin = await db.User.count({
    where: { role: "Admin" },
  });
  const user1 = await db.User.count({
    where: { role: "User" },
  });
  const member = [admin, user1];

  res.render("adminadmin", { user, postall, gender, member });
};

exports.chartdashboard = async (req, res) => {

  const user = await db.User.findByPk(req.session.userId);
    const postall = await db.Post.findAll({
      include: [{ model: db.instruments, include: [{ model: db.value }] }],
    });
    res.render("admincharts", { postall,user });
  };