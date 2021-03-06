<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="storepickup" tagdir="/WEB-INF/tags/mobile/storepickup"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData"%>
<%@ attribute name="cartPage" required="false" type="java.lang.Boolean"%>
<%@ attribute name="entryNumber" required="false" type="java.lang.Long"%>
<%@ attribute name="qty" required="false" type="java.lang.Long"%>

<c:set var="backMessageCode" value="${cartPage ? 'pickup.mobile.back.to.cart.page' : 'pickup.mobile.back.to.product.page'}"/>
<c:set var="entryNumberBlock" value="${not empty entryNumber ? '_entry_' : ''}${not empty entryNumber ? entryNumber : ''}"/>

<div id="popup_store_pickup_form_product_${product.code}${entryNumberBlock}" class="accmob-navigationHolder pickupPopup storeFinderSearch">
	<div data-role="content"  >
		<storepickup:storeFinderPage productData="${product}" cartPage="${cartPage}" entryNumber="${entryNumber}" qty="${not empty qty ? qty : 1}"/>	
	</div>
</div>