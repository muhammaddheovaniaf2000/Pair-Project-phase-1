const express = require('express');
const app = express();
const session = require('express-session');
const Controller = require('./controllers/controller');
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'rahasia_insta_refactored',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

const isLoggedIn = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login?error=Harap login');
    next();
}
const isAdmin = (req, res, next) => {
    if (req.session.role !== 'admin') return res.redirect('/login?error=Admin Only');
    next();
}

// Public
app.get('/', Controller.landing);
app.get('/login', Controller.loginForm);
app.post('/login', Controller.postLogin);
app.get('/login/regist', Controller.registerForm);
app.post('/register', Controller.postRegister);
app.get('/logout', Controller.logout);

// User
app.use('/user', isLoggedIn);
app.get('/user/home', Controller.home);
app.get('/user/:id', Controller.profile);
app.get('/user/:id/addPost', Controller.addPostForm);
app.post('/user/:id/addPost', Controller.createPost);
app.get('/user/:id/edit', Controller.showEditProfile);
app.post('/user/:id/edit', Controller.updateProfile);
app.get('/user/:id/editpost/:idPost', Controller.editPostForm);
app.post('/user/:id/editpost/:idPost', Controller.updatePost);
app.get('/user/:id/search', Controller.searchUser);
app.get('/user/:id/search/:idUser', Controller.searchUserDetail);
app.get('/user/:id/like/:idPost', Controller.likePost);

// Admin
app.get('/admin', isLoggedIn, isAdmin, Controller.adminDashboard);
app.get('/admin/delete/:id', isLoggedIn, isAdmin, Controller.deleteUser);
app.get('/admin/deletePost/:idPost', isLoggedIn, isAdmin, Controller.deletePostAdmin);

app.listen(PORT, () => console.log(`App running on port http://localhost:${PORT}`));