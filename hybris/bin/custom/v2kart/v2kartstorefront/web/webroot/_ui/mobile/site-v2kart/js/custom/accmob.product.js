ACCMOB.product = {


	redirect: function (url)
	{

		if (url.indexOf("http://") == -1)
		{
			url = "http://" + url;
		}
		window.location = url;
	},

	initializeVariantSelectors: function (variantSelectorElement)
	{

		variantSelectorElement.change(function ()
		{
			if ($(this).val() != "")
			{
				var url = $(location).attr('host') + $(this).val();
				ACCMOB.product.redirect(url);
			}
		});

	},
	
	initializeQtySelectors: function(qtySelectorElement)
	{
		qtySelectorElement.change(function ()
		{
			var selector = $(event.target);
			var value = selector.val();
			var qty_css = 'input[name=qty]';
			
			while(selector.parent()[0] != document) 
			{
				selector = selector.parent();
				if(selector.find(qty_css).length > 0) 
				{
					selector.find(qty_css).val(value);
					return;
				}
			}
		});
	},

	changeDot: function (selectedIndex, galleryElement)
	{

		var dots = galleryElement.siblings("div.dots").find("span");
		var commonresourcepath = $(galleryElement).data("commonresourcepath");

		$.each(dots, function (index)
		{
			var src = "";
			if (index == selectedIndex)
			{
				src = commonresourcepath + "/images/closeddot.png";
			}
			else
			{
				src = commonresourcepath + "/images/opendot.png";
			}
			$(this).html("<img src=\'" + src + "\'/>");
		});
		return false;
	},

	configureImageGallery: function (galleryElement)
	{
		if (!$.isEmptyObject(galleryElement))
		{
			$(galleryElement).cycle({
				"timeout": 0,
				"fx": "scrollHorz",
				"next": "#next",
				"prev": "#prev"
			});
		}
	},

	initializeGalleries: function (galleryElements)
	{

		if (!$.isEmptyObject(galleryElements))
		{
			$.each(galleryElements, function (galleryIndex, element)
			{
				var galleryElement = $(element);

				ACCMOB.product.configureImageGallery(galleryElement);

				var numSlides = galleryElement.find(".swipeGallerySlide").size();

				galleryElement.data("index", 0);

				galleryElement.swipeleft(function ()
				{
					var index = galleryElement.data("index");

					if ($(this).data("enabled") == true)
					{
						index = Math.abs((index + 1 ) % numSlides);
						galleryElement.cycle("next");
						ACCMOB.product.changeDot(index, galleryElement);
						galleryElement.data("index", index);
					}
				});

				galleryElement.swiperight(function ()
				{
					var index = galleryElement.data("index");

					if ($(this).data("enabled") == true)
					{
						if (index == 0)
						{
							index = Math.abs(index - numSlides + 1);
						}
						else
						{
							index = Math.abs((index - 1) % numSlides);
						}
						galleryElement.cycle("prev");
						ACCMOB.product.changeDot(index, galleryElement);
						galleryElement.data("index", index);
					}
				});
			});
		}
	},

	makeImageDraggable: function (image, slide)
	{
		var imageContainer = $(slide).find(".imageContainer");
		var image = $(slide).find('img');

		var imageWidth = image.width();
		var imageHeight = image.height();
		var containerLeft = imageContainer.offset().left;
		var containerTop = imageContainer.offset().top;
		var containerWidth = imageContainer.width();
		var containerHeight = imageContainer.height();

		var boundary = [(containerLeft + containerWidth - imageWidth),
			(containerTop + containerHeight - imageHeight),
			(containerLeft),
			(containerTop)];

		imageContainer.draggable({ containment: boundary });
	},

	zoomToggle: function (slide)
	{

		if ($(slide).data('zoom') == 'in')
		{
			ACCMOB.product.zoomOut(slide);
			$(slide).data('zoom', 'out');
		}
		else if ($(slide).data('zoom') == 'out')
		{
			ACCMOB.product.zoomIn(slide);
			$(slide).data('zoom', 'in');
		}
	},

	zoomOut: function (slide)
	{

		$(".imageGallery").data('enabled', true);

		$(slide).find(".imageContainer").draggable({disabled: true});

		var image = "<div class='imageContainer'><img src='" + $(slide).data("primaryimagesrc") + "' alt='" + $(slide).data("alt") + "' title='" + $(slide).data("title") + "' width='100%'/></div>";
		$(slide).find('.imageContainer').replaceWith(image);

		var zoomButton = $(slide).find('.zoomOutButton');
		$(zoomButton).removeClass('zoomOutButton');
		$(zoomButton).addClass('zoomInButton');
	},

	zoomIn: function (slide)
	{

		$(".imageGallery").data('enabled', false);

		var image = "<img src='" + $(slide).data("zoomimagesrc") + "' alt='" + $(slide).data("alt") + "' title='" + $(slide).data("title") + "'/>";
		var container = $(slide).find('.imageContainer');

		var centeringWidth = ($(image).width() - $(container).width()) / 2;
		var centeringHeight = ($(image).height() - $(container).height()) / 2;
		$(container).css('top', -122);
		$(container).css('left', -62);
		$(container).css('height', $(image).height());
		$(container).css('width', $(image).width());
		$(container).html(image);

		var zoomButton = $(slide).find('.zoomInButton');
		$(zoomButton).removeClass('zoomInButton');
		$(zoomButton).addClass('zoomOutButton');

		$(slide).imagesLoaded(function ()
		{
			ACCMOB.product.makeImageDraggable(image, slide);
		});
	},

	initializeImageGalleryZoom: function ()
	{

		var slides = $(".imageGallery .imageGallerySlide");
		slides.each(function ()
		{
			var slide = $(this);

			$(slide).find(".zoomButton").bind("tap", function ()
			{
				ACCMOB.product.zoomToggle(slide);
			});
		});
	},

	createDialog: function (headerText, data)
	{
		$.mobile.easydialog({header: headerText, content: data});
		return $.mobile.easyDialog;
	},

	displayAddToCartOverlay: function (cartResult, statusText, xhr, formElement)
	{
		if (cartResult.cartContainsProduct) {
			//pop-Up
			var header = $('#addToBagDialog').find(".header").html();
			var content = $('#addToBagDialog').find(".content").html();
			var type = "error";
			ACCMOB.common.hidePageLoadingMsg();
			ACCMOB.product.addGlobalMessage(header, content, type);
			return;
		}
		else {
			ACCMOB.product.refreshMiniCart();
			ACCMOB.common.hidePageLoadingMsg();
			var currentDialog = $.mobile.easyDialog;
			if (typeof currentDialog !== "undefined" && currentDialog !== null) {
				currentDialog.close();
			}
			var productCode = $('[name=productCodePost]', formElement).val();
			var quantityField = $('[name=qty]', formElement).val();
			var quantity = quantityField || 1;
			var cartAnalyticsData = cartResult.cartAnalyticsData;
			var cartData = {
				"cartCode" : cartAnalyticsData.cartCode,
				"productCode" : productCode,
				"quantity" : quantity,
				"productPrice" : cartAnalyticsData.productPostPrice,
				"productName" : cartAnalyticsData.productName
			};
			ACCMOB.product.trackAddToCart(productCode, quantity, cartData);
			var addToCartPopup = cartResult.cartPopupHtml;
			var addToCartDialog = ACCMOB.product.createDialog($(addToCartPopup)
					.first('h2').data('dialogheader'), addToCartPopup);
			ACCMOB.common.hidePageLoadingMsg();
		}
	},
	displayRelatedProductOverlay: function (data, e)
	{
		ACCMOB.common.hidePageLoadingMsg();

		if (typeof currentDialog !== "undefined" && currentDialog !== null)
		{
			currentDialog.close();
		}

		var relatedProductDialog = ACCMOB.product.createDialog($(data).first('h2').data('dialogheader'), data);
		ACCMOB.product.initAddToCart();
		ACCMOB.common.hidePageLoadingMsg();
	},

	initAddToCart: function ()
	{
		var addToCartForm = $('.add_to_cart_form');
		addToCartForm.ajaxForm({success: ACCMOB.product.displayAddToCartOverlay});

	},
	
	initPickUpInStore: function()
	{
		var currentVariant = 0;
		if ($("#variant option:selected").length > 0) {
			currentVariant = $("#variant option:selected")[0].index;
		}
		var currentSize = 0;
		if ($("#Size option:selected").length > 0) {
			currentSize = $("#Size option:selected")[0].index;
		}

		if (($("#variant").length > 0 && currentVariant == 0) || ($("#Size").length > 0 && currentSize == 0) || $('.pdpPickUpInStoreButton').data('productavailable') == false) {
			$('.pdpPickUpInStoreButton').addClass('ui-disabled');
		}
	},

	trackAddToCart: function (productCode, quantity, cartData)
	{
		window.mediator.publish('trackAddToCart',{
			productCode: productCode,
			quantity: quantity,
			cartData: cartData
		});
	},

	initDisplayRelatedProduct: function ()
	{
		$('.referencedProductImage').die('click');
		$('.referencedProductImage').live("click", function (e)
		{
			e.preventDefault();
			$.ajax({
				type: "GET",
				url: $(this).data("url"),
				cache: false,
				success: ACCMOB.product.displayRelatedProductOverlay
			});
		});
	},

	refreshMiniCart: function ()
	{
		$.get(ACCMOB.config.contextPath + '/cart/miniCart/${totalDisplay}', function (result)
		{
			$('#minicart_data').html(result)
		});
	},

	bindShowReviews: function ()
	{

		if ($('.review').size() == 1)
		{
			$(".showReviews").addClass('ui-disabled');
		}

		var multiple = 1;

		$('.showReviews').live("tap", function ()
		{
			var reviews = $('.productReviews li');

			var i;
			for (i = 0; i < reviews.size(); i++)
			{
				if (i < multiple * 5)
				{
					$(reviews[i]).show();
				}
				else
				{
					multiple++;
					break;
				}
			}

			var hiddenReviews = $('.productReviews li:hidden');

			//disables 'show more' button if there are no more review to display.
			if (hiddenReviews.length <= 0)
			{
				$(".showReviews").addClass('ui-disabled');
			}
		});
	},

	scrollToReviewBinder: function (e)
	{
		e.preventDefault();
		$("#review_detail").trigger('expand');
		var offset = $("#review_detail").offset().top;
		$('html, body').animate({scrollTop: offset}, 500);
	},

	clickToScrollToReviews: function ()
	{
		$("#averageRatingTopOfPage").bind("tap", function (e)
		{
			e.preventDefault();
			$("#review_detail").trigger('expand');
			var offset = $("#review_detail").offset().top;
			$('html, body').animate({scrollTop: offset}, 500);
		});

		$("#seeReviewsLink").bind("tap", function (e)
		{
			e.preventDefault();
			$("#review_detail").trigger('expand');
			var offset = $("#review_detail").offset().top;
			$('html, body').animate({scrollTop: offset}, 500);
		});
	},

	preloadProductImages: function (imageHolder)
	{
		imageHolder.each(function (i, element)
		{
			var src = $(element).data("thumbnail");
			var image = $('<img />').attr('src', src);
		});
	},
	clickbuyNow: function (buynow)
	{
		$(buynow).live("click", function (e)
		{
			var formElement = $("#buyNowForm");
			$('#buyNowForm input[name=qty]').val('0');
			formElement.submit();
		});
	},
	addToWishList : function(wishbutton) {
		$(wishbutton).live("click", function (e)
			{
			ACCMOB.common.hidePageLoadingMsg();
			var option = $(wishbutton).data("options");
			if (option.addToWishListProduct != "") {
				var content= "<div class='wishpopup'>"+$(wishbutton).data("content")+"</div>";
				$.ajax({
					dataType: 'json',
					url: option.addToWishListUrl,
					data :{productCode : option.addToWishListProduct},
					cache: false,
					success: ACCMOB.product.addGlobalMessage($(wishbutton).data("heading"),content, 'conf')
				});
			} else {

				window.location.href = option.addToWishListUrl;
			}
		});

	},
	addGlobalMessage : function(header, content, type){
		$.mobile.easydialog({
			content: content,
			header: header,
			type: type
		});
	},
	clickSizeDetails: function (sizedetails)
	{
		$(sizedetails).live("click", function (e)
		{
			$("#details_tab").trigger('expand');
			var offset = $("#details_tab").offset().top;
			$('html, body').animate({scrollTop: offset}, 500);
		});
	},
	displayBuyNowPopup: function (cartResult, statusText, xhr, formElement){
		if(cartResult.cartContainsProduct){
			//pop-up
			var header = $('#buyNowDialog').find(".header").html();
			var content = $('#buyNowDialog').find(".content").html();
			var type = "error";
			ACCMOB.product.addGlobalMessage(header, content, type);
		} else {
			openCartPage();
		}
	},
	bindToBuyNowForm : function() {
		$('#buyNowForm input[name=qty]').val('0');
		var buyNowForm = $('#buyNowForm');
		buyNowForm.ajaxForm({
			success : ACCMOB.product.displayBuyNowPopup
		});
	},
	displayAddToCartWishlistPopup : function(cartResult, statusText, xhr, formElement) {
		var productCode = $('[name=productCodePost]', formElement).val();
		if(cartResult.cartContainsProduct){
			var header = $('#addToBagDialog').find(".header").html();
			var content = $('#addToBagDialog').find(".content").html();
			var type = "error";
			ACCMOB.common.hidePageLoadingMsg();
			ACCMOB.product.addGlobalMessage(header, content, type);
			return;
		}
		
		var form = $("#addCartWishlistForm_" + productCode);
		form.submit();
		return;
	},
	bindToAddToCartWishlistForm: function() {
		var addToCartForm = $('.addToCartWishlistForm');
		addToCartForm.ajaxForm({
			success : ACCMOB.product.displayAddToCartWishlistPopup
		});
	},
	initialize: function ()
	{
		with (ACCMOB.product)
		{
			initializeVariantSelectors($(".variantSelector"));
			initializeQtySelectors($(".qtySelector"))
			initDisplayRelatedProduct();
			preloadProductImages($('.hasThumbnail'));
			initAddToCart();
			initPickUpInStore();
			bindShowReviews();
			clickToScrollToReviews();
			bindToBuyNowForm();
			bindToAddToCartWishlistForm();
		}
	}
};

$(document).ready(function ()
{
	ACCMOB.product.initialize();
	ACCMOB.product.initializeImageGalleryZoom();
	ACCMOB.product.initializeGalleries($('.swipeGallery'));
	ACCMOB.product.clickbuyNow("#buyNowButton");
	ACCMOB.product.addToWishList("#wishlistButton");
	ACCMOB.product.clickSizeDetails("#sizeDetails");
	$(".imageContainer img").live("click", function (e)
	{
		var img = $(this).parent().html();
		$("#imageContainerPage .imageBox").html(img);
		$("#imageContainerPage .imageBox img").css("width","initial");
		$.mobile.changePage($("#imageContainerPage"));
	});
	
});

function addToCartFormSubmit() {
	var form = $("#addToCartPopupForm");
	form.submit();
}
function openCartPage() {
	var form = $("#showcartform");
	form.submit();
	return true;
}

