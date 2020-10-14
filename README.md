## EO4GEO - Occupational Profile Tool (OPT)

#### Introduction

The [Occupational Profile Tool](https://eo4geo-opt.web.app) (OPT) allows users to browse, create, edit and share occupational profiles in the field of Earth Observation and Geographic Information. Occupational profiles can be characterized as generic, recurring prototypical job descriptions, including the required knowledge and skills to be able to perform them. They can be used as a basis for creating recurrent job offers made available by any kind of organisation. Profiles are linked to the EO4GEO Body of Knowledge (BoK) for EO/GI-specific concepts and skills, to the [European Skills/Competences and Occupation (ESCO)](https://ec.europa.eu/esco/portal/skill) classification for transversal and cross-sectoral skills and to UNESCO’s [International Standard Classification of Education: Fields of Education and Training (ISCED-F)](https://ec.europa.eu/esco/portal/escopedia/International_Standard_Classification_of_Education_58__Fields_of_Education_and_Training_2013__40_ISCED-F_41_) classification for the application field. 

#### Authors
The EO4GEO BoK tools are developed by the [Geospatial Technologies Research Group](http://geotec.uji.es/) (GEOTEC) from the University Jaume I, Castellón (Spain) and are Licenced under GNU GPLv3.

[![DOI](https://zenodo.org/badge/184763052.svg)](https://zenodo.org/badge/latestdoi/184763052)


## Installation

#### Prerequisites
Before you begin, make sure your development environment includes `Node.js®` and an `npm` package manager.

###### Node.js
Angular requires `Node.js` version 8.x or 10.x.

- To check your version, run `node -v` in a terminal/console window.
- To get `Node.js`, go to [nodejs.org](https://nodejs.org/).

###### Angular CLI
Install the Angular CLI globally using a terminal/console window.
```bash
npm install -g @angular/cli
```

### Clone repo

``` bash
# clone the repo
$ git clone https://github.com/GeoTecINIT/EO4GEO-OPT.git my-project

# go into app's directory
$ cd my-project

# install app's dependencies
$ npm install
```

## Firebase
Set up a Firebase project, and copy keys to src/environments/environments.ts 

## Usage

``` bash
# serve with hot reload at localhost:4200.
$ ng serve

# build for production with minification
$ ng build
```
