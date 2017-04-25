Kenya information map
===========================

This projects displays a map using [data on donor and government funded projects in Kenya](http://www.opendata.go.ke/datasets/distribution-of-donor-and-gok-funded-projects-2013-to-2015).

The map has different options to visualise data. There are three groups of layers which are:
1. Colours: whether you want a greyscale map or a regular map (coloured). 
2. Disposition: whether you want markers to be shown clustered or not.
3. Choropleth: there are two choropleths implemented: one to see Kenya's counties are shaded in proportion to the number of projects per county and another one where counties are shaded in proportion to the average cost of projects per county in KES.

Each marker displays information (project title, description and objectives) relative to the project happening on that location.

## Installation

1. Install node modules
  * `npm install`

2. Run gulp
  * `gulp run`

If you use Google Chrome, the application will be automatically opened. If not, you can use your preferred browser and go into [http://localhost:3000](http://localhost:3000).


## Stack

This a simple [AngularJS](https://angularjs.org/) application using [Node.js](https://nodejs.org) as the server and [npm](https://www.npmjs.com) to handle dependenies.

It uses [Gulp](gulpjs.com) for automating some tasks:
- browserify: bundles required dependencies into main.js file
- sass: processes scss files into css
- copy: copies files into a /public folder
- lint: uses jshint to lint files

## Libraries
The app is using mainly [Leaflet](https://github.com/Leaflet/Leaflet) to handle maps and some plugins for it. [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) to cluster markers, [Leaflet.fullscreen](https://github.com/Leaflet/Leaflet.fullscreen) to have a fullscreen option and [leaflet-groupedlayercontrol](https://github.com/ismyrnow/leaflet-groupedlayercontrol) to group overlays together.

It is also making use of an AngularJS directive called [angular-leaflet-directive](https://github.com/tombatossals/angular-leaflet-directive) to make it easier to handle leaflet maps on AngularJS.

## Ideas
Data used to work on the project has many things that can be use to create new layers or display more information. 
Apart from displaying information on a map, graphs are a good way to understand information. 
- For instance, we could have a graph showing the plan work progress for each implementing agency or, even more, showing the average progress for each agency.

We might also want to see projects according their implementation status. We could have markers in blue for *Pipelined* state, yellow for *Ongoing*, green for *Completed* and red for the *Suspended*.


## Notes

- The directive used for handling leaflet maps is quite good but limited on some aspects. That is why some things are done with it but others not.
- There were markers with no coordinates which are not shown in the map. It would be good to have an extra layer that let the user show those markers (maybe in a random position of the county they belong to).
- Data should be optimised server-side so as the client receives it already processed and does not have to waste time on that.
- JS files can be ufligied and minified (using Gulp) to reduce size and improve privacy.
