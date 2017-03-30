'use strict';
require('angular');
require('angular-ui-router');
require('angular-aria');
require('angular-animate');
require('leaflet');
require('leaflet-fullscreen');
require('leaflet-groupedlayercontrol');
require('leaflet.markercluster');
require('angular-leaflet-directive');
require('./components/home/homeCtrl.js');
require('./components/other/dataService.js');
require('./components/other/leafletService.js');

var app = angular.module('ushahidi', [
    'ui.router',
    'ushahidi.home',
    'services',
    'leaflet-directive'
]);

app.config(function ($stateProvider, $urlRouterProvider, $logProvider) {
    $logProvider.debugEnabled(false);
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "app/components/home/homeView.html"
        });
});
