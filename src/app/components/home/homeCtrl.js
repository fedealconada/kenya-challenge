'use strict';
/* globals L */

angular.module('ushahidi.home', [])
    .constant('LAYERS_NAMES', {
        'COST_LAYER': 'Average cost per county (KES)',
        'NUMBER_LAYER': 'Projects per county'
    })
    .constant('GROUP_NAMES', {
        'COLOURS': '<b>Colours</b>',
        'DISPOSITION': '<b>Disposition</b>',
        'CHOROPLETHS': '<b>Choropleths</b>'
    })
    .controller('homeCtrl', ['$scope', '$http', 'leafletData', 'DataService', 'LeafletService', 'LAYERS_NAMES', 'GROUP_NAMES', function ($scope, $http, leafletData, DataService, LeafletService, LAYERS_NAMES, GROUP_NAMES) {
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
        DataService.getCounties().then(function (data) {
            var counties = data.features;
            DataService.getProjects().then(function (data) {
                var projects = data;
                DataService.processData(projects);
                var layers = LeafletService.createLayers(counties);
                LeafletService.addMarkersToLayers(DataService.getValidMarkers(projects), layers.disposition);
                leafletData.getMap().then(function (map) {
                    var groupedOverlays = {};
                    groupedOverlays[GROUP_NAMES.COLOURS] = {
                        'Greyscale layer': layers.colours.greyscale,
                        'Regular': layers.colours.regular,
                    };
                    groupedOverlays[GROUP_NAMES.DISPOSITION] = {
                        'Non-clustered markers': layers.disposition.regular,
                        'Clustered markers': layers.disposition.clustered,
                    };
                    groupedOverlays[GROUP_NAMES.CHOROPLETHS] = {
                        'Projects per county': layers.choropleths.number,
                        'Average cost per county (KES)': layers.choropleths.cost
                    };
                    // create all data and control layers
                    var options = {
                            exclusiveGroups: ['<b>Colours</b>', '<b>Disposition</b>', '<b>Choropleths</b>'],
                        },
                        boxControl = L.control.groupedLayers(null, groupedOverlays, options),
                        legendControl = LeafletService.createLegend('number');
                    // initialise map
                    var initialLayers = [layers.colours.greyscale, layers.choropleths.number, layers.disposition.clustered],
                        controls = [boxControl, legendControl];
                    LeafletService.addItems(map, initialLayers, controls);
                    // legend control layer event
                    map.on('overlayadd', function (e) {
                        map.removeControl(LeafletService.getLegend());
                        var type = 'number';
                        if (e.name === LAYERS_NAMES.COST_LAYER) {
                            type = 'cost';
                        }
                        LeafletService.createLegend(type).addTo(map);
                    });
                });
            });
        });
    }]);
