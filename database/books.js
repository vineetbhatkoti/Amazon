/**
 * New node file for establishing and making database request for all books
 * related requests
 */

exports.booksAddToCart = function(request, response) {

	console.log("receiving the values for the books !!");
	var a = JSON.stringify(request.body);
	console.log(" Here is the request !! " + JSON.stringify(request.body));
	var d = request.body;
	var values = new Array();
	var k = 0;
	var pos = 0;
	var condition = true;
	Object.getOwnPropertyNames(d).forEach(function(val, idx, array) {
		if (d[val] == 'checked') {
			values[k] = val;
			k++;
		}
	});

	var books = {};
	books.bookid = [];
	books.Product = [];
	books.bookName = [];
	books.price = [];
	books.quantity = [];
	books.quantityOrder = [];

	console.log(" length of values --->" + values.length);
	var l = 0;
	for ( var m = 0; m < values.length; m++) {
		var pos1 = values[m];
		while (condition) {

			console.log("pos1 value " + pos1);
			console.log("electronics id  value " + d.bookid[l]);
			if (d.bookid[l] == pos1) {
				pos = l;
				console.log("found it here !! " + pos);

				condition = false;
			} else {
				l++;
			}

		}
		books.bookid[m] = d.bookid[pos];
		books.Product[m] = (d.Product[pos]);
		books.bookName[m] = (d.bookName[pos]);
		books.price[m] = (d.price[pos]);
		books.quantity[m] = (d.quantity[pos]);
		books.quantityOrder[m] = (d.quantityOrder[pos]);
		if (parseInt(books.quantityOrder[m]) > parseInt(books.quantity[m])) {
			console.log("Quantity Ordered" + books.quantityOrder[m]);
			console.log("Quantity " + books.quantity[m]);
			return new Error("The quantity entered is greater!");

		}
		condition = true;
	}
	var converted = JSON.stringify(books);
	console.log("Printing final " + JSON.stringify(books));
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();

	for ( var k = 0; k < values.length; k++) {
		var eId = books.bookid[k];
		var Product = books.Product[k];
		var bookName = books.bookName[k];
		var Price = parseInt(books.price[k]);
		var quantity = parseInt(books.quantity[k]);
		var quantityOrder = parseInt(books.quantityOrder[k]);
		var totalPrice = Price * quantityOrder;
		var member = request.session.memberId;

		var sql = 'insert into cart values(' + null + ',"' + Product + '",'
				+ '"' + bookName + '",' + totalPrice + ',' + quantityOrder
				+ ',"Books",' + member + ',' + eId + ')';
		console.log("Query :" + sql);

		pool.query(sql, function(err, results) {
			if (err) {
				console.log("ERROR: " + err.message);
				var error = err.message;
				res.render('Error.html', {
					Error : error
				});
			} else {
				console.log("inserted all the books in cart !!");

			}

		});

		var quantityRemain = quantity - quantityOrder;
		var sql1 = 'Update books SET quantity=' + quantityRemain
				+ ' where bookid=' + eId;
		console.log(" Updating the quantity" + sql1);
		pool.query(sql1, function(err, results) {
			if (err) {
				console.log("ERROR: " + err.message);
			}
			console.log("Updated the Book table");
		});
	}
	response.send(request.body);

};

exports.removeFromBookCart = function(req, res) {
	var mysql = require('mysql');
	var a = JSON.stringify(req.body);
	var json = JSON.parse(a);
	var b = json["RemoveId"];
	console.log("the value  of id :" + b);
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();
	var sqlSelect = 'select quantityOrder,productid from cart where cartid='
			+ parseInt(b);
	pool.query(sqlSelect, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		} else {
			var sqlReturnProduct = 'Update books SET quantity=quantity+'
					+ results[0].quantityOrder + ' where bookid='
					+ results[0].productid;
			console.log(" back :" + sqlReturnProduct);
			console.log("Results.quantity and id  " + results[0].quantityOrder
					+ " prid id: " + results[0].productid);
			pool.query(sqlReturnProduct, function(err, results) {
				if (err) {
					console.log("ERROR: " + err.message);
				}
				console.log("Added the quantity back ");
			});
		}
	});

	var sql = 'delete from cart where cartid=' + parseInt(b);
	console.log(a);
	pool.query(sql, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log("succcessfully removed the item from cart.");
		console.log("Return value of id " + parseInt(b));
		res.send(parseInt(b));

	});

};

exports.retrieve = function(req, res) {
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();
	var sql = 'select * from books';
	pool.query(sql, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
		res.render('Books.html', {
			title : "Books !!",
			BooksResults : results
		});
	});

};