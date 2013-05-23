// Singleton WWO-API JavaScript SDK
SDK = window.SDK || {};
SDK.Weather = (function () {
	var _baseUrl = 'http://api.worldweatheronline.com/',
		_type = 'free',
		_page = '/v1/weather.ashx',
		_key = '6fubz25shqbwdvgzdt98s8dn';

	return {
		setBaseUrl: function (baseUrl) {
			_baseUrl = String(baseUrl);
		},
		setKey: function (key) {
			_key = String(key);
		},
		setType: function (type) {
			if (type === 'free' || type === 'premium') {
				_type = type;
			}
		},
		setPage: function (page) {
			_page = String(page);
		},
		load: function (config) {
			config = $.extend({
				'location': 'London',
				'format': 'json',
				'dataType': 'json',
				'days': 1,
				'location': true,
				'comments': false,
				'callback': function () {},
				'scope': this
			}, config);

			var url = _baseUrl + _type + _page,
				data = {
					key: _key,
					q: config.location,
					format: config.format,
					num_of_days: config.days,
					includelocation: (config.location === true ? 'yes' : 'no'),
					show_comments: (config.comments === true ? 'yes' : 'no')
				};

			// Escape the URL and call the proxy.php file that will solve the Access-Control-Allow-Origin problem while working on localhost.
			if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
				url = 'proxy.php?type=' + config.dataType + '&url=' + encodeURIComponent(url + '?key=' + _key + '&q=' + config.location + '&format=' + config.format + '&num_of_days=' + config.days + '&includelocation=' + (config.location === true ? 'yes' : 'no') + '&show_comments=' + (config.comments === true ? 'yes' : 'no'));
				data = null;
			}

			$.ajax({
				url: url,
				type: 'get',
				data: data,
				dataType: config.dataType,
				crossDomain: true
			}).done(function (response, status, XHR) {
				config.callback.apply(config.scope, [true, response, status, XHR]);
			}).fail(function (XHR, status, error) {
				config.callback.apply(config.scope, [false, error, status, XHR]);
			});
		}
	}
})();


