/** */
const Item = require('./../models/Item')
const Bookshelf = require('../config/bookshelf')
var messages = require('../service/message')

module.exports = {
    itemPost: (req, res, next) => {
        let user_id = req.session.passport.user;
        let data = {
            name: req.body.name,
            info: req.body.info,
            type: req.body.type,
            category: req.body.category,
            price: req.body.price,
            social_link: req.body.social_link,
            user_id: user_id
        }
        return Item.forge(data).save()
            .then((item) => {
                if (!item){
                    res.sendStatus(404)
                } else {
                    req.flash('success', { msg: 'Your item has been created successfully.' });
                    return res.redirect(200, '/admin/items/read');
                }
            }).catch(function (err) {
                console.error(err);
                if (err)
                    res.send(err)
            });
    },
    itemUpdatePut: (req, res, next) => {
        console.log("updating item")
        let data = {
            name: req.body.name,
            info: req.body.info,
            type: req.body.type,
            category: req.body.category,
            price: req.body.price,
            social_link: req.body.social_link,
        }
        return Item.forge({id:req.params.id}).save(data, { method: "update" })
            .then((item) => {
                if (!item){
                    msg.error = "Error Updating"
                    res.sendStatus(400)
                } else {
                    req.flash('success', { msg: 'Your item has been updated successfully.' });
                    return res.redirect(200, '/admin/items/read');
                }
            }).catch(function (err) {
                console.error(err);
                if (err)
                    res.send(err)
            });
    },
    itemGet: (req, res, next) => {
        if (!req.params.id && typeof req.params.id !== "number") {
            res.sendStatus(400)
        }

        Item.forge({ id: req.params.id })
            .fetch()
            .then((item) => {
                if (!item)
                    res.sendStatus(404)
                else {
                    req.flash('success', { msg: 'Your item has been created successfully.' });
                    res.send(item)
                }
                // next()
            });

        // Item.findById(req.params.id)
        // .populate('author')
        // .populate('comments.author').exec((err, item)=> {
        //     if (err)
        //         res.send(err)
        //     else if (!item)
        //         res.sendStatus(404)
        //     else
        //         res.send(item)
        //     next()            
        // })
    },
    /**
     * item_id
     */
    likeItem: (req, res, next) => {
        return Item.forge({ id: req.body.id }).save({ like: Bookshelf.knex.raw('like + 1') }, { method: "update" })
            .then((clap) => {
                return res.json({ msg: "Done" })
            }).catch(function (err) {
                console.error(err);
                if (err) res.send(err)
            });
    },

    /**
     * comment, author_id, item_id
     */
    // commentItem: (req, res, next) => {
    //     let item_id = req.body.item_id;
    //     Item
    //         .query((qb) => {
    //             qb.where('items.id', '=', item_id);
    //         })
    //         .fetch()
    //         .then((item) => {
    //             if (!item)
    //                 res.sendStatus(404)
    //             else {
    //                 let data = null
    //                 if (req.body.comment_id) {
    //                     data = {
    //                         item_id: req.body.item_id,
    //                         user_id: req.body.author_id,
    //                         comment_id: req.body.comment_id,
    //                         text: req.body.comment
    //                     };
    //                 } else {
    //                     data = {
    //                         item_id: req.body.item_id,
    //                         user_id: req.body.author_id,
    //                         text: req.body.comment
    //                     };
    //                 }

    //                 Comments.forge(data).save()
    //                     .then((comment) => {
    //                         if (!comment) res.sendStatus(400)
    //                         else
    //                             res.send({ message: "comment saved" })
    //                     }).catch(function (err) {
    //                         console.error(err);
    //                         if (err) res.send(err)
    //                     });
    //             }
    //         }).catch((err) => {
    //             console.error(err);
    //             if (err)
    //                 res.send(err)
    //         });

    // },









    // GET PAGES
    itemCreatePage: (req, res, next) => {
        return res.render("admin/item/create", {})
    },
    itemsReadPage: (req, res, next) => {
        let user_id = req.session.passport.user;
        let limit = req.query.limit || 20
        let page = req.query.page || 1

        return Item
            .query(function (qb) {
                qb.innerJoin('users', 'items.user_id', 'users.id');
                qb.where('users.id', '=', user_id);
                // qb.groupBy('cars.id');
                // qb.limit(limit);
                // qb.offset(limit*page); // math.floor
            })
            .orderBy('-id')
            .fetchAll({
                columns: [
                    'items.id',
                    'items.name',
                    'items.info',
                    'items.type',
                    'items.category',
                    'items.price',
                    'items.social_link',
                    'items.created_at',
                    'users.id as user_id',
                    'users.name',
                ],
            }
            )
            .then((item) => {
                if (!item)
                    res.sendStatus(404)
                else
                    res.render("admin/item/list", {item:item})
            }).catch(function (err) {
                console.error(err);
                if (err)
                    res.send(err)
            });


    },
    itemReadPage: (req, res, next) => {

        if (!req.params.id && typeof req.params.id !== "number") {
            res.sendStatus(400)
        }

        Item.forge({ id: req.params.id })
            .fetch()
            .then((item) => {
                console.log("read item")
                if (!item)
                    res.sendStatus(404)
                else
                    res.render("admin/item/read", {item:item})
            });

        // Item.findById(req.params.id)
        // .populate('author')
        // .populate('comments.author').exec((err, item)=> {
        //     if (err)
        //         res.send(err)
        //     else if (!item)
        //         res.sendStatus(404)
        //     else
        //         res.send(item)
        //     next()            
        // })
    },
    itemPutPage: (req, res, next) => {

        if (!req.params.id && typeof req.params.id !== "number") {
            res.sendStatus(400)
        }

        Item.forge({ id: req.params.id })
            .fetch()
            .then((item) => {
                if (!item)
                    res.sendStatus(404)
                else
                    res.render("admin/item/update", {item:item})
            });

        // Item.findById(req.params.id)
        // .populate('author')
        // .populate('comments.author').exec((err, item)=> {
        //     if (err)
        //         res.send(err)
        //     else if (!item)
        //         res.sendStatus(404)
        //     else
        //         res.send(item)
        //     next()            
        // })
    },

    }