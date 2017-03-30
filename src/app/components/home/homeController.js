'use strict';
/* globals L */

angular.module('ushahidi.home', [])

.controller('homeCtrl', ['$scope', '$http', 'leafletData', 'DataService', 'LeafletService', function($scope, $http, leafletData, DataService, LeafletService) {

    angular.extend($scope, {
        kenya: {
            lat: 0.461976,
            lng: 37.892513,
            zoom: 7,
        },
        defaults: {
            scrollWheelZoom: false
        },
        controls: {
            fullscreen: {
                position: 'topleft'
            }
        },
    });

    DataService.getCounties().then(function(data){
      var counties = data.features;

      DataService.getProjects().then(function(data){
        var projects = data;
        DataService.processData(projects);
        $scope.markers = LeafletService.getValidMarkers(projects);

      });

    });

}]);
