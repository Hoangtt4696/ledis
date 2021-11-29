$(document).ready(function(){
	$('#login-time').append(`Last login: ${new Date()}`);

  $("#cmd").focus();
	
	$(document).click(function(){
		$("#cmd").focus();
	});

  $("#cmd").keydown(e => {
		if(e.keyCode == 13){
			$("#cmd").prop('disabled', true);

			$.ajax({
				url: "/",
				type: "POST",
				data: ({ cmd: $("#cmd").val() }),
				success: response => {
          let res = '';

          if (response.success) {
            if (Array.isArray(response.data)) {
              response.data.forEach((elm, idx) => {
                res += idx + ') ' + elm + '\n';
              });
            } else {
              res = response.data;
            }
          } else {
            res = response.message;
          }

					$("#log-result").append("ledis-server > " + $("#cmd").val() + "</br><pre>" + res + "</pre>");

					$("#cmd").val("");
					$("#cmd").prop('disabled', false);
					$("#cmd").focus();
				},
			});
		}
	});
});
