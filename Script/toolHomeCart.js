/**
 * New node file
 */
$(document).ready(function () {
	
	$('.button').click(function(){
		 var a= $(this).attr('id');
		 $('#'+a).remove();
        $.ajax({
            type : 'POST',
            url : '/removeToolCartItem',
            data : "RemoveId=" + a,
            dataType : 'json',
            success : function(data) {
            	
            	alert("the call happened !!"+data);
            },
            error : function(data) {
                setError('Make call failed');
            }
        });
        return false;
    });

});
	