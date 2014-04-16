/**
 * New node file for establishing and making database request for all
 * electronics related requests
 */

function insertInCart(request, response) {
	var d = request.body;
	var values = new Array();
	var pos = 0;
	var k = 0;
	var condition = true;
	Object.getOwnPropertyNames(d).forEach(function(val, idx, array) {
		if (d[val] == 'checked') {
			values[k] = val;
			k++;
		}

	});
	var electronics = {};
	electronics.electronicsId = [];
	electronics.Product = [];
	electronics.Description = [];
	electronics.price = [];
	electronics.quantity = [];
	electronics.quantityOrder = [];
	console.log(" length of values --->" + values.length);
	var l = 0;
	for ( var m = 0; m < values.length; m++) {
		var pos1 = values[m];
		while (condition) {

			console.log("pos1 value " + pos1);
			console.log("electronics id  value " + d.electronicsId[l]);
			if (d.electronicsId[l] == pos1) {
				pos = l;
				console.log("found it here !! " + pos);

				condition = false;
			} else {
				l++;
			}

		}
		electronics.electronicsId[m] = d.electronicsId[pos];
		electronics.Product[m] = (d.Product[pos]);
		electronics.Description[m] = (d.Description[pos]);
		electronics.price[m] = (d.price[pos]);
		electronics.quantity[m] = (d.quantity[pos]);
		electronics.quantityOrder[m] = (d.quantityOrder[pos]);
		if (parseInt(electronics.quantityOrder[m]) > parseInt(electronics.quantity[m])) {
			console.log("Quantity Ordered" + electronics.quantityOrder[m]);
			console.log("Quantity " + electronics.quantity[m]);
			return new Error("The quantity entered is greater!");
		}

		condition = true;
	}
	var a = JSON.stringify(electronics);
	console.log("the json formed" + JSON.stringify(electronics));
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();
	for ( var k = 0; k < values.length; k++) {
		var eId = electronics.electronicsId[k];
		var Product = electronics.Product[k];
		var Description = electronics.Description[k];
		var Price = parseInt(electronics.price[k]);
		var quantityOrder = parseInt(electronics.quantityOrder[k]);
		var quantity = parseInt(electronics.quantity[k]);
		var totalPrice = Price * quantityOrder;
		var member = request.session.memberId;
		var sql = 'insert into cart values(' + null + ',"' + Product + '",'
				+ '"' + Description + '",' + totalPrice + ',' + quantityOrder
				+ ',"Electronics",' + member + ',' + eId + ')';
		console.log("Query :" + sql);

		pool.query(sql, function(err, results) {
			if (err) {
				console.log("ERROR: " + err.message);
				var error = err.message;
				response.render('Error.html', {
					Error : error
				});
			} else {

				console.log(" inserted into cart !!");

			}
		});

		var quantityRemain = quantity - quantityOrder;
		console.log("------------->quantityRemain" + quantityRemain);
		var sql1 = 'Update electronics SET quantity=' + quantityRemain
				+ ' where electronicsId=' + eId;
		console.log(" Updating the quantity" + sql1);
		pool.query(sql1, function(err, results) {
			if (err) {
				console.log("ERROR: " + err.message);
			}
			console.log("Updated the Electronics table");
		});
	}
	response.send(request.body);
}

function CartDisplay(req, res) {
	console.log("fectching the whole cart ");
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();
	var member = req.session.memberId;
	console.log("The memeber id is ------>>" + req.session.memberId);
	var sql = 'select * from cart where memberId=' + member;
	pool.query(sql, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
		res.render('Cart.html', {
			title : "Cart !!",
			CartResults : results
		});
	});

}

