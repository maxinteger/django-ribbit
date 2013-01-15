
var Util = Util || (function(){
    "use strict";
	var self = this, intf = {};


	return intf;
}());

var Page = Page || (function (){
    "use strict";
	var self = this, intf = {};

	var params = {};

	intf.set = intf.setParam = function(name, value){
		params[name] = value;
	};

	intf.get = intf.getParam = function(name, def){
		return params && params[name] || def || undefined;
	};

	return intf;
}());

(function(){
    // DJango AJAX Token
    $.ajaxSetup({
        beforeSend:function (xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });
})();

$(function (){
    "use strict";
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
        console.log([_item, params])
        $.post(url, params, function(data){
            callback();
        });
    }

    var $ribbitList = $('#id-ribbits'),
        $ribbitTemplate = $('#id-ribbit-template');

    function creteRibbit(params){
        var newRibbit = $ribbitTemplate.close().appendTo($ribbitList);
        for (var k in params){
            newRibbit.find('.'+k).text(params[k]);
        }
    }

    $('form.ajax a.save').click(function(){
        submit(this, function(data){
            $('#id-ribbit-field').val('');
            $ribbitList.prepend($(data));
        });
    });
});