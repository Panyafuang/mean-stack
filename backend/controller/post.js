const path = require('path');
const fs = require('fs');

const Post = require('../models/post.model');

exports.createPosts = async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });

  try {
    const createdPost = await post.save();
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
        creator: req.userData.userId
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'Creating a post failed!'
    });
  }
}

exports.getPosts = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const pageSize = +req.query.pagesize || 5;
  try {
    const posts = await Post.find().skip((currentPage - 1) * pageSize).limit(pageSize);
    const totalPosts = await Post.countDocuments();
    res.status(200).json({
      message: 'Posts fetched succesfully!',
      posts: posts,
      totalPosts: totalPosts
    });
  } catch (err) {
    res.status(500).json({
      message: 'Fetching posts failed!'
    });
  }
}

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post) {
      res.status(404).json({ message: 'Post not found!' })
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message: 'Fetching post failed!'
    });
  }
}

exports.updatePost = async (req, res, next) => {
  let imagePath = req.body.imagePath;
  /** ถ้าเป็น string(not change img) จะเป็น undefind, แต่ถ้าเปลี่ยนรูปใหม่จะส่งมาเป็น file type */
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post) {
      res.status(404).json({ message: 'Post not found!' })
    }
    if (post.imagePath !== imagePath) {
      clearImage(post.imagePath);
    }

    // post.title = req.body.title;
    // post.content = req.body.content;
    // /** delete old image when update new image */
    // if (post.imagePath !== imagePath) {
    //   clearImage(post.imagePath);
    // }
    // post.imagePath = imagePath;
    // const updatedPost = await post.save();

    const updatedPost = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    const result = await Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, updatedPost);
    if (result.matchedCount > 0) {
      res.status(200).json({
        post: {
          id: updatedPost._id,
          title: updatedPost.title,
          content: updatedPost.content,
          imagePath: updatedPost.imagePath
        },
        message: 'Update successful!'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'Couldn\'t update post!'
    });
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post) {
      res.status(404).json({ message: 'Post not found!' })
    }
    const result = await Post.deleteOne({ _id: req.params.id, creator: req.userData.userId });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Post deleted!' });
    } else {
      res.status(401).json({ message: 'Not authorized!' });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Couldn\'t update post!'
    });
  }
}

const clearImage = (filePath) => {
  filePath = filePath.split('/').slice(-1)[0];
  filePath = path.join(__dirname, '..', 'images', filePath);

  fs.unlink(filePath, (err) => {
    console.log(err);
  });
}