function paymentAndOrder(req, res) {
	var obj = JSON.parse(JSON.stringify(req.body));
	console.log(obj);
	console.log("mem id" + req.session.memberId);
	console.log("card no " + obj.cardNumber);
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();
	var member = req.session.memberId;
	console.log("The memeber id is ------>>" + req.session.memberId);
	var sql = 'select * from cart where memberId=' + member;
	pool.query(sql, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
		var count = Object.keys(results).length;
		console.log(count);
		for ( var i = 0; i < count; i++) {
			var cartid = results[i].cartid;
			var Product = results[i].Product;
			var description = results[i].description;
			var totalPrice = results[i].totalPrice;
			var quantity = results[i].quantityOrder;
			var catalog = results[i].catalog;
			var memberId = results[i].memberId;
			var cardNumber = obj.cardNumber.toString();
			var sql = 'insert into ordertab values(null,"' + Product + '","'
					+ description + '",' + totalPrice + ',' + quantity + ','
					+ memberId + ',"' + cardNumber + '")';
			console.log("The sql " + sql);
			pool.query(sql, function(err, results) {
				if (err) {
					console.log("ERROR: " + err.message);
				}
			});
			var sql1 = 'Delete from cart where cartid=' + cartid;
			console.log("Deleting the SQL is : " + sql1);
			pool.query(sql1, function(err, results) {
				if (err) {
					console.log("ERROR: " + err.message);
				}

			});
		}

	});
	res.render('Thanks.html');
}

function retrieve(req, res) {
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();
	var sql = 'select * from electronics';
	pool.query(sql, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
		res.render('Electronics.html', {
			title : "Electronics !!",
			ElectrnicsResults : results
		});
	});
}

function removeFromElecCart(req, res) {
	var a = JSON.stringify(req.body);
	var json = JSON.parse(a);
	var b = json["RemoveId"];
	console.log("the value  of id :" + b);
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();
	var sqlSelect = 'select quantityOrder,productid,catalog from cart where cartid='
			+ parseInt(b);
	pool
			.query(
					sqlSelect,
					function(err, results) {
						if (err) {
							console.log("ERROR: " + err.message);
						} else {
							console.log(" ->>>>>>>>>>>>>>>>"
									+ results[0].catalog);
							if (results[0].catalog == 'Electronics') {
								console
										.log("it is Electronics !!------------------------->>");
								var sqlReturnProduct = 'Update electronics SET quantity=quantity+'
										+ results[0].quantityOrder
										+ ' where electronicsId='
										+ results[0].productid;
								console.log(" back :" + sqlReturnProduct);
								console.log("Results.quantity and id  "
										+ results[0].quantityOrder
										+ " prid id: " + results[0].productid);
								pool.query(sqlReturnProduct, function(err,
										results) {
									if (err) {
										console.log("ERROR: " + err.message);
									}
									console.log("Added the quantity back ");
								});
							}

							if (results[0].catalog == 'Books') {
								console
										.log("it is  Books  !!------------------------->>");
								var sqlReturnProduct = 'Update books SET quantity=quantity+'
										+ results[0].quantityOrder
										+ ' where bookid='
										+ results[0].productid;
								console.log(" back :" + sqlReturnProduct);
								console.log("Results.quantity and id  "
										+ results[0].quantityOrder
										+ " prid id: " + results[0].productid);
								pool.query(sqlReturnProduct, function(err,
										results) {
									if (err) {
										console.log("ERROR: " + err.message);
									}
									console.log("Added the quantity back ");
								});
							}

							if (results[0].catalog == 'Tools&Home') {
								console
										.log("it is  Tools Home  !!------------------------->>");
								var sqlReturnProduct = 'Update toolshome SET quantity=quantity+'
										+ results[0].quantityOrder
										+ ' where toolHomeid='
										+ results[0].productid;
								console.log(" back :" + sqlReturnProduct);
								console.log("Results.quantity and id  "
										+ results[0].quantityOrder
										+ " prid id: " + results[0].productid);
								pool.query(sqlReturnProduct, function(err,
										results) {
									if (err) {
										console.log("ERROR: " + err.message);
									}
									console.log("Added the quantity back ");
								});

							}

							if (results[0].catalog == 'MusicMovies&Games') {
								console
										.log("it is  Tools movies music   !!------------------------->>");
								var sqlReturnProduct = 'Update musicmoviesgames SET quantity=quantity+'
										+ results[0].quantityOrder
										+ ' where mmgid='
										+ results[0].productid;
								console.log(" back :" + sqlReturnProduct);
								console.log("Results.quantity and id  "
										+ results[0].quantityOrder
										+ " prid id: " + results[0].productid);
								pool.query(sqlReturnProduct, function(err,
										results) {
									if (err) {
										console.log("ERROR: " + err.message);
									}
									console.log("Added the quantity back ");
								});
							}
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

}

exports.insertInCart = insertInCart;
exports.CartDisplay = CartDisplay;
exports.paymentAndOrder = paymentAndOrder;
exports.removeFromElecCart = removeFromElecCart;
exports.retrieve = retrieve;
