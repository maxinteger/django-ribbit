function log () { var a = arguments; return console.log(a.length > 1 ? a : a[0]), a[0]; };


var DEBUG = true;

var KEYCODE = {
	enter	: 13,
	escape	: 27
}

/* Prototypes */
	String.prototype.reverse = ( String.prototype.reverse || function() {
		return this.split('').reverse().join('');
	});

	String.prototype.times = ( String.prototype.times || function(n) {
		return Array((n || 0) + 1).join(this);
	});

	String.prototype.pad = (String.prototype.pad || function(length, character, align){
		var p = (character || ' ').times((this.length > length) ? 0 : length - this.length);
		return ('left' == align ? p : '') + this.substr(0, length) + ('left' != align ? p : '');
	});

	/**
	 * String truncate
	 *
	 * @param {Object} length		Character number limit where cut the string
	 * @param {Object} wholeWord	Not split word default: false
	 * @param {Object} closeString	Close string default: '...'
	 */
	String.prototype.truncate = (function(length, wholeWord, closeString){
		length = parseInt(length) || Infinity; closeString = closeString || '...';
		return (this.length <= length) ? this.toString() : (this.substr(0, wholeWord ? this.indexOf(" ", length) : length - closeString.length) + closeString);
	});

	String.prototype.html2text = function() {
		return this.replace(/<br\s*\/?>/ig, '\n').replace(/&nbsp;/g, ' ');
	};
	String.prototype.text2html = function() {
		return this.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
	}

/* Utiles */

	is = function (obj, type) {
		var cls = Object.prototype.toString.call(obj).slice(8, -1);
		return type ? (obj !== undefined && obj !== null && cls === type) : cls;
	};

	function getCookie(key){
		if (key){
			var value = (document.cookie.match(RegExp('(?:^|;)\\s*' + key + '\\s*=([^;]*)(?:;|$)')) || [])[1];
			return value ? unescape(value) : value;
		} else {
			var items = document.cookie.split(';'), out = {};
			for (i = items.length-1; i >= 0; i--){
				var item = items[i].split('=');
				out[item[0]] = unescape(item[1]);
			}
			return out;
		}
	}

	function setCookie(key, value, exdays) {
		var exdate = new Date();
		document.cookie = [key, "=", escape(value), ((!exdays) ? "" : "; expires="+((exdate.setDate(exdate.getDate() + exdays), exdate).toUTCString())), "; path=/"].join('');
	}

/** $.expandSize -- Resize element to (example: textarea) fullsize without scrollbar*/
	;(function( $ ) {
		$.fn.expandSize = function(){
			return this.each(function(){
				$(this).height(this.scrollHeight);
				$(this).width(this.scrollWidth);
			})
		}
	})(jQuery);

/** $.inlineEdit -- Inline text editor */
	;(function( $ ) {
		$.fn.inlineEdit = function(options){
			var opt = $.extend(options, {
					multiline			: true,
					ingnoreCssParams	: [],
					editorClass			: '',
					okLabel				: 'Ok',
					cancelLabel			: 'Cancel'
				}),

				editor = $(['<div class="inline-texteditor">',
							'<textarea class="box-sizing"></textarea>',
							'<div class="buttons">',
								'<a class="button-ok" href="#ok"></a><a class="button-cancel" href="#cancel"></a>',
							'</div>',
						'</div>'].join('')),

				_this = this,
				elm = _this.first(),
				elmIsInput = elm.is(':input'),
				oldText = elmIsInput ? elm.val() : elm.html(),
				tarea = editor.find('textarea');

			editor.addClass(opt.editorClass);

			function close(saved){
				editor.remove();
				elm.show();
				elm.trigger('inlineedit_end', [!!saved]);
			}

			function cancel(){
				elm.trigger('inlineedit_cancel');
				close(false);
			}

			function save(){
				if(elmIsInput){
					elm.val(tarea.val())
				} else {
					elm.html(tarea.val().text2html());
				}
				elm.trigger('inlineedit_save');
				close(true);
			}

			tarea.on({
				blur : save,
				keyup : function(){
					tarea.expandSize();
				},
				keydown : function(e){
					if (e.which == KEYCODE.escape) cancel();
				}
			});
			editor.find('.button-ok').text(opt.okLabel).click(save);
			editor.find('.button-cancel').text(opt.cancelLabel).click(cancel);

			$.each(['padding-top', 'padding-left', 'padding-bottom', 'padding-right',
					//'margin-top', 'margin-left', 'margin-bottom', 'margin-right',
					'border-top-width', 'border-left-width', 'border-bottom-width', 'border-right-width',
					'font-family', 'font-size', 'font-weight', 'font-style', 'text-decoration',
					'width', 'height'],
				function(idx, val){
				if(opt.ingnoreCssParams.indexOf(val) < 0) tarea.css(val, elm.css(val));
			});
			elm.hide().after(editor);
			tarea.val(oldText.html2text()).select().focus().expandSize();

			elm.trigger('inlineedit_start');

			return _this;
		}
	})(jQuery);

