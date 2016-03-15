Meteor.subscribe("ProductImage");

Meteor.startup(function () {

    $.getScript("resources/js/jquery.min.js");
    $.getScript("resources/js/bootstrap.min.js");

    AccountsEntry.config({
        homeRoute: '/',
        dashboardRoute: '/'
    });
});