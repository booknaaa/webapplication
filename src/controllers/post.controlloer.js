const { User, Post } = require('../db/models');  // แก้ไขตามตำแหน่งของโมเดล
const db = require('../db/models');

exports.postget = async (req, res) => {
    const users = await User.findAll();
    res.render('post', { users });
  };
  
  // รับข้อมูลจากฟอร์มและบันทึกโพสต์
  exports.postpost = async (req, res) => {
    if (req.session.userId) {
      const user = await db.User.findByPk(req.session.userId);
      if (user) {
        const { title,content,port,baudrate } = req.body;
        await db.Post.create({ content,title,port,baudrate, UserId: user.id });
      }
    }
    res.redirect('/home');
  };