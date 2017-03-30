'use strict';
/* globals L, legend */
/* jshint latedef: nofunc, unused: false */

angular.module('services')
  .factory('LeafletService', ['DataService', function(DataService){
    var legend;

    return({
        createLayers: createLayers,
        addMarkersToLayers: addMarkersToLayers,
        addItems: addItems,
        createMessage: createMessage
    });

    function createMessage(marker) {
        var project_title = '<h2> Unknown project </h2>';
        var project_description = '<h3>Description</h3><div>The project description is not available.</div>';
        var project_objectives = '<h3>Objectives</h3><div>The project objectives are not available.</div>';
        if (marker.properties.project_title !== null) {
          project_title = '<h2>' + marker.properties.project_title + '</h2>';
        }
        if (marker.properties.project_description !== null) {
          project_description = '<h3>Description</h3><div>' + marker.properties.project_description + '</div>';
        }
        if (marker.properties.project_objectives !== null) {
          project_objectives = '<h3>Objectives</h3><div>' + marker.properties.project_objectives + '</div>';
        }
        return project_title + project_description + project_objectives;
    }

    function createLayers(counties) {
        return {
            disposition: {
                regular: new L.LayerGroup(),
                clustered: new L.markerClusterGroup()
            }
        };
    }

    function addMarkersToLayers(markers, layers) {
      for (var i = 0; i < markers.length; i++) {
        var marker_data = markers[i];
        var message = createMessage(marker_data);
        var marker = L.marker([marker_data.geometry.coordinates[1], marker_data.geometry.coordinates[0]]).bindPopup(message);
        marker.addTo(layers.disposition.clustered);
        marker.addTo(layers.disposition.regular);
      }
    }

    function addItems(map, layers, controls) {
      for (var i = 0; i < layers.length; i++) {
        map.addLayer(layers[i]);
      }
      for (var j = 0; j < controls.length; j++) {
        map.addControl(controls[j]);
      }
    }

  }]);
