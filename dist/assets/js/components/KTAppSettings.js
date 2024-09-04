"use strict";

// Class definition
var KTAppSettings = function () {
	var main;
	var form;
	var actionInput;
	var tabInput;
	var url;
	var previewButton;
	var exportButton;
	var resetButton;

	var handleTab = function () {
		var tabs = [].slice.call(document.querySelectorAll('#kt_app_settings_tabs a[data-bs-toggle="tab"]'));

		tabs.forEach(function (tab) {
			tab.addEventListener("shown.bs.tab", function (e) {
				tabInput.value = tab.getAttribute("href").substring(1);
			});
		});
	};

	var handlePreview = function () {
		previewButton.addEventListener("click", function (e) {
			e.preventDefault();

			// Set form action value
			actionInput.value = "preview";

			// Show progress
			previewButton.setAttribute("data-kt-indicator", "on");

			// Prepare form data
			var data = $(form).serialize();

			// Submit
			$.ajax({
				type: "POST",
				dataType: "html",
				url: url,
				data: data,
				success: function (response, status, xhr) {
					toastr.success(
						"Preview has been updated with current configured layout.",
						"Preview updated!",
						{ timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0 }
					);

					setTimeout(function () {
						location.reload(); // reload page
					}, 1500);
				},
				error: function (response) {
					toastr.error(
						"Please try it again later.",
						"Something went wrong!",
						{ timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0 }
					);
				},
				complete: function () {
					previewButton.removeAttribute("data-kt-indicator");
				}
			});
		});
	};

	var handleExport = function () {
		exportButton.addEventListener("click", function (e) {
			e.preventDefault();

			toastr.success(
				"Process has been started and it may take a while.",
				"Generating HTML!",
				{ timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0 }
			);

			// Show progress
			exportButton.setAttribute("data-kt-indicator", "on");

			// Set form action value
			actionInput.value = "export";

			// Prepare form data
			var data = $(form).serialize();

			$.ajax({
				type: "POST",
				dataType: "html",
				url: url,
				data: data,
				success: function (response, status, xhr) {
					var timer = setInterval(function () {
						$("<iframe/>").attr({
							src: url + "?layout-builder[action]=export&download=1&output=" + response,
							style: "visibility:hidden;display:none",
						}).ready(function () {
							// Stop the timer
							clearInterval(timer);

							exportButton.removeAttribute("data-kt-indicator");
						}).appendTo("body");
					}, 3000);
				},
				error: function (response) {
					toastr.error(
						"Please try it again later.",
						"Something went wrong!",
						{ timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0 }
					);

					exportButton.removeAttribute("data-kt-indicator");
				},
			});
		});
	};

	var handleReset = function () {
		resetButton.addEventListener("click", function (e) {
			e.preventDefault();

			// Show progress
			resetButton.setAttribute("data-kt-indicator", "on");

			// Set form action value
			actionInput.value = "reset";

			// Prepare form data
			var data = $(form).serialize();

			$.ajax({
				type: "POST",
				dataType: "html",
				url: url,
				data: data,
				success: function (response, status, xhr) {
					toastr.success(
						"Preview has been successfully reset and the page will be reloaded.",
						"Reset Preview!",
						{ timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0 }
					);

					setTimeout(function () {
						location.reload(); // reload page
					}, 1500);
				},
				error: function (response) {
					toastr.error(
						"Please try it again later.",
						"Something went wrong!",
						{ timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0 }
					);
				},
				complete: function () {
					resetButton.removeAttribute("data-kt-indicator");
				},
			});
		});
	};

	return {
		// Public functions
		init: function () {
			main = document.querySelector('#kt_app_settings');

			if (!main) {
				return;
			}

			form = document.querySelector("#kt_app_settings_form");
			actionInput = document.querySelector("#kt_app_settings_action");
			tabInput = document.querySelector("#kt_app_settings_tab");
			url = form.getAttribute("action");
			previewButton = document.querySelector("#kt_app_settings_preview");
			exportButton = document.querySelector("#kt_app_settings_export");
			resetButton = document.querySelector("#kt_app_settings_reset");

			handlePreview();
			handleExport();
			handleReset();
			handleTab();
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
	KTAppSettings.init();
});
