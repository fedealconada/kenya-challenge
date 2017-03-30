'use strict';
/* globals L, legend */
/* jshint latedef: nofunc, unused: false */

angular.module('services')
  .factory('LeafletService', ['DataService', function(DataService){
    var legend;

    return({
        getValidMarkers: getValidMarkers,
    });

    // return an array with the markers that have the property 'geometry'
    function getValidMarkers(projects) {
      var markers = [];
      for (var i = 0; i < projects.features.length; i++) {
        if (projects.features[i].geometry) {
          markers.push(
            {
              lat:projects.features[i].geometry.coordinates[1],
              lng:projects.features[i].geometry.coordinates[0],
              message: createMessage(projects.features[i])
            }
          );
        }
      }
      return markers;
    }

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

  }]);
