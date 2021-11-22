function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
};

// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var samplesArray = data.samples;
    var resultsArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
    var results = resultsArray[0];
    console.log(results);
    var otu_ids = results.otu_ids;
    var otu_labels = results.otu_labels;
    var sample_values = results.sample_values;

    var yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
    console.log(yticks);

    var barGraph = [{
      y: yticks,
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
    }];

    var layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title:"Sample Values"},
      yaxis: {title:"otu_ids"}
    
    };

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barGraph, layout); 
  

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Jet"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      hovermode: 'closest',
      showlegend: false,
      height: 600,
      width: 1000 
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray_all = data.metadata;
    var metadataSample = metadataArray_all.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = metadataSample[0];
    console.log(firstMeta)    

    // 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(firstMeta.wfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
    value: wfreq,
    mode: number+gauge,
    domain: {x:[0,1], y:[0,1]},
    title: { text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week', font: { size: 20 } },
    type: 'indicator',
    gauge: {
      axis: { range: [0, 10], tickwidth: 2, tickcolor: "black" },
      bar:{color: 'maroon'},
      steps: [
        { range: [0, 2], color: "navy" },
        { range: [2, 4], color: "royalblue" },
        { range: [4, 6], color: "teal" },
        { range: [6, 8], color: "lightskyblue" },
        { range: [8, 10], color: "paleturquoise" }
      ]
    }
  }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black", family: "Arial" }
    }

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);

})};
