/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB, { tls: true });

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: Array, items: { type: String }},
  commentcount: { type: Number, default: 0 }
})

const Book = mongoose.model('Book', bookSchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find().then(data => res.json(data));
    })

    .post(function (req, res){
      let title = req.body.title;
      const newBook = new Book({
        title: title
      });
      if (title){
        newBook.save().then((response) => {
          res.json({
            _id: response._id,
            title: title
          });
        });
      }else {
        res.json('missing required field title');
      };
    })

    .delete(function(req, res){
      Book.deleteMany().then(response => {
        if (response.deletedCount > 0){
          res.send('complete delete successful');
        };
      });
    });


  app.route('/api/books/:id')

    .get(function (req, res){
      let bookid = req.params.id;
      if (bookid.length != 24){
        res.json('no book exists')
      }else {
        Book.findById(bookid).then(data => {
          if (!data) {
            res.json('no book exists');
          }else {
            res.json(data)
          };
        });
      };
    })

    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment){
        res.send('missing required field comment');
      }else if (bookid.length != 24){
        res.json('no book exists')
      }else {
        Book.find({ _id: bookid }).then(data => {
          console.log(data[0])
          if (!data[0]){
            res.json('no book exists');
          }else{
          var newcommentcount = data[0].commentcount + 1
            Book.updateOne({ _id: bookid }, { $push: { comments: comment }, commentcount: newcommentcount }).then(response => {
              if (response.modifiedCount === 1){
                Book.find({ _id: bookid }).then(data => res.json(data[0]));
              }else {
                res.json('no book exists');
              }
            })
          }
        })
      }
    })

    .delete(function(req, res){
      let bookid = req.params.id;
      if (bookid.length != 24){
        res.json('no book exists');
      }else{
        Book.deleteOne({ _id: bookid }).then(response => {
          if (response.deletedCount == 1){
            res.json('delete successful');
          }else {
            res.json('no book exists');
          }
        });
      }
    });

};
