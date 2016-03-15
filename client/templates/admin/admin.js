var keyCurrServerTime = "currServerTime";
var intervalName;
var listIntervalName = [];

Template.layoutAdmin.rendered = function () {

	intervalName= setInterval(countServerTime, 500);

};
Template.layoutAdmin.destroyed = function () {
	clearInterval(intervalName);
};

Template.tabAdmin.events({
	'click a[name=tab-registerProduct]':function(){
		$("a[name='tab-saleManage']").removeClass('current');
		$("a[name='tab-registerProduct']").addClass('current');

	},
	'click a[name=tab-saleManage]':function(){
		var  timeCurrent =Session.get(keyCurrServerTime);
		Router.go('sale.show', {_id: timeCurrent});
		$("a[name='tab-registerProduct']").removeClass('current');
		$("a[name='tab-saleManage']").addClass('current');
	}
});

Template.admin.rendered = function(){
	$('#navtop-go-admin').addClass('hidden');
	$('#navtop-go-customer').removeClass('hidden');
	Meteor.call("getTime",function(err,date){
		if(!err){
			Session.set(keyCurrServerTime,date.getTime());
		}else{
			console.error("METEOR GET TIME error : "+err);
		}
	});
};

Template.admin.helpers({
	listProduct : function(){
		return this.dataAdmin;
	}
});



Template.itemProductAdmin.onCreated(function(){
	this.priceCurrent = new ReactiveVar(0);
});

Template.itemProductAdmin.onRendered(function(){

	var endsAtTime = this.data.endsAt.getTime();
	var tmplInstance= this;

	var intervalName = setInterval(function(){
		calculateTimeAndPrice(endsAtTime,tmplInstance);
	},500);
	var objThisTmpl={};
	objThisTmpl.intervalName=intervalName;
	objThisTmpl.productId=this.data._id;
	listIntervalName.push(objThisTmpl);
});
Template.itemProductAdmin.destroyed = function () {

	var listThis = _.where(listIntervalName,{productId : this.data._id});
	clearInterval(listThis[0].intervalName);
	listIntervalName = _.without(listIntervalName,_.findWhere(listIntervalName, {productId: this.data._id}));
};
Template.itemProductAdmin.helpers({
	priceCurrent: function () {
		return numberWithCommas(Template.instance().priceCurrent.get());
	}
});
Template.itemProductAdmin.events({
	'click a[name=remove]' : function(){
		Meteor.call("cancelProductOnDiscount", this._id);
	}
});


/**
 * 3자리 마다 , 를 찍어준다.
 * @param number : 액수
 * @returns {string}
 */
function numberWithCommas(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * countdown 을 위한 시간과 시간에 따른 가격변화를 계산한다.
 * 서버시간을 이용한다.
 * @param endsAtTime : 상품이 종료되는 시간, time(milliseconds)형식.
 * @param tmplInstance
 */
function calculateTimeAndPrice(endsAtTime,tmplInstance){
	var timeDuration = endsAtTime-Session.get(keyCurrServerTime);
	tmplInstance.$('.countdown').html(moment(timeDuration).utc().format("H:mm:ss"));
	var yIntercept = tmplInstance.data.priceMaxDiscount;  // y절편
	var gradient = (tmplInstance.data.priceNormal - yIntercept) / (tmplInstance.data.discountDuration * 3600);  //기울기
	var totalSec = timeDuration/1000;
	var priceCurrent = gradient * totalSec + yIntercept;
	priceCurrent = Math.round(priceCurrent);  // 소수점은 반올림
	tmplInstance.priceCurrent.set(priceCurrent);
	//console.log(priceCurrent);
}
/**
 * Session내부의
 * Server 시간을 0.5초 단위로 초기화한다.
 */
function countServerTime() {
	var serverTime = Session.get(keyCurrServerTime)+500;
	Session.set(keyCurrServerTime,serverTime);
}