
Module(function (){
    var params = {};
	this.Page = {};

	Page.setParam = function(name, value){
		params[name] = value;
	};

	Page.getParam = function(name, def){
		return params && params[name] || def || undefined;
	};
});

(function(){
    // DJango AJAX Token
    $.ajaxSetup({
        beforeSend:function (xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                xhr.setRequestHeader("X-CSRFToken", util.getCookie('csrftoken'));
            }
        }
    });
})();

$(function (){
	$('a[href^=#]').live('click', function(e){ e.preventDefault(); });

	$('#id-js-params input').each(function(){
		Page.setParam(this.name, this.value);
	});

    function submit(item, callback){
        if (!callback) return;
        var _item = $(item),
            url = _item.attr('href').substr(1),
            params = {};
        _item.closest('form.ajax').find(':input').each(function(){
            params[this.name] = $(this).val();
        });
        $.post(url, params, function(data){
            callback(data);
        });
    }

    $('#id-new-ribbit-field').change(function(){
        var _this = $(this);
        _this[!!_this.val() ? 'addClass' : 'removeClass']('changed');
    });

});