/**
 * New node file for implementing all the member related operation like authentication, last login etc.
 */

var lastlogin;
function lastLoginDate(memberId) {
	var member = memberId;

	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();

	var sql1 = 'select max(lastLogindate) as lastLoginDate from login where memberId='
			+ member;
	pool.query(sql1, function(err, results1) {
		if (err) {
			console.log("ERROR: " + err.message);
			var error = err.message;
			res.render('Error.html', {
				Error : error
			});
		} else {
			var str = (results1[0].lastLoginDate);
			var str1 = new Date(str.toLocaleString());
			var date = new Date(str1);
			console.log(" new date :" + date);
			lastlogin = date;
		}
	});
	console.log("getting last login :" + lastlogin);
	return lastlogin;
};

function timeStamp() {
	var now = new Date();
	var date = [ now.getFullYear(), now.getMonth() + 1, now.getDate() ];
	var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
	for ( var i = 0; i < 3; i++) {
		if (time[i] < 10) {
			time[i] = "0" + time[i];
		}
	}
	for ( var i = 1; i < 3; i++) {
		if (date[i] < 10) {
			date[i] = "0" + date[i];
		}
	}
	return date.join("-") + " " + time.join(":");
}

function verify(req, res) {
	var a = JSON.stringify(req.body);
	var obj = JSON.parse(JSON.stringify(req.body));
	var userName = obj.userName.toString();
	console.log("username " + userName);
	var password = obj.Password.toString();
	console.log(" the pwd is:" + password);
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();

	var sqlVerify = 'select * from member where userName="' + userName
			+ '" and password= "' + password + '"';
	var str = sqlVerify.toString();
	var se = JSON.stringify(str);
	console.log("the new " + se);
	pool
			.query(
					sqlVerify,
					function(err, results) {
						if (err) {
							console.log("ERROR: " + err.message);
							var error = err.message;
							res.render('Error.html', {
								Error : error
							});
						} else if (results.length == 0) {
							console.log("came in this ");
							res.render('Error.html', {
								Error : "User not authenticated !!"
							});
						}

						else {
							console.log(results);
							console.log(results[0].memberId);
							console.log(results[0].firstName);
							req.session.memberId = results[0].memberId;
							req.session.firstName = results[0].firstName;
							var member = req.session.memberId;

							var sql1 = 'select max(lastLogindate) as lastLoginDate from login where memberId='
									+ member;
							pool.query(sql1, function(err, results1) {
								if (err) {
									console.log("ERROR: " + err.message);
									var error = err.message;
									res.render('Error.html', {
										Error : error
									});
								} else {
									var str = (results1[0].lastLoginDate);
									var str1 = new Date(str.toString());
									var date = new Date(str1);
									console.log(" new date :" + date);
									req.session.lastlogin = date;
									console.log("The session variable : "
											+ req.session.lastlogin);
								}
							});
							var dateHere = lastLoginDate(member);
							console.log(" date last login : ---" + dateHere);
							var time = timeStamp();
							var sql = 'insert into login values(null,' + member
									+ ',"' + time + '")';
							pool.query(sql, function(err, results) {
								if (err) {
									console.log("ERROR: " + err.message);
									var error = err.message;
									res.render('Error.html', {
										Error : error
									});
								} else {
									console.log("date is persisted");
								}
							});
							res.redirect('/Home');
						}
					});
}

exports.signUp = function(req, res) {
	console.log("Received the info for the signup  in the member Login!!");
	var obj = JSON.parse(JSON.stringify(req.body));
	var firstName = obj.firstName;
	var lastName = obj.lastName;
	var userName = obj.userName;
	var password = obj.password;
	var address = obj.address;
	var phone = obj.phone;
	var email = obj.email;
	var connectionPool = require('../database/connectionPooling');
	var pool = connectionPool.Pool();
	pool.connect();

	var sqlVerify = 'insert into member values(null,"' + firstName + '","'
			+ lastName + '","' + userName + '","' + password + '","' + address
			+ '","' + phone + '","' + email + '")';
	var str = sqlVerify.toString();
	console.log(str);
	pool.query(sqlVerify, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
			var error = err.message;
			res.render('Error.html', {
				Error : error
			});
		} else {
			res.render('Sign.html');
		}
	});
};

exports.verify = verify;
