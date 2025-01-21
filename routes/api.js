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
      //top book add
      //top comment add
      //bottom book add
      //load books
      console.log(1)
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find().then(data => res.json( data ));
    })
    
    .post(function (req, res){
      //top book add
      //bottom book add
      console.log(2)
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
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
      //delete all
      console.log(3)
      //if successful response will be 'complete delete successful'
      Book.deleteMany().then(response => {
        if (response.deletedCount > 0){
          res.send('complete delete successful');
        };
      });
    });


  app.route('/api/books/:id')

    .get(function (req, res){
      //show comments #
      console.log(4)
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.find({ _id: bookid }).then(data => {
        console.log(data)
        if (data) {
          res.json({
            title: data.title,
            _id: data._id,
            comments: data.comments 
          });
        }else {
          res.json('no book exists');
        };
      });
    })
    
    .post(function(req, res){
      //top comment add
      //bottom comment add #
      console.log(5)
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment){
        res.send('missing required field comment');
      }else {
        Book.updateOne({ _id: bookid }, { $push: { comments: comment } }).then(response => {
          if (response.modifiedCount === 1){
            Book.find({ _id: bookid }, { _id: 1, title: 1, comments: 1 }).then(data => res.json( data ));
          }else {
            res.send('no book exists');
          }
        });
      }
    })
    
    .delete(function(req, res){
      //delete one #
      console.log(6)
      let bookid = req.params.id;
      console.log(bookid)
      //if successful response will be 'delete successful'
      Book.deleteOne({ _id: bookid }).then(response => {
        if (response.deletedCount == 1){
          res.send('delete successful');
        }else {
          res.send('no book exists');
        }
      });
    });
  
};
