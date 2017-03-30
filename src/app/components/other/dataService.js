'use strict';
/* jshint latedef: nofunc */

angular.module('services', [])
  .factory('DataService', ['$http', '$q', function($http, $q){
    var processedData = [];

    return({
        getProjects: getProjects,
        getCounties: getCounties,
        getValidMarkers: getValidMarkers,
        processData: processData,
        getProcessedData: getProcessedData
    });

    function getProjects() {
        var request = $http({
            method: "GET",
            url: "assets/data/Distribution_of_Donor_and_GOK_Funded_Projects_2013_to_2015.geojson",
        });
        return(request.then( handleSuccess, handleError));
    }

    function getCounties() {
        var request = $http({
            method: "GET",
            url: "assets/data/counties.geojson",
        });
        return(request.then( handleSuccess, handleError));
    }

    // Returns an array with the number of projects and the total cost of projects for each county
    function processData(projects) {
        processedData = projects.features.reduce(function(acc, x) {
            var element = acc[x.properties.county];
            if (element) {
              acc[x.properties.county].number_projects++;
              acc[x.properties.county].cost_projects += x.properties.total_project_cost__kes_;
            } else {
              acc[x.properties.county] = {
                "number_projects": 1,
                "cost_projects": x.properties.total_project_cost__kes_,
              };
            }
            return acc;
        },{});
    }

    function getProcessedData() {
        return processedData;
    }

    // return an array with the markers that have the property 'geometry'
    function getValidMarkers(projects) {
      return projects.features.filter(function(marker){
        return marker.geometry;
      });
    }

    function handleError(response) {
        if (
            ! angular.isObject( response.data ) ||
            ! response.data.message
            ) {
            return( $q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess(response) {
        return( response.data );
    }

  }]);
