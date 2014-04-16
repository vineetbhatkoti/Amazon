/**
 * New node file for establishing and making database request for all Home & Improvement
 * related requests
 */

exports.toolHomeAddToCart = function(request, response) {
	var k = 0;
	var pos = 0;
	var condition = true;
	console.log("receiving the values for the books !!");
	var a = JSON.stringify(request.body);
	console.log(JSON.stringify(request.body));
	var d = request.body;
	var values = new Array();
	var k = 0;
	Object.getOwnPropertyNames(d).forEach(function(val, idx, array) {
		if (d[val] == 'checked') {
			values[k] = val;
			k++;
		}
	});

	var toolHome = {};
	toolHome.toolHomeid = [];
	toolHome.Product = [];
	toolHome.ArticleName = [];
	toolHome.price = [];
	toolHome.quantity = [];
	toolHome.quantityOrder = [];
	console.log(" length of values --->" + values.length);
	var l = 0;
	for ( var m = 0; m < values.length; m++) {
		var pos1 = values[m];
		while (condition) {

			console.log("pos1 value " + pos1);
			console.log("electronics id  value " + d.toolHomeid[l]);
			if (d.toolHomeid[l] == pos1) {
				pos = l;
				console.log("found it here !! " + pos);

				condition = false;
			} else {
				l++;
			}

		}
		toolHome.toolHomeid[m] = d.toolHomeid[pos];
		toolHome.Product[m] = (d.Product[pos]);
		toolHome.ArticleName[m] = (d.ArticleName[pos]);
		toolHome.price[m] = (d.price[pos]);
		toolHome.quantity[m] = (d.quantity[pos]);
		toolHome.quantityOrder[m] = (d.quantityOrder[pos]);
		if (parseInt(toolHome.quantityOrder[m]) > parseInt(toolHome.quantity[m])) {
			console.log("Quantity Ordered" + toolHome.quantityOrder[m]);
			console.log("Quantity " + toolHome.quantity[m]);
			return new Error("The quantity entered is greater!");
		}
		condition = true;

	}

	var converted = JSON.stringify(toolHome);
	console.log("Printing final " + JSON.stringify(toolHome));
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();

	for ( var k = 0; k < values.length; k++) {
		var eId = toolHome.toolHomeid[k];
		var Product = toolHome.Product[k];
		var ArticleName = toolHome.ArticleName[k];
		var Price = parseInt(toolHome.price[k]);
		var quantity = parseInt(toolHome.quantity[k]);
		var quantityOrder = parseInt(toolHome.quantityOrder[k]);
		var totalPrice = Price * quantityOrder;
		var member = request.session.memberId;
		var sql = 'insert into cart values(' + null + ',"' + Product + '",'
				+ '"' + ArticleName + '",' + totalPrice + ',' + quantityOrder
				+ ',"Tools&Home",' + member + ',' + eId + ')';
		console.log("Query :" + sql);

		pool.query(sql, function(err, results) {
			if (err) {
				console.log("ERROR: " + err.message);
				var error = err.message;
				res.render('Error.html', {
					Error : error
				});
			} else {

				console.log("inserted into the cart !!");
			}

		});

		var quantityRemain = quantity - quantityOrder;
		var sql1 = 'Update toolshome SET quantity=' + quantityRemain
				+ ' where toolHomeid=' + eId;
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

exports.removeFromToolHomeCart = function(req, res) {
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
			var sqlReturnProduct = 'Update toolshome SET quantity=quantity+'
					+ results[0].quantityOrder + ' where toolHomeid='
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

	var sql = 'select * from toolsHome';
	pool.query(sql, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
		res.render('ToolHome.html', {
			title : "Tools & Home Improvement !!",
			ToolHomeResults : results
		});

	});

};