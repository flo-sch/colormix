$(function () {
	var $form = $('form#form-mix'),
		$color1 = $('#color-1').val('#ffffff').css('background-color', '#ffffff'),
		$color2 = $('#color-2').val('#000000').css('background-color', '#000000'),
		$mix = $('#color-mix');

	$color1.ColorPicker({
		onChange: function (hsb, hex, rgb) {
			$color1.val('#' + hex).css('background-color', 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b +')');
		},
		onSubmit: function(hsb, hex, rgb, el) {
			console.log(this, el, rgb);
			$(el).val('#' + hex).css('background-color', 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b +')');
			$(el).ColorPickerHide();
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor(this.value);
		}
	});
	$color2.ColorPicker({
		onChange: function (hsb, hex, rgb) {
			$color2.val('#' + hex).css('background-color', 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b +')');
		},
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).val('#' + hex).css('background-color', 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b +')');
			$(el).ColorPickerHide();
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor(this.value);
		}
	});

	$form.on({
		submit: function (e) {
			e.preventDefault();
			if ($color1.val() && $color2.val()) {
				var c1 = new ColorMix.Color($color1.val()),
					c2 = new ColorMix.Color($color2.val()),
					mix = ColorMix.mix([c1, c2], [50, 50]);

				mix.useAsBackground($mix.selector);
				$mix.empty().append($('<div>', {
					'class': 'color-value-rgb'
				}).text(mix.toString('rgb'))).append($('<div>', {
					'class': 'color-value-hsl'
				}).text(mix.toString('hsl'))).append($('<div>', {
					'class': 'color-value-hex'
				}).text(mix.toString('hex')));
			}
		}
	}).submit();
});