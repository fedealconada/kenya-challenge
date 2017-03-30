'use strict';
/* globals L, legend */
/* jshint latedef: nofunc, unused: false */

angular.module('services')
  .factory('LeafletService', ['DataService', 'LAYERS_NAMES', function(DataService, LAYERS_NAMES){
    var legend;

    return({
        createLegend: createLegend,
        createMessage: createMessage,
        addItems: addItems,
        addMarkersToLayers: addMarkersToLayers,
        createLayers: createLayers,
        getLegend: getLegend
    });

    function _costStyle(feature) {
      var data = DataService.getProcessedData();
      var average_cost =  data[feature.properties.COUNTY_NAM].cost_projects / data[feature.properties.COUNTY_NAM].number_projects;
      return {
        fillColor: costColour(average_cost/1000000),
        weight: 1,
        opacity: 0.7,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.7
      };
    }

    function _numberStyle(feature) {
      var data = DataService.getProcessedData();
      var number =  data[feature.properties.COUNTY_NAM].number_projects;
      return {
        fillColor: numberColour(number),
        weight: 1,
        opacity: 0.7,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.7
      };
    }

    function createLayers(counties) {
        return {
            disposition: {
                regular: new L.LayerGroup(),
                clustered: new L.markerClusterGroup()
            },
            choropleths: {
                cost:  new L.geoJSON(counties, {style: _costStyle}),
                number: new L.geoJSON(counties, {style: _numberStyle})
            },
            colours: {
              greyscale: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              }),
              regular: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              })
            }
        };
    }

    function addMarkersToLayers(markers, layers) {
      for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        var message = createMessage(marker);
        L.marker([marker.geometry.coordinates[1], marker.geometry.coordinates[0]]).bindPopup(message).addTo(layers.regular);
        L.marker([marker.geometry.coordinates[1], marker.geometry.coordinates[0]]).bindPopup(message).addTo(layers.clustered);
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

    function costColour(d) {
      return d > 1000000  ? '#0f5f9e' :
             d > 500000  ? '#207fbf' :
             d > 100000   ? '#15a9c7' :
             d > 50000   ? '#54dbdf' :
             d > 10000   ? '#a9e1d4' :
                        '#dbf3ee';
    }

    function numberColour(d) {
        return d > 90   ? '#0f5f9e' :
               d > 70   ? '#207fbf' :
               d > 50   ? '#15a9c7' :
               d > 30   ? '#54dbdf' :
               d > 10   ? '#a9e1d4' :
               d > 0    ? '#dbf3ee' :
                        '#dbf3ee';
    }

    function createLegend(type) {
      var grades = [0, 10, 30, 50, 70, 90],
          labels = ['< 0', '< 10','< 30','< 50','< 70','< 90'],
          title = LAYERS_NAMES.NUMBER_LAYER;
      var getColour = numberColour;
      if (type === 'cost') {
          getColour = costColour;
          grades = [10000, 50000, 100000, 500000, 1000000];
          labels = ['< 10000', '< 50000', '< 100000', '< 500000', '< 1000000'];
          title = LAYERS_NAMES.COST_LAYER;
      }
      legend = L.control({position: 'bottomright'});
      legend.onAdd = function () {
          var div = L.DomUtil.create('div', 'info legend');
          div.innerHTML = '<h4>' + title + '</h4>';

          // loop through the project amounts intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColour(grades[i] + 1) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&nbsp;&ndash;&nbsp;' + grades[i + 1] + '<br>' : '+');
          }
          return div;
      };
      return legend;
    }

    function getLegend() {
      return legend;
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
