/*
 * GET home page. This file is used to route all the request to various other channels based on the request type.
 */

function errorQuantity(req, res) {
	res.render('Electronics.html', {
		error : "The quantity entered is greater!!"
	});

}

//Cart

exports.cart = function(req, res) {
	var CartDisplay = require('../database/catalog');
	CartDisplay.CartDisplay(req, res);

};

// Movies Music Games
exports.MoviesMusicGames = function(req, res) {
	var MoviesMusicGamesRetrieve = require('../database/MoviesMusicGames');
	MoviesMusicGamesRetrieve.retrieve(req, res);

};

exports.MMMAddToCart = function(request, response) {
	console.log("adding to the music cart --------------->>");
	var mmmCart = require('../database/MoviesMusicGames');
	mmmCart.MMMAddToCart(request, response);

};

exports.removeMMMCartItem = function(req, res) {
	var a = JSON.stringify(req.body);
	console.log("the cart id --------:" + a);
	var removemmmHomeFrmCart = require('../database/MoviesMusicGames');
	removemmmHomeFrmCart.removemmmHomeFrmCart(req, res);

};

// Tools & Home Improvement
exports.removeToolHomeItem = function(req, res) {
	var a = JSON.stringify(req.body);
	console.log("the cart id --------:" + a);
	var removeToolHomeFrmCart = require('../database/toolsHomeImprovement');
	removeToolHomeFrmCart.removeFromToolHomeCart(req, res);

};
exports.toolHomeAddToCart = function(request, response) {
	var toolsHome = require('../database/toolsHomeImprovement');
	toolsHome.toolHomeAddToCart(request, response);

};

exports.ToolsHomeImprovement = function(req, res) {
	var toolsHomeRetrieve = require('../database/toolsHomeImprovement');
	toolsHomeRetrieve.retrieve(req, res);

};

// Books 
exports.removeBookItem = function(req, res) {

	var a = JSON.stringify(req.body);
	console.log("the cart id --------:" + a);
	var removeBookFrmCart = require('../database/books');
	removeBookFrmCart.removeFromBookCart(req, res);
};

exports.books = function(req, res) {
	var booksRetrieve = require('../database/books');
	booksRetrieve.retrieve(req, res);

};

exports.booksAddToCart = function(request, response) {
	var bookAddCart = require('../database/books');
	bookAddCart.booksAddToCart(request, response);

};

//Electronics 
exports.payment = function(req, res) {
	var obj = JSON.parse(JSON.stringify(req.body));
	var cardNumber = obj.cardNumber.toString();
	console.log(" the card number : " + cardNumber);
	console.log(" the card number len: " + cardNumber.length);
	var number = parseInt(cardNumber);
	if ((cardNumber.length != 16) || ((isNaN(number) == true))) {
		res.render('PaymentDetails.html', {
			message : "Card number is not valid"
		});
	}

	else {

		var OrderElec = require('../database/catalog');
		OrderElec.paymentAndOrder(req, res);
	}

};

exports.logout = function(req, res) {
	console.log("Destroying the sesison !! Bye :)");
	req.session.destroy();
	res.render("Sign.html");

};
exports.paymentGate = function(req, res) {
	res.render('PaymentDetails.html');

};
exports.removeElecItem = function(req, res) {
	var a = JSON.stringify(req.body);
	console.log("the cart id --------:" + a);
	var removeElecFrmCart = require('../database/catalog');
	removeElecFrmCart.removeFromElecCart(req, res);
};

exports.signUpCheck = function(request, response) {
	console.log("Received the info for the signup !!");
	var a = JSON.stringify(request.body);
	console.log(a);
	var member = require('../database/memberLogin');
	member.signUp(request, response);

};

exports.signUp = function(request, response) {
	console.log(" redirecting the url");
	response.render('SignUp.html');

};

exports.SignIn = function(request, resposnce) {
	console.log("Signing in get the useename and pwd!!");
	var a = JSON.stringify(request.body);
	console.log(JSON.stringify(request.body));
	var member = require('../database/memberLogin');
	member.verify(request, resposnce);

};

exports.sign = function(req, res) {

	res.render('Sign.html');
};

exports.index = function(req, res) {

	var catalog = [ {
		"catalogid" : 1,
		"catalogName" : "Electronics",
		"url" : "/img/Electronics.jpg"
	}, {
		"catalogid" : 2,
		"catalogName" : "Books",
		"url" : "/img/book.jpg"
	}, {
		"catalogid" : 3,
		"catalogName" : "Tools&Home_Improvement",
		"url" : "/img/toolshome.jpg"
	}, {
		"catalogid" : 4,
		"catalogName" : "Movies,Music&Games",
		"url" : "/img/gamesmusic.jpg"
	} ];

	var date1 = new Date(req.session.lastlogin);
	console.log("The date ------------------------------>>" + date1);
	console.log("The session id is ----------->> " + req.sessionID);
	var first = req.session.firstName;
	res.render('Catalog.html', {
		title : "Catalog !!",
		catalog : catalog,
		logindate : date1,
		firstName : first
	});

};

exports.electronics = function(req, res) {
	var powerlevel = require('../database/catalog');
	powerlevel.retrieve(req, res);

};

exports.electronicsAddToCart = function(request, response) {
	console.log("receiving the values!!");
	var a = JSON.stringify(request.body);
	console.log(JSON.stringify(request.body));

	var powerlevel = require('../database/catalog');
	powerlevel.insertInCart(request, response);

};