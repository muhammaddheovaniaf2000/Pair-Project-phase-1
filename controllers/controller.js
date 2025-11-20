const { User, UserProfile, Post, Tag, PostTag } = require('../models/index')
const formatTime = require('../helpers/formatTime') // Menggunakan helper yang diminta
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')

class Controller {

    // --- PUBLIC ROUTES ---

    static async landing(req, res) {
        try {
            res.render('landing');
        } catch (err) {
            res.send(err);
        }
    }

    static async loginForm(req, res) {
        try {
            res.render('auth/login', { error: req.query.error });
        } catch (err) {
            res.send(err);
        }
    }

    static async registerForm(req, res) {
        try {
            res.render('auth/register', { error: req.query.error });
        } catch (err) {
            res.send(err);
        }
    }

    static async postRegister(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.redirect('/login/regist?error=Semua kolom harus diisi');
            }

            const user = await User.create({ email, password, role: 'user' });
            
            await UserProfile.create({
                name: name,
                UserId: user.id,
                profilePict: `https://ui-avatars.com/api/?name=${name}`
            });

            res.redirect('/login');
        } catch (err) {
            if (err.name === 'SequelizeValidationError') {
                const msg = err.errors.map(e => e.message);
                return res.redirect(`/login/regist?error=${msg}`);
            }
            res.send(err);
            console.log(err);
        }
    }

    static async postLogin(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.redirect('/login?error=Isi email dan password');

            const user = await User.findOne({ where: { email } });

            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.userId = user.id;
                req.session.role = user.role;
                return res.redirect(user.role === 'admin' ? '/admin' : '/user/home');
            }
            res.redirect('/login?error=Invalid Creds');
        } catch (err) {
            res.send(err);
            console.log(err);
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy(() => res.redirect('/login'));
        } catch (err) {
            res.send(err);
        }
    }

    // --- USER FEATURES ---

    static async home(req, res) {
        try {
            const posts = await Post.findAll({
                include: [
                    { model: UserProfile },
                    { model: Tag }
                ],
                order: [['createdAt', 'DESC']]
            });

            const userProfile = await UserProfile.findOne({ where: { UserId: req.session.userId } });

            res.render('user/home', { 
                posts, 
                formatTime, // <--- 2. Kirim Helper ke View
                userId: req.session.userId,
                userProfileId: userProfile ? userProfile.id : null
            });
        } catch (err) {
            res.send(err);
        }
    }

    static async profile(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, {
                include: { model: UserProfile, 
                    include:[
                        {
                            model: Post,
                            separate: true,
                            order: [['createdAt', 'DESC']] 
                        }
                    ]
                }
            });

            res.render('user/profile', { 
                user, 
                userId: req.session.userId, 
                isOwnProfile: req.session.userId == id 
            });
        } catch (err) {
            res.send(err);
        }
    }

    static async showEditProfile(req, res) {
    try {
        const { id } = req.params; // ID user yang mau diedit
        
        // Cari data UserProfile berdasarkan id user
        const userProfile = await UserProfile.findOne({ 
            where: { UserId: id } 
        });
        
        // Render halaman form edit, kirim datanya
        res.render('user/editProfile', { userProfile, userId: req.session.userId });
    } catch (error) {
        res.send(error);
    }
}   

// controllers/controller.js

static async updateProfile(req, res) {
    try {
        const { id } = req.params;
        // Ambil data dari form
        const { name, bio, profilePict } = req.body;

        // Update data di tabel UserProfiles
        await UserProfile.update({
            name,
            bio,
            profilePict
        }, {
            where: { UserId: id }
        });

        // Redirect kembali ke halaman profil setelah update
        res.redirect(`/user/${id}`);
    } catch (error) {
        res.send(error);
    }
}

    static async addPostForm(req, res) {
        try {
            const tags = await Tag.findAll();
            res.render('user/addPost', { userId: req.params.id, tags });
        } catch (err) {
            res.send(err);
        }
    }

    static async createPost(req, res) {
        try {
            const { posting, caption, tags } = req.body;
            const profile = await UserProfile.findOne({ where: { UserId: req.params.id } });

            const post = await Post.create({ posting, caption, UserProfileId: profile.id });

            if (tags) {
                const tagIds = Array.isArray(tags) ? tags : [tags];
                const postTagData = tagIds.map(tId => ({ PostId: post.id, TagId: tId }));
                await PostTag.bulkCreate(postTagData);
            }

            res.redirect(`/user/${req.params.id}`);
        } catch (err) {
            res.send(err);
            console.log(err);
        }
    }

    static async editPostForm(req, res) {
        try {
            const post = await Post.findByPk(req.params.idPost);
            res.render('user/editPost', { post, userId: req.params.id });
        } catch (err) {
            res.send(err);
        }
    }

    static async updatePost(req, res) {
        try {
            await Post.update({ caption: req.body.caption }, { where: { id: req.params.idPost } });
            res.redirect(`/user/${req.params.id}`);
        } catch (err) {
            res.send(err);
        }
    }

    static async searchUser(req, res) {
        try {
            const { search } = req.query;
            let option = { include: User };

            if (search) {
                option.where = {
                    name: { [Op.iLike]: `%${search}%` }
                };
            }

            const profiles = await UserProfile.findAll(option);
            res.render('user/search', { profiles, userId: req.params.id });
        } catch (err) {
            res.send(err);
        }
    }

    static async searchUserDetail(req, res) {
        try {
            const user = await User.findByPk(req.params.idUser, {
                include: { model: UserProfile,
                    include:[
                        {
                            model: Post,
                            separate: true, 
                            order: [['createdAt', 'DESC']]
                        }
                    ]
                }
            });
            res.render('user/profile', { user, isOwnProfile: false });
        } catch (err) {
            res.send(err);
        }
    }

    static async likePost(req, res) {
        try {
            if (!req.session.likedPosts) req.session.likedPosts = [];
            const { idPost } = req.params;

            if (req.session.likedPosts.includes(idPost)) {
                return res.redirect('/user/home');
            }

            const post = await Post.findByPk(idPost);
            await post.increment('like', { by: 1 });

            req.session.likedPosts.push(idPost);
            res.redirect('/user/home');
        } catch (err) {
            res.send(err);
            console.log(err);
        }
    }

    // --- ADMIN ROUTES ---

    static async adminDashboard(req, res) {
        try {
            const users = await User.findAll({ include: UserProfile,
                 order: [['createdAt', 'DESC']] 
            });
            const posts = await Post.findAll({ 
                include: UserProfile,
                order: [['createdAt', 'DESC']] 
            });
            res.render('admin/dashboard', { users, posts });
        } catch (err) {
            res.send(err);
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const profile = await UserProfile.findOne({ where: { UserId: id } });
            
            if (profile) {
                await Post.destroy({ where: { UserProfileId: profile.id } });
            }
            
            await UserProfile.destroy({ where: { UserId: id } });
            await User.destroy({ where: { id } });
            
            res.redirect('/admin');
        } catch (err) {
            res.send(err);
        }
    }

    static async deletePostAdmin(req, res) {
        try {
            await Post.destroy({ where: { id: req.params.idPost } });
            res.redirect('/admin');
        } catch (err) {
            res.send(err);
        }
    }
}

module.exports = Controller