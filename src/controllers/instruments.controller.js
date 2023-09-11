const db = require('../db/models');

exports.functionpost = async (req, res) => {
  const postId = req.params.id;
  const post = await db.Post.findByPk(postId);
  if (post) {
    const {func,funcname} = req.body;
    await db.instruments.create({ func,funcname,postId:post.id,portId:post.port,baudrateId:post.baudrate,count:50 });
    res.redirect(`/home/${postId}`);
  } else {
    res.status(404).send('Post not found');
  }
};

exports.functionedit = async (req, res) => {
  const functionId = req.params.id;
  const { func,funcname} = req.body;
  const functions = await db.instruments.findByPk(functionId);
  if (functions) {
    functions.func = func;
    functions.funcname = funcname;
    await functions.save();
    res.redirect(`/home/dashboard/data/${functionId}`);
  } else {
    res.status(404).send('Post not found');
  }
};

exports.functiondelete = async (req, res) => {
  const functionId = req.params.id;
  const functions = await db.instruments.findByPk(functionId);
  const postId = functions.postId;
  if (functions) {
    await functions.destroy();
    res.redirect(`/home/${postId}`);
  } else {
    res.status(404).send('Post not found');
  }
};

exports.functioncountdash = async (req, res) => {
  const functionId = req.params.id;
  const {count} = req.body;
  const functions = await db.instruments.findByPk(functionId);
  if (functions) {
    const postId = functions.postId;
    functions.count = count;
    await functions.save();
    res.redirect(`/home/dashboard/${postId}`);
  } else {
    res.status(404).send('Post not found');
  }
};

exports.functioncountdata = async (req, res) => {
  const functionId = req.params.id;
  const {count} = req.body;
  const functions = await db.instruments.findByPk(functionId);
  if (functions) {
    functions.count = count;
    await functions.save();
    res.redirect(`/home/dashboard/data/${functionId}`);
  } else {
    res.status(404).send('Post not found');
  }
};