/** Dropdown menu */
	jQuery.fn.dropdown = function(options) {
		var S = jQuery.extend({
			activate			: 'click',
			buttonClass			: '.dropdown-button',
			buttonSelectedClass	: 'dropdown-button-selected',
			menuClass			: '.dropdown-menu',
			menuItemClass		: '.dropdown-menu-item'
		}, options);

		return this.each(function(){
			var _this = $(this),
				button = _this.hasClass(S.buttonClass.substr(1)) ? _this : $(S.buttonClass, _this),
				menu = $(S.menuClass, _this),
				menuItems = $(S.menuItemClass, _this);
			menu.hide();
			button.bind(S.activate, function(E){
				E.preventDefault();
				button.addClass(S.buttonSelectedClass);
				menu.show();
				_this.trigger('dropdown_show');
			});

			var hideMenu = function(){
				menu.hide();
				button.removeClass(S.buttonSelectedClass);
				_this.trigger('dropdown_hide');
			};

			menuItems.click(function (){
				hideMenu();
				_this.trigger('dropdown_select', [this]);
			});
			_this.mouseleave(hideMenu);
		});
	};

var Sys = Sys || (function (){
	var self = this, intf = {};
	return intf;
}());

Sys.Dialog = (function (){
	var self = this,
		intf = {},
		$dialogCanvas = null,
		$dialogContainer = null,
		$dialogs = null;

	$(function(){
		$dialogCanvas = $('#id-dialog-canvas'),
		$dialogContainer = $('#id-dialog-container'),
		$dialogs = $('.dialog', $dialogContainer);
	});

	intf.open = function(options){
		var opt = $.extend(options, {
				source	: null,
				dialog	: null,
				title	: undefined,
				modal	: false,
				url		: false,
				iframe	: false,
				params	: null
			}),
			dialog = opt.dialog;

		if (is(dialog, 'String')){
			dialog = $(dialog, dialogs);
		}
		if (!(is(dialog, 'Object') && dialog.jquery) && dialog.length){
			throw Error("Wrong dialog");
		}
		function dialogOpen() {
			if (opt.modal) $dialogCanvas.show();
			if (opt.title) dialog.find('.dialog-title').text(opt.title);

			dialog.show()
				.trigger('dialog_open', [opt.source])
				.find(':input.active').first().focus();
		}
		if (opt.url) {
			if (opt.iframe) {
				var iframeId = dialog.attr('id')  + '-iframe]',
					iframe = dialog.find('iframe[name=' + iframeId);
				iframe.ready(function(){
					dialog.trigger('dialog_ready', [params, window[iframeId]]);
				}).bind('load', function(){
					dialog.trigger('dialog_load', [params, window[iframeId]]);
				}).attr('src', url);
				dialogOpen();
			} else {
				$.get(url, params, function(data) {
					if (is(data, 'String')) dialog.find('.dialog-content').html(data);
					dialog.trigger('dialog_load', [params, data]);
					dialogOpen();
				});
			}
		} else {
			dialogOpen();
		}
		return false;
	}

	$(document).keyup(function(E){
		if (E.keyCode == 27) $('.dialog:visible').find('.dialog-close').click();
		if (E.keyCode == 13) $('.dialog:visible .dialog-button[name="enter"]').trigger('click');
	});

	return intf;
}());

