import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('user').populate('comments')
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить данные',
    });
  }
};

export const getByPopularity = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({'viewsCount': 1, 'likesCount': 1, 'commentsCount': 1})
      .populate('user').populate('comments')
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить данные',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      { _id: postId }, { $inc: { viewsCount: 1 } }, { returnDocument: "After" })
      .populate('user') // only works for model type, then will change the type to json
      .populate('comments')
      .then(doc => res.json(doc))
      .catch(err => res.status(500).json({ message: "Не удалось получить данные" }));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить данные',
    });
  }
};

export const getByTags = async (req, res) => {
  try {
    const tags = req.query.tags;
    await PostModel.find({ tags: { "$in": tags } }).then(doc => res.json(doc));
    console.log(tags);
    //return res.json(tags);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить данные',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    let checkUser = await PostModel.findOne({ _id: [postId] }).then(doc => {
      if (doc !== null) {
        return doc.user._id.toString();
      }
      else {
        throw new Error("Пост не найден");
      }
    });

    if ((checkUser !== req.userId)) {
      return res.status(500).json({ message: "Нет доступа" });
    }

    PostModel.findOneAndDelete({ _id: postId, })
      .then(doc => res.status(200).json({ message: "Пост успешно удален!" }))
      .catch(err => res.status(500).json({ message: "Не удалось удалить данные" }));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить данные',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать данные',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    let checkUser = await PostModel.findOne({ _id: [postId] }).
      then(doc => {
        if (doc !== null) {
          return doc.user._id.toString();
        }
        else {
          throw new Error("Пост не найден");
        }
      });

    console.log(checkUser + " " + req.userId + "| RES="+ (checkUser===req.userId));
    if ((checkUser !== req.userId)) {
      return res.status(500).json({ message: "Нет доступа" });
    }

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    ).then(doc => res.json(doc));

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить данные',
    });
  }
};


export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;

    let post = await PostModel.findOne({ _id: postId }).
      then(doc => {
        if (doc !== null) {
          return doc;
        }
        else {
          throw new Error("Пост не найден");
        }
      });
    if (post.likesCount.indexOf(req.userId) === -1) {
      post.likesCount.push(req.userId);
    }
    else {
      post.likesCount.splice(post.likesCount.indexOf(req.userId), 1);
    }

    const data = await post.save();

    console.log(post.likesCount)

    return res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить данные',
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
    });

    const comment = await doc.save();
    await PostModel.updateOne({ _id: postId }, { $push: { comments: doc } })
      .then(doc => console.log("Added comment to POST #" + postId))

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    await CommentModel.find()
      .populate('user') // only works for model type, then will change the type to json
      .then(doc => res.json(doc));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить данные',
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    let checkUser = await CommentModel.findOne({ _id: [commentId] }).
      then(doc => {
        if (doc !== null) {
          doc.user._id.toString();
        }
        else {
          throw new Error("Комментарий не найден");
        }
      });

    if ((checkUser !== req.userId)) {
      return res.status(500).json({ message: "Нет доступа" });
    }

    await CommentModel.updateOne(
      {
        _id: commentId,
      },
      {
        text: req.body.text
      },
    ).then(doc => res.json(doc));

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить данные',
    });
  }
};

export const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    let comment = await CommentModel.findOne({ _id: commentId }).
      then(doc => {
        if (doc !== null) {
          return doc;
        }
        else {
          throw new Error("Комментарий не найден");
        }
      });
    if (comment.likesCount.indexOf(req.userId) === -1) {
      comment.likesCount.push(req.userId);
    }
    else {
      comment.likesCount.splice(comment.likesCount.indexOf(req.userId), 1);
    }

    const data = await comment.save();

    console.log(comment.likesCount)

    return res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить данные',
    });
  }
};

export const removeComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    let checkUser = await CommentModel.findOne({ _id: [commentId] }).then(doc => {
      if (doc !== null) {
        doc.user._id.toString();
      }
      else {
        throw new Error("Комментарий не найден");
      }
    });

    if ((checkUser !== req.userId)) {
      return res.status(500).json({ message: "Нет доступа" });
    }

    CommentModel.findOneAndDelete({ _id: commentId, })
      .then(doc => res.status(200).json({ message: "Комментарий успешно удален!" }))
      .catch(err => res.status(500).json({ message: "Не удалось удалить комментарий" }));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить данные',
    });
  }
};