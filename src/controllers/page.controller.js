const express = require("express");
const router = express.Router();
const db = require("../db/models");

exports.index = async (req, res) => {
  try{
res.render('index', { title: 'Express' });
} catch (err) {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
}
};

exports.home = async (req, res) => {
  if (req.session.userId) {
    const user = await db.User.findByPk(req.session.userId, {
      include: [{ model: db.Post }],
    });
    if (user.role === "User") {
    res.render("home", { user });
  } else if (user.role === "Admin") {
    res.redirect("/admin");
  } else {
    res.redirect("/login");
  }
}};

exports.editget = async (req, res) => {
  const postId = req.params.id;
  const post = await db.Post.findByPk(postId, {
    include: [{ model: db.instruments }],
  });
  if (post) {
    res.render('detail', { post });
  } else {
    res.status(404).send('Post not found');
  }
};

exports.editpost = async (req, res) => {
  const postId = req.params.id;
  const { title,content} = req.body;

  const post = await db.Post.findByPk(postId);

  if (post) {
    post.title = title;
    post.content = content;
    await post.save();
    res.redirect(`/home/${postId}`);
  } else {
    res.status(404).send('Post not found');
  }
};

exports.editcon = async (req, res) => {
  const postId = req.params.id;
  const { port,baudrate } = req.body;
  const post = await db.Post.findByPk(postId);

  if (post) {

    post.port = port;
    post.baudrate = baudrate;
    await post.save();

    await db.instruments.update(
      {
        portId: port,
        baudrateId: baudrate, // หรืออาจจะใช้ชื่อคอลัมน์ที่ถูกต้อง
      },
      {
        where: { postId :post.id},
      }
    );

    res.redirect(`/home/${postId}`);
  } else {
    res.status(404).send('Post not found');
  }
};

exports.deletepost = async (req, res) => {
  const postId = req.params.id;
  const post = await db.Post.findByPk(postId);

  if (post) {
    await post.destroy();
    res.redirect(`/home`);
  } else {
    res.status(404).send('Post not found');
  }
};

exports.dashboardget = async (req, res) => {
    const postId = req.params.id;
    const post = await db.Post.findByPk(postId, {
      include: [{ model: db.instruments }]
    });
    if (post) {
  
      res.render('dashboard', {post});
    } else {
      res.send('Post not found');
    }
  };

  exports.dashboarddata = async (req, res) => {
    const postId = req.params.id;
    const post = await db.Post.findByPk(postId);
    const responseone = await axios.get('http://127.0.0.1:1880/nodered');
    const responseall = await axios.get('http://127.0.0.1:1880/all');
    const data1 = responseone.data;
    const data0 = responseall.data;
    if (post) {
      res.render('dashboarddata', { post,data0,data1 });
    } else {
      res.send('Post not found');
    }
  };

  exports.profile = async (req, res) => {
    if (req.session.userId) {
      const user = await db.User.findByPk(req.session.userId, {
        include: [{ model: db.Post }],
      });
      if (user.role === "User") {
        res.render("profile", { user });
      } else if (user.role ==="Admin") {
        res.render("profileadmin", { user });
      }else {
        res.redirect("/login");
      }
    }
  };

  exports.profileid = async (req, res) => {
    const postId = req.params.id;
    if (postId) {
      const user = await db.User.findByPk(postId, {
        include: [{ model: db.Post }],
      });
      if (user) {
        res.render("profile", { user });
      } else {
        res.redirect("/login");
      }
    }
  };
  
  

