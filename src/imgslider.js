(function ($) {
	'use strict';
	$.fn.slider = function (options) {

		//default options
		var settings = $.extend($.fn.slider.defaultOptions, options);

		var $slider = $(this);

		var $screenDivider = $('<div/>', {
			class: 'screen-divider'
		}).appendTo($slider);
		
		$('<div/>', {
			class: 'divider-line'
		}).appendTo($screenDivider);
		$('<div/>', {
			class: 'top-marker'
		}).appendTo($screenDivider);
		$('<div/>', {
			class: 'bottom-marker'
		}).appendTo($screenDivider);

		var init = function () {
			var $this = $(this);
			var width = Math.floor($this.width() * settings.initialPosition);
			//$this.find('.image img').css('width' , width + 'px');
			$this.find('.left.image').css('width', width);
			$screenDivider.css('left', width);
			if (settings.showInstruction) {
				// Check if instruction div exists before adding
				var $instrDiv = null;
				$instrDiv = $('div.instruction');

				if ($instrDiv.length === 0) {
					$instrDiv = $('<div></div>')
						.addClass('instruction')
						.append('<p></p>');
					$this.append($instrDiv);
				}

				$instrDiv.children('p')
					.text(settings.instructionText);

				//set left offset of instruction
				//$instrDiv.css('left', (settings.initialPosition - $instrDiv.children('p').width() / (2 * width)) * 100 + '%');
			}
		};

		var startSliderDrag = function (e) {
			$slider.find('.instruction').hide();
			$(document)
				.on('mousemove touchmove', slideResize)
				.on('mouseup touchend', stopSliderDrag);
		}

		var stopSliderDrag = function (e) {
			$(document)
				.off('mousemove touchmove', slideResize)
				.off('mouseup touchend', stopSliderDrag);
		};

		var slideResize = function (e) {
			e.preventDefault();
			var $slider = $('.slider.responsive');
			//hide instructions
			var width;
			if (e.type.startsWith('touch')) {
				//width = e.originalEvent.touches[0].clientX - e.originalEvent.layerX;
				width = e.originalEvent.touches[0].clientX;
			} else {
				// width = e.offsetX === undefined ? e.pageX - e.originalEvent.layerX : e.offsetX;
				width = e.clientX;
            }
            if (width < 1) {
                width = 1;
            }
			if (width <= $slider.width()) {
				$slider.find('.left.image').css('width', width);
				$screenDivider.css('left', width);
			}
		};

		var redrawSlider = function () {
			return $('.slider.responsive').each(init);
		};

		$(window).on('resize', redrawSlider);
		$screenDivider.on('mousedown touchstart', startSliderDrag);
		return this.each(init);
	};

	$.fn.slider.defaultOptions = {
		initialPosition: 0.5,
		showInstruction: true,
		instructionText: 'Click and Drag'
	};

}(jQuery));
