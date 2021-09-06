var dataPath = 'static/data/samples.json'
var fontStyle = {
    family: 'Space Mono, monospace',
    size: 16,
    color: '#0B265B',   
}
var fontTitle = {
    family: 'Space Mono, monospace',
    color: '#0B265B'
}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(dataPath).then((data) => {
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
  d3.json(dataPath).then((data) => {
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
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json(dataPath).then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    var metadata = data.metadata
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //  5. Create a variable that holds the first sample in the array.
    var result = samples.find(sampleObj => sampleObj.id == sample)
    var metaResult = metadata.find(sampleObj => sampleObj.id == sample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    const {
      otu_ids: otuIds,
      otu_labels: otuLabels,
      sample_values: sampleValues,
    } = result;
    
    const {
      wfreq,
    } = metaResult;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topTenSampleValues = sampleValues.slice(0, 10).reverse()
    var yticks = otuIds.slice(0,10).map(otuId => 'OTU ' + otuId + '   ').reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: topTenSampleValues,
      y: yticks,
      text: otuLabels,
      type:'bar',
      orientation: 'h'
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {
        text:'Top 10 Bacteria Cultures Found (ID ' + sample + ' )',
        font: fontTitle
}
    };
    var config = {responsive: true}
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout, config);

  // Bar and Bubble charts
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size:sampleValues,
        opacity: 0.65, 
        color: otuIds,
        colorscale: 'YlGnBu'
      },
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text:'Bacteria Samples Per Culture (ID ' + sample + ' )',
        font: fontTitle
      },
      xaxis: {
        title: {
          text: 'OTU ID',
          font: fontStyle
        },
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
    

    // 4. Create the trace for the gauge chart.
    var wfreqFloat = parseFloat(wfreq)
    // console.log(wfreqFloat);
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreqFloat,
        title: { text: "Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] } ,
          bar: { color: "#000000" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },
          ],
        }
      } 
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      // margin: { t: 0, b: 0 }, 
      title: {
        text: 'Bellybutton Washing Frequency (ID ' + sample + ' )',
        font: fontTitle
      },


    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout, config);
  });
}


