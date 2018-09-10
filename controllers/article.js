/** */
const Article = require('./../models/Article')
const Comments = require('./../models/Comments')
// const Bookshelf = require('bookshelf')
const Bookshelf = require('../config/bookshelf')
const User = require('./../models/User')
const fs = require('fs')
const cloudinary = require('cloudinary')

module.exports = {
    addArticleBACK: (req, res, next) => {
        let { text, title, claps, description } = req.body
        //let obj = { text, title, claps, description, feature_img: _feature_img != null ? `/uploads/${_filename}` : '' }
        if (req.files.image) {
            cloudinary.uploader.upload(req.files.image.path, (result) => {
                let obj = { text, title, claps, description, feature_img: result.url != null ? result.url : '' }
                saveArticle(obj)
                /*(new Student({...{url: result.url},...req.body})).save((err, newStudent) => {
                const cloud_res = {
                    url: result.url
                }
                const newS = newStudent.toObject()
                console.log({...{url: result.url},...req.body})
                if(err)
                    res.send(err)
                else if (!newStudent)
                    res.send(400)
                else
                    res.send({...newS,...cloud_res})
                next()
            })*/
            }, {
                    resource_type: 'image',
                    eager: [
                        { effect: 'sepia' }
                    ]
                })
        } else {
            saveArticle({ text, title, claps, description, feature_img: '' })
        }
        function saveArticle(obj) {
            new Article(obj).save((err, article) => {
                if (err)
                    res.send(err)
                else if (!article)
                    res.send(400)
                else {
                    return article.addAuthor(req.body.author_id).then((_article) => {
                        return res.send(_article)
                    })
                }
            })
        }
        /*let base64Data = null
        const _feature_img = req.body.feature_img
        _feature_img != null ? base64Data = _feature_img.replace(/^data:image\/png;base64,/, "") : null
        const _filename = `medium-clone-${Date.now()}.png`;

        let { text, title, claps, description } = req.body
        let obj = { text, title, claps, description, feature_img: _feature_img != null ? `/uploads/${_filename}` : '' }

        fs.writeFile(`/uploads/${_filename}`, base64Data, 'base64', function(err) {
            if(err)
                console.log(err)
            new Article(obj).save((err, article) => {
                if (err)
                    res.send(err)
                else if (!article)
                    res.send(400)
                else {
                    return article.addAuthor(req.body.author_id).then((_article) => {
                        return res.send(_article)
                    })
                }
                next()
            })
        })*/
        /*new Article(obj).save((err, article) => {
            if (err)
                res.send(err)
            else if (!article)
                res.send(400)
            else {
                return article.addAuthor(req.body.author_id).then((_article) => {
                    return res.send(_article)
                })
            }
            next()
        })*/

        /*var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads')
            },
            filename: function () {
                callback(null, )
            }
        })
        var upload = multer({
            storage: storage
        }).single('userFile')
        upload(req, res, function(err) {
        })*/
    },
    addArticle: (req, res, next) => {
        let data = {
            title: req.body.title,
            text: req.body.text,
            slug: req.body.title,
            description: req.body.description,
            feature_img: req.body.title,
            user_id: 1,
        }
        return Article.forge(data).save()
            .then((article) => {
                // console.log(article.toJSON())
                if (!article)
                    res.send(404)
                else
                    res.send(article)
            }).catch(function (err) {
                console.error(err);
                if (err)
                    res.send(err)
            });
    },
    getAll: (req, res, next) => {
        let limit = req.query.limit || 20
        let page = req.query.page || 1
        return Article
            .query(function (qb) {
                qb.innerJoin('users', 'articles.user_id', 'users.id');
                // qb.innerJoin('manufacturers', 'cars.manufacturer_id', 'manufacturers.id');
                // qb.groupBy('cars.id');
                // qb.where('manufacturers.country', '=', 'Sweden');
                qb.limit(limit);
                // qb.offset(limit*page); // math.floor
            })
            .orderBy('-id') // Same as .orderBy('cars.productionYear', 'DESC')
            .fetchAll({
                // withRelated: 'users', 
                columns: [
                    'articles.id',
                    'articles.title',
                    'articles.text',
                    'articles.slug',
                    'articles.description',
                    'articles.feature_img',
                    'articles.views',
                    'articles.claps',
                    'articles.created_at',
                    'users.id as user_id',
                    'users.name',
                ],
            }
            )
            .then((article) => {
                // console.log(article.toJSON())
                if (!article)
                    res.send(404)
                else
                    res.send(article)
            }).catch(function (err) {
                console.error(err);
                if (err)
                    res.send(err)
            });


    },

    /**
     * article_id
     */
    clapArticle: (req, res, next) => {
        return Article.forge({ id: req.body.id }).save({ claps: Bookshelf.knex.raw('claps + 1') }, { method: "update" })
            .then((clap) => {
                return res.json({ msg: "Done" })
            }).catch(function (err) {
                console.error(err);
                if (err) res.send(err)
            });
    },

    /**
     * comment, author_id, article_id
     */
    commentArticle: (req, res, next) => {
        let article_id = req.body.article_id;
        Article
            .query((qb) => {
                qb.where('articles.id', '=', article_id);
            })
            .fetch()
            .then((article) => {
                if (!article)
                    res.send(404)
                else {
                    let data = null
                    if (req.body.comment_id){
                        data = {
                            article_id: req.body.article_id,
                            user_id: req.body.author_id,
                            comment_id: req.body.comment_id,
                            text: req.body.comment
                        };
                    } else {
                        data = {
                            article_id: req.body.article_id,
                            user_id: req.body.author_id,
                            text: req.body.comment
                        };
                    }

                    Comments.forge(data).save()
                        .then((comment) => {
                            if (!comment) res.send(400)
                            else
                                res.send({ message: "comment saved" })
                        }).catch(function (err) {
                            console.error(err);
                            if (err) res.send(err)
                        });
                }
            }).catch((err) => {
                console.error(err);
                if (err)
                    res.send(err)
            });

    },

    /**
     * article_id
     */
    getArticle: (req, res, next) => {
        // Article.findById(req.params.id)
        // .populate('author')
        // .populate('comments.author').exec((err, article)=> {
        //     if (err)
        //         res.send(err)
        //     else if (!article)
        //         res.send(404)
        //     else
        //         res.send(article)
        //     next()            
        // })
    }
}