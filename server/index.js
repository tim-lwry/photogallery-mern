import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
//const uri = "mongodb+srv://root:root@merncluster0.un78qos.mongodb.net/?retryWrites=true&w=majority&appName=merncluster0";


import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';


const localuri = "mongodb://127.0.0.1:27017/photogallery";

const clientOptions = {}//serverApi: { version: '1', strict: true, deprecationErrors: true } };

// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);



await mongoose.connect(
    process.env.MONGO_DB_URI || localuri, clientOptions
).then(() => console.log("Successfully connected to DB"))
    .catch((err) => console.log("DB connection failed: " + err));


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

const app = express();

app.get('/', (req, res) => {
    res.send('App working');
});
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
app.delete('delete-image/:imageURL', PostController.removeImage);

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/popular', PostController.getByPopularity);
app.get('/posts/withtags', PostController.getByTags);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.put('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update,);
app.put('/posts/like/:id', checkAuth, PostController.likePost);

app.post('/comments/:id', checkAuth, commentCreateValidation, handleValidationErrors, PostController.createComment);
app.get('/comments', PostController.getAllComments);
app.delete('/comments', checkAuth, PostController.removeComment);
app.put('/comments/:id', checkAuth, commentCreateValidation, handleValidationErrors, PostController.updateComment);
app.put('/comments/like/:id', checkAuth, PostController.likeComment);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`Server status: A-Okay\nServer PORT:${process.env.PORT || 4444}`);
});