$(function(){
var $dialogs = ".dialog"

	$('.dialog-open').live('click', function(E){
		//function(E) {
		E.stopPropagation();
		E.preventDefault();
		//}
		var _this = this,
			href = $(_this).attr('href').match(/([^#]*)(#[^!]*)/),
			url = href[1],
			target = $(href[2])
	});

	/*
	 * Dialog close
	 */
	$('.dialog-close', $dialogs).live('click', function(E){
		E.preventDefault();
		if($(this).closest('.dialog').hide().trigger('dialog_close', [this]).length) $dialogCanvas.hide();
	});


	/*
	 * dialog control
	 */
	$('.dialog-button', $dialogs).live('click', function(E){
		E.preventDefault();
		$(this).closest('.dialog-outer').trigger('dialog_control', [this]);
	});

	/*
	 * Swap
	 * @todo tab-ba beolvasztani!
	 */
	$('.swap').live('click', function(E){
		E.preventDefault();
		$(this).closest('.swap-area').find('.swap-item').hide().filter($(this).attr('href')).show();
	});

	/*
	 * Tabs
	 */
	$('.tab-nav a').live('click', function(E){
		var id = $(this).attr('href');
		if ('#' == id.charAt(0)) {
			$(this).closest('.tab-nav').find('a').removeClass('active').end().end().addClass('active').closest('.tab-area').find('.tab-panel').first().siblings('.tab-panel').andSelf().hide().filter(id).show();
			return false;
		}
	});
	$('.tab-panel').hide();
	if ($('.tab-area').find('.tab-panel.active').length) {
		$('.tab-area').find('.tab-panel.active').show();
	} else {
		$('.tab-area').find('.tab-panel:first').show();
	}

	/*
	 * Copy
	 */
	$('.copy').live('click', function(E){
		E.preventDefault();
		var content = $($(this).attr('href')).html();
		if ($(this).hasClass('before')) {
			$(content).insertBefore(this);
		} else {
			$(content).insertAfter(this);
		}
	});

	/*
	 * Remove
	 */
	$('.remove-container').live('click', function(E){
		E.preventDefault(); /** @todo use '.nohref' instead! */
		$(this).closest('.container').remove();
	});

	/*
	 * Form auto-submit
	 */
	$('.form-auto-submit').live('change', function(E){
		$(this).closest('form').submit();
	});

	$('.form-change-submit').change(function(){
		$(this).closest('form').submit();
	});
	$('form.confirm').live('submit', function(){
		return confirm(this.title ? 'Biztosan törli az alábbi elemet?\n"'+ this.title+'"' : 'Biztosan törli ezt az elemet?');
	})


	$('.dropdown').dropdown({'activate': 'mouseover'});
	$('.dropdown-outer').dropdown({'activate': 'mouseover'});


	var helpIndicator, helpData,
		welcomeDialogOpener = $('#id-dialog-welcome-opener'),
	helpIndicator = $('#id-help-indicator').bind({
		'firstRun': function(){
				$('#id-help-tip').helpTip({ firstRun: true });
				helpData = (helpData || {});
				helpData[helpIndicator.attr('href').substr(1)] = true;
				zunda.settings.save('help', helpData);
			},
		'click' : function(){
				$('#id-help-tip').helpTip({ firstRun: false });
			}
	});
	if(welcomeDialogOpener.length){
		welcomeDialogOpener.click();
	}else if (helpIndicator.length){
		zunda.settings.load('help', function(data){
			helpData = data
			if (!data || !data[helpIndicator.attr('href').substr(1)]) helpIndicator.trigger('firstRun');
		});
	};
	var welcomeDialog = $('#id-dialog-welcome');
	welcomeDialog.bind('dialogcontrol', function(E, source){ $('.dialog-close', welcomeDialog).click(); helpIndicator.trigger('firstRun'); });

	$(':input').live('focus blur', function(){
		$(this).toggleClass('active');
	});

	var balanceTipTip = $('#id-balance-tip');
	if (!!balanceTipTip.length) {
		balanceTipTip.tipTip({
			content: $('#id-balance-tip-content').html(),
			position: 'bottom',
			maxWidth: '200px'
		});
	}

	/** Turning off autocomplete */
	$('.no-autocomplete').attr('autocomplete', 'off');

	/** Form submitting anchores (GLOBAL) */
	$('a.form-submit').click(function(E){
		E.preventDefault();
		var _ = $(this).attr('href').substr($(this).attr('href').indexOf('#') + 1);
		if (_) {
			_ = $('#' + _);
		} else if (_ = $(this).attr('rel')) {
			_ = window[_];
		} else {
			_ = $(this).closest('form');
		}
		if (_ && _.submit) {
			_.submit();
		}
	});

	/** Form submit through AJAX (GLOBAL) */
	$('form.ajax').live('submit', function(E){
		E.preventDefault();
		var _this = this,
			fields = {},
			counters = {};
		$(this).find(':input:not(:disabled):not(:radio):not(:checkbox),:radio:not(:disabled):checked,:checkbox:checked').each(function(){
			if (this.name) {
				if (this.name.match(/\[\]/)) {
					if (counters[this.name]) {
						counters[this.name]++;
						fields[this.name.replace("[]", "[" + counters[this.name] + "]")] = $(this).val();
					} else {
						counters[this.name] = 1;
						fields[this.name.replace("[]", "[1]")] = $(this).val();
					}
				} else {
					fields[this.name] = $(this).val();
				}
			}
		});
		zunda.ajax.post('ping', {}, fields, function(){
			$(_this).trigger('ajax.successful');
		});
	});

	/** Auto-closing dialog with ajax form */
	$('.dialog form.ajax').live('ajax.successful', function(){
		$(this).closest('.dialog').find('.dialog-header .dialog-close').click();
	});

	/**  Aranytarto kepmeretezes */
	$('img.autoresize').each(function(){
		var width  = parseInt('0' + this.width,  10) || 0,
			height = parseInt('0' + this.height, 10) || 0,
			_this  = $(this).removeAttr('width').removeAttr('height'),
			src = _this.attr('src');
		_this.attr('src', '')
		_this.hide();
		_this.bind('load', function(){
			var _w = _this.width(), _h = _this.height();
			if ((_w > (width || Infinity)) || (_h > (height || Infinity))) {
				if (_w > _h && ((width / _w) * _h) < height) {
					_this.removeAttr('height')[width ? 'attr' : 'removeAttr']('width', width);
				} else {
					_this.removeAttr('width')[height ? 'attr' : 'removeAttr']('height', height || 'auto');
				}
			}
			_this.show();
		});
		_this.attr('src', src);
	});

	$('a.ajxa-load').click(function(E){
		E.preventDefault();
		var param = $(this).attr('href').split('#'), mode = null;
		mode = ((mode = this.className.match(/mode\-([\w]+)/)) && mode[1]) || 'inner';
		zunda.ajax.get(param[0], '' ,function(data){
			switch (mode) {
				case 'inner':		$('#' + param[1]).html(data); break;
				case 'replace':		$(data).insertAfter($('#' + param[1])).prev().remove(); break;
			}
		});
	});

	$(':checkbox.uncheckbox-default').live('change', function(){
		var _this  = $(this), next = _this.next();
		if (!next.hasClass('uncheckbox-default-value')) next = $('<input class="uncheckbox-default-value" type="hidden" name="'+_this.attr('name')+'" value="0" />');
		_this.is(':checked') ? next.attr('disabled', 'disabled') : next.removeAttr('disabled');
	});
});