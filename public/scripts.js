$(".submit").on("click", function() {
	if($(this).parent().prev().find("form").find("input").val() !== ""){
		$(this).parent().prev().find("form").submit();
	}
});
$("#pills-tab a:first").tab("show");