/**
 * New node file for establishing and making database request for all music,
 * movies and games
 */

exports.MMMAddToCart = function(request, response) {
	console.log("receiving the values for the books !!");
	var a = JSON.stringify(request.body);
	console.log(JSON.stringify(request.body));
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

	var MMM = {};
	MMM.mmgid = [];
	MMM.Product = [];
	MMM.ArticleName = [];
	MMM.price = [];
	MMM.quantity = [];
	MMM.quantityOrder = [];

	console.log(" length of values --->" + values.length);
	var l = 0;
	for ( var m = 0; m < values.length; m++) {
		var pos1 = values[m];
		while (condition) {

			console.log("pos1 value " + pos1);
			console.log("electronics id  value " + d.mmgid[l]);
			if (d.mmgid[l] == pos1) {
				pos = l;
				console.log("found it here !! " + pos);

				condition = false;
			} else {
				l++;
			}

		}
		MMM.mmgid[m] = d.mmgid[pos];
		MMM.Product[m] = (d.Product[pos]);
		MMM.ArticleName[m] = (d.ArticleName[pos]);
		MMM.price[m] = (d.price[pos]);
		MMM.quantity[m] = (d.quantity[pos]);
		MMM.quantityOrder[m] = (d.quantityOrder[pos]);
		if (parseInt(MMM.quantityOrder[m]) > parseInt(MMM.quantity[m])) {
			console.log("Quantity Ordered" + MMM.quantityOrder[m]);
			console.log("Quantity " + MMM.quantity[m]);
			return new Error("The quantity entered is greater!");
		}

		condition = true;

	}

	var converted = JSON.stringify(MMM);
	console.log("Printing final " + JSON.stringify(MMM));
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();

	for ( var k = 0; k < values.length; k++) {
		var mmgId = MMM.mmgid[k];
		var Product = MMM.Product[k];
		var ArticleName = MMM.ArticleName[k];
		var Price = parseInt(MMM.price[k]);
		var quantity = parseInt(MMM.quantity[k]);
		var quantityOrder = parseInt(MMM.quantityOrder[k]);
		var totalPrice = Price * quantityOrder;
		var member = request.session.memberId;
		var sql = 'insert into cart values(' + null + ',"' + Product + '",'
				+ '"' + ArticleName + '",' + totalPrice + ',' + quantityOrder
				+ ',"MusicMovies&Games",' + member + ',' + mmgId + ')';
		console.log("Query :" + sql);

		pool.query(sql, function(err, results) {
			if (err) {
				console.log("ERROR: " + err.message);
				var error = err.message;
				res.render('Error.html', {
					Error : error
				});
			} else {
				console.log("Inserted into the cart !!");

			}

		});

		var quantityRemain = quantity - quantityOrder;
		var sql1 = 'Update musicmoviesgames SET quantity=' + quantityRemain
				+ ' where mmgid=' + mmgId;
		console.log(" Updating the quantity" + sql1);
		pool.query(sql1, function(err, results) {
			if (err) {
				console.log("ERROR: " + err.message);
			}
			console.log("Updated the toolshome table");

		});

	}
	response.send(request.body);

};

exports.removemmmHomeFrmCart = function(req, res) {
	var a = JSON.stringify(req.body);
	var json = JSON.parse(a);
	var b = json["RemoveId"];
	console.log("the value  of id :" + b);
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();

	var sqlSelect = 'select quantityOrder,productid from cart where cartid='
			+ parseInt(b);
	pool
			.query(
					sqlSelect,
					function(err, results) {
						if (err) {
							console.log("ERROR: " + err.message);
						} else {
							var sqlReturnProduct = 'Update musicmoviesgames SET quantity=quantity+'
									+ results[0].quantityOrder
									+ ' where mmgid=' + results[0].productid;
							console.log(" back :" + sqlReturnProduct);
							console.log("Results.quantity and id  "
									+ results[0].quantityOrder + " prid id: "
									+ results[0].productid);
							pool
									.query(
											sqlReturnProduct,
											function(err, results) {
												if (err) {
													console.log("ERROR: "
															+ err.message);
												}
												console
														.log("Added the quantity back ");
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

	var sql = 'select * from musicmoviesgames';
	pool.query(sql, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
		res.render('MoviesMusicGames.html', {
			title : "Movies Music & Games  !!",
			MoviesMusicGamesHomeResults : results
		});

	});

};