$(function () {
	var $form = $('form#form-mix'),
		$color1 = $('#color-1').val('#ffffff').css('background-color', '#ffffff'),
		$color2 = $('#color-2').val('#000000').css('background-color', '#000000'),
		$mix = $('#color-mix'),
		mixColors = function () {
			var c1 = new ColorMix.Color($color1.val()),
				c2 = new ColorMix.Color($color2.val()),
				mix = ColorMix.mix([c1, c2], [50, 50]);
			
			mix.useAsBackground($mix.selector);
			$mix.empty().append($('<div>', {
				'class': 'color-1'
			}).css('background-color', $color1.val())).append($('<div>', {
				'class': 'color-2'
			}).css('background-color', $color2.val())).append($('<div>', {
				'class': 'color-values-container'
			}).append($('<div>', {
				'class': 'color-value-rgb'
			}).text(mix.toString('rgb'))).append($('<div>', {
				'class': 'color-value-hsl'
			}).text(mix.toString('hsl'))).append($('<div>', {
				'class': 'color-value-hex'
			}).text(mix.toString('hex'))));
		},
		$weatherWidget = $('#widget-weather'),
		$weatherButton = $('#weather-button'),
		WeatherWidget = function (target) {
			var $target = $(target),
				_location = 'London',
				_data = {};
				init = function () {
					load.apply(this);
					if (ColorMix) {
						ColorMix.setGradient([
							{ reference: -30, color: { red: 123, green: 219, blue: 243 } },
							{ reference: -27.5, color: { red: 124, green: 217, blue: 238 } },
							{ reference: -25, color: { red: 128, green: 214, blue: 233 } },
							{ reference: -22.5, color: { red: 128, green: 214, blue: 233 } },
							{ reference: -20, color: { red: 136, green: 207, blue: 219 } },
							{ reference: -17.5, color: { red: 141, green: 203, blue: 212 } },
							{ reference: -15, color: { red: 146, green: 204, blue: 243 } },
							{ reference: -12.5, color: { red: 151, green: 194, blue: 195 } },
							{ reference: -10, color: { red: 157, green: 190, blue: 187 } },
							{ reference: -7.5, color: { red: 162, green: 186, blue: 178 } },
							{ reference: -5, color: { red: 169, green: 180, blue: 168 } },
							{ reference: -2.5, color: { red: 175, green: 175, blue: 159 } },
							{ reference: 0, color: { red: 181, green: 171, blue: 149 } },
							{ reference: 2.5, color: { red: 187, green: 166, blue: 139 } },
							{ reference: 5, color: { red: 193, green: 161, blue: 130 } },
							{ reference: 7.5, color: { red: 199, green: 156, blue: 121 } },
							{ reference: 10, color: { red: 205, green: 151, blue: 112 } },
							{ reference: 12.5, color: { red: 210, green: 147, blue: 103 } },
							{ reference: 15, color: { red: 216, green: 142, blue: 94 } },
							{ reference: 17.5, color: { red: 221, green: 138, blue: 86 } },
							{ reference: 20, color: { red: 226, green: 134, blue: 79 } },
							{ reference: 22.5, color: { red: 230, green: 131, blue: 72 } },
							{ reference: 25, color: { red: 234, green: 127, blue: 66 } },
							{ reference: 27.5, color: { red: 238, green: 124, blue: 60 } },
							{ reference: 30, color: { red: 241, green: 122, blue: 55 } }
						]);
					}
				},
				load = function () {
					var weather = this;
					SDK.Weather.load({
						dataType: 'jsonp',
						location: _location,
						callback: function (success, response, status, XHR) {
							if (success) {
								_data = response.data;
								displayWeather.apply(weather);
							} else {
								// Hummm...
								console.log('Impossible to load the weather widget data from the API.');
							}
						},
						scope: this
					});
				},
				displayWeather = function () {
					if ($target.length > 0) {
						$target.css('background-color', ColorMix.blend(_data.current_condition[0].temp_C)).empty().append($('<div>', {
							'class': 'widget-weather-location',
						}).text(_location)).append($('<div>', {
							'class': 'widget-weather-temperature'
						}).text(_data.current_condition[0].temp_C + ' °C')).append($('<div>', {
							'class': 'widget-weather-informations'
						}).append($('<div>', {
							'class': 'widget-weather-wind'
						}).append($('<div>', {
							'class': 'widget-weather-wind-container'
						}).append($('<span>', {
							'class': 'widget-weather-wind-value'
						}).text(_data.current_condition[0].windspeedKmph + ' km/h')))).append($('<div>', {
							'class': 'widget-weather-humidity'
						}).append($('<div>', {
							'class': 'widget-weather-humidity-container'
						}).append($('<span>', {
							'class': 'widget-weather-humidity-value'
						}).text(_data.current_condition[0].humidity + ' %')))));
					}
				};

			return {
				init: function () {
					init.apply(this);
					return this;
				},
				setLocation: function (location) {
					_location = String(location);
					load.apply(this);
					return this;
				}
			}
		},
		Weather = (new WeatherWidget($weatherWidget)).init();

	$color1.colorpicker().on({
		changeColor: function (e) {
			$(this).val(e.color.toHex()).css('background-color', e.color.toHex());
			mixColors();
		}
	});
	$color2.colorpicker().on({
		changeColor: function (e) {
			$(this).val(e.color.toHex()).css('background-color', e.color.toHex());
			mixColors();
		}
	});

	$form.on({
		submit: function (e) {
			e.preventDefault();
			if ($color1.val() && $color2.val()) {
				mixColors();
			}
		}
	}).submit();

	$weatherButton.on({
		click: function (e) {
			e.preventDefault();

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					Weather.setLocation(String(position.coords.latitude + ',' + position.coords.longitude));
				});
			} else {
				alert('Your browser seems to not be able to use the Geolocation. Please update it, or change for a modern browser !');
			}
		}
	})
});