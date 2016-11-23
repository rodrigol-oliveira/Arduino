<script type="text/javascript">
jQuery(index.jade).ready(function($) { 
	$(".scroll").click(function(event){        
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 800);
	});
});
</script>