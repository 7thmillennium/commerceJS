/** */
const Item = require('./../models/Item')
const Bookshelf = require('../config/bookshelf')
const fs = require('fs')

module.exports = {
    itemsGet: (req, res, next) => {
        let limit = req.query.limit || 20
        let page = req.query.page || 1
        return Item
            .query(function (qb) {
                qb.innerJoin('users', 'items.user_id', 'users.id');
                // qb.limit(limit);
            })
            .orderBy('-items.id') // Same as .orderBy('cars.productionYear', 'DESC')
            .fetchAll(
                // {
                //     columns: [
                //         'items.id',
                //         'items.title',
                //         'items.text',
                //         'items.slug',
                //         'items.description',
                //         'items.feature_img',
                //         'items.views',
                //         'items.claps',
                //         'items.created_at',
                //         'users.id as user_id',
                //         'users.name',
                //     ],
                // }
            )
            .then((items) => {
                if(!items) throw new Error;
                let data = items.toJSON();
                delete items
                // console.log(item.toJSON())
                // let temp = require('../markup/home.marko');
                // var html = temp.renderToString({ title: "Click me!" });
                res.render("item/search", {items:data})
            }).catch(function (err) {
                console.error(err);
                if (err)
                    res.send(err)
            });


    },
    itemGet: (req, res, next) => {

        if (!req.params.id && typeof req.params.id !== "number") {
            res.send(400)
        }

        Item.forge({ id: req.params.id })
            .fetch()
            .then((item) => {
                if (!item)
                    res.send(404)
                else
                    res.send(item)
                next()
            });
    }
    // commentItem: (req, res, next) => {
    //     let item_id = req.body.item_id;
    //     Item
    //         .query((qb) => {
    //             qb.where('items.id', '=', item_id);
    //         })
    //         .fetch()
    //         .then((item) => {
    //             if (!item)
    //                 res.send(404)
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
    //                         if (!comment) res.send(400)
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

}