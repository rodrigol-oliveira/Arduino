//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

//função do calendário

      




$("#nextUsuario").click(function(){

	var nome = $('#nome').val();
	var sobreNome = $('#sobreNome').val();
	var email = $('#email').val();
	var novaSenha = $('#novaSenha').val();
	
	
	if(nome == "" || sobreNome == "" || email == "" || novaSenha == ""){

		alert("Por favor, preencha todos os campos");
	}

	else {


	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
	}
});



$("#nextJardim").click(function(){

	var nomeJardim = $('#nomeJardim').val();
	
	if(nomeJardim == ""){

		alert("Por favor, preencha o jardim");
	}

	else {


	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
	}
});





$(".next").click(function(){

	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});





$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".submit").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
})







/*listbox de plantas */

$(document).ready(function() {
    $('#btnRightPlanta').click(function(e) {
        var selectedOpts = $('#listBoxPlanta option:selected');
        if (selectedOpts.length == 0) {
            alert("Não é possivel mover.");
            e.preventDefault();
        }

        $('#listBoxPlantaResultado').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });

    $('#btnLeftPlanta').click(function(e) {
        var selectedOpts = $('#listBoxPlantaResultado option:selected');
        if (selectedOpts.length == 0) {
            alert("Não é possivel mover.");
            e.preventDefault();
        }

        $('#listBoxPlanta').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });

});


/*listbox dos sensores */

$(document).ready(function() {
    $('#btnRightSensores').click(function(e) {
        var selectedOpts = $('#listBoxSensores option:selected');
        if (selectedOpts.length == 0) {
            alert("Não é possivel mover.");
            e.preventDefault();
        }

        $('#listBoxSensoresResultado').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });

    $('#btnLeftSensores').click(function(e) {
        var selectedOpts = $('#listBoxSensoresResultado option:selected');
        if (selectedOpts.length == 0) {
            alert("Não é possivel mover.");
            e.preventDefault();
        }

        $('#listBoxSensores').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });
});



/*listbox de valvulas */

$(document).ready(function() {
    $('#btnRightValvulas').click(function(e) {
        var selectedOpts = $('#listBoxValvulas option:selected');
        if (selectedOpts.length == 0) {
            alert("Não é possivel mover.");
            e.preventDefault();
        }

        $('#listBoxValvulasResultado').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });

    $('#btnLeftValvulas').click(function(e) {
        var selectedOpts = $('#listBoxValvulasResultado option:selected');
        if (selectedOpts.length == 0) {
            alert("Não é possivel mover.");
            e.preventDefault();
        }

        $('#listBoxValvulas').append($(selectedOpts).clone());
        $(selectedOpts).remove();
        e.preventDefault();
    });
});

