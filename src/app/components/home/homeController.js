'use strict';
/* globals L */

angular.module('ushahidi.home', [])

.constant("GROUP_NAMES", {
    "COLOURS": "<b>Colours</b>",
    "DISPOSITION": "<b>Disposition</b>",
    "CHOROPLETHS": "<b>Choropleths</b>"
})

.controller('homeCtrl', ['$scope', '$http', 'leafletData', 'DataService', 'LeafletService', 'GROUP_NAMES', function($scope, $http, leafletData, DataService, LeafletService, GROUP_NAMES) {

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

        var layers = LeafletService.createLayers(counties);
        LeafletService.addMarkersToLayers(DataService.getValidMarkers(projects), layers);

        leafletData.getMap().then(function(map) {
            var groupedOverlays = {};
            groupedOverlays[GROUP_NAMES.DISPOSITION] = {
              "Non-clustered markers": layers.disposition.regular,
              "Clustered markers": layers.disposition.clustered,
            };

            // create all data and control layers
            var options = {
                  exclusiveGroups: ["<b>Disposition</b>"],
                },
                boxControl = L.control.groupedLayers(null, groupedOverlays, options);

            // initialise map
            var initialLayers = [layers.disposition.clustered],
                controls = [boxControl];
            LeafletService.addItems(map, initialLayers, controls);
        });

      });

    });

}]);
