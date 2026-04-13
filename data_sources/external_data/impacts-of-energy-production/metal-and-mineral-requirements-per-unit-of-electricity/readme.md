# Metal and mineral requirements per unit of electricity - Data package

This data package contains the data that powers the chart ["Metal and mineral requirements per unit of electricity"](https://ourworldindata.org/explorers/impacts-of-energy-sources?Impact+metric=Metal+and+mineral+use&Sub-metric=Total+material+use&country=Coal~Gas~Nuclear~Onshore+wind~Offshore+wind~Hydropower~Solar+PV%2C+silicon+%28on-ground%29~Solar+PV%2C+cadmium+%28on-ground%29) on the Our World in Data website.

## CSV Structure

The high level structure of the CSV file is that each row is an observation for an entity (usually a country or region) and a timepoint (usually a year).

The first two columns in the CSV file are "Entity" and "Code". "Entity" is the name of the entity (e.g. "United States"). "Code" is the OWID internal entity code that we use if the entity is a country or region. For most countries, this is the same as the [iso alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) code of the entity (e.g. "USA") - for non-standard countries like historical countries these are custom codes.

The third column is either "Year" or "Day". If the data is annual, this is "Year" and contains only the year as an integer. If the column is "Day", the column contains a date string in the form "YYYY-MM-DD".

The remaining columns are the data columns, each of which is a time series. If the CSV data is downloaded using the "full data" option, then each column corresponds to one time series below. If the CSV data is downloaded using the "only selected data visible in the chart" option then the data columns are transformed depending on the chart type and thus the association with the time series might not be as straightforward.


## Metadata.json structure

The .metadata.json file contains metadata about the data package. The "charts" key contains information to recreate the chart, like the title, subtitle etc.. The "columns" key contains information about each of the columns in the csv, like the unit, timespan covered, citation for the data etc..

## About the data

Our World in Data is almost never the original producer of the data - almost all of the data we use has been compiled by others. If you want to re-use data, it is your responsibility to ensure that you adhere to the sources' license and to credit them correctly. Please note that a single time series may have more than one source - e.g. when we stich together data from different time periods by different producers or when we calculate per capita metrics using population data from a second source.

### How we process data at Our World In Data
All data and visualizations on Our World in Data rely on data sourced from one or several original data providers. Preparing this original data involves several processing steps. Depending on the data, this can include standardizing country names and world region definitions, converting units, calculating derived indicators such as per capita measures, as well as adding or adapting metadata such as the name or the description given to an indicator.
[Read about our data pipeline](https://docs.owid.io/projects/etl/)

## Detailed information about each time series


## Metal and mineral requirements


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
UNECE (2021). Life Cycle Assessment of Electricity Generation Options. United Nations Economic Commission for Europe. – processed by Our World in Data

#### Full citation
UNECE (2021). Life Cycle Assessment of Electricity Generation Options. United Nations Economic Commission for Europe. – processed by Our World in Data. “Metal and mineral requirements” [dataset]. UNECE (2021). Life Cycle Assessment of Electricity Generation Options. United Nations Economic Commission for Europe. [original data].
Source: UNECE (2021). Life Cycle Assessment of Electricity Generation Options. United Nations Economic Commission for Europe. – processed by Our World In Data

### Additional information about this data
Energy technologies require a range of mineral and metal inputs. Here they are distilled into a single figure of material requirements, which is measured in grams of Sb-equivalents per megawatt-hour of electricity produced.
This dataset is based on the large meta-analysis of the impacts of electricity production carried out by the UNECE's Lifecycle Assessment of Electricity Generation Options assessment. This is based on literature review of life-cycle assessments of electricity sources: these not only include the direct impacts of an electricity source (for example, the land used for individual power plants) but also include any supply chain inputs (for example, land use upstream in supply chains, such as mining for fuel or raw materials.
This meta-analysis included measurements across all regions; here we present the global average across these values.
Note that for some impacts – land use, for example – there can be significant differences in the maximum and minimum values for a given source depending on context, such as the climate of a given location; choices around spacing and density of electricity sources etc.
References: UNECE (2021). Lifecycle Assessment of Electricity Generation Options. United Nations Economic Commission for Europe. Available at: https://unece.org/sed/documents/2021/10/reports/life-cycle-assessment-electricity-generation-options


    