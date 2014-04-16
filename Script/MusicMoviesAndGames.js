/**
 * New node file
 */
function init() {

		if (!document.getElementById) return;

		var submitObj = document.getElementById('checkout');
		submitObj.disabled = true;
	}
	
$(document).ready(function () {
	init();	
	$('#form2').submit(function() {
	    $.ajax({
	        url: '/submitValuesMusicMoviesGames',
	        type: 'post',
	        dataType: 'json',
	        data: $('#form2').serialize(),
	        success: function(data) {
	        	console.log("its done");
	           document.getElementById('checkout').disabled=false;
	           document.getElementById('tableSubmit').disabled=true;
	        }
	    });
	    return false;
	});
});
