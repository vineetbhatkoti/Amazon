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
	$('#form1').submit(function() {
	    $.ajax({
	        url: '/submitValues',
	        type: 'post',
	        dataType: 'json',
	        data: $('#form1').serialize(),
	        success: function(data) {
	        	console.log(data);
	        	console.log("its done");
	           document.getElementById('checkout').disabled=false;
	           document.getElementById('tableSubmit').disabled=true;
	        },
	        error: function() {
	            alert("The quantity ordered was greater than that available !");
	          }
	    });
	    return false;
	});
	
});
