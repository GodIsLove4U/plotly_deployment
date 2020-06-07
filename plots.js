function init() {
    var selector = d3.select("#selDataset");
    
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
  
      });
  
    //})}
  
  //function optionChanged(initSample) {
    const initSample = sampleNames[0];
    buildMetadata(initSample);
    buildCharts(initSample);
  });
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}
  
  function buildMetadata(sample) {
      d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
   
        Object.entries(result).forEach(([key, value]) => {
          PANEL.append("h6").text(`${key.toUpperCase()}:${value}`);
          console.log(PANEL)

        //buildGauge(data.wfreq);
      });
    });
  };
  
    //
  
  function buildCharts(sample) {
    //   // First get data
    d3.json("samples.json").then((data) => {

      var dropdown = d3.select("#selDataset");

      data.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value");
      });
  
      var sampleInfo = data.samples;
      //console.log("=====this is your  sampleInfo data ======")
      //console.log(sampleInfo);
  
      // Filtering  object by id
      var selectedSample = sampleInfo.filter(sampleObj => sampleObj.id == sample)[0];
      console.log(selectedSample,"Check");
      
      // Creating variables for bar chart
      var sampleValue = selectedSample.sample_values.slice(0,10).reverse();
      var otuids = selectedSample.otu_ids.map(otuId => `OTU ${otuId}`).slice(0,10).reverse();
      console.log(selectedSample)
      console.log(sampleValue)

      var labels = selectedSample.otu_labels.slice(0,10).reverse();
      console.log(labels)
        
      var trace = {
        x: sampleValue,
        y: otuids,
        text: labels,
        type: "bar",
        orientation: "h"
      };
  
      console.log(trace.x);
      console.log(trace.y)
      console.log("TestingTESTING?")
  
      var data = [trace];
      var layout = {
      title: "Top 10",
      xaxis: { title: "OTUs" },
      yaxis: { title: "Values"}
      };
  
      // Plotly.newPlot("bar", trace, layout);
        Plotly.newPlot( "bar", [trace] );
      
      // Create variables and build Bubble Chart
      var otuidsbubble = selectedSample.otu_ids;
      var otulabelbubble = selectedSample.otu_labels;
      var samplevaluebubble = selectedSample.sample_values;

      var bubbledata = [
        {
          y: samplevaluebubble,
          x: otuidsbubble,
          text: otulabelbubble,
          mode: "markers",
          marker: {
            size: samplevaluebubble,
            color: otuidsbubble
          }  

        }
      ]

      var bubbleLayout = {
        title: "Biodiversity Weekly Results",
        margin: {t: 0},
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
        margin: {t:30}
      }

      Plotly.newPlot("bubble", bubbledata, bubbleLayout);

      // Build Gauge Chart //
      //var otuidsgauge = selectedSample.otu_ids;
      //var otulabelgauge = selectedSample.otu_labels;
      //var samplevaluegauge = selectedSample.sample_values;

      var wfreq = data.metadata;
      d3.json("samples.json").then(function(data){
        wfreq = data.metadata.map(person => person.wfreq)[0];
        console.log(wfreq)
      })

      var gaugedata = [
        {
          domain: { x: [0,1], y:[0,1]}, 
          value: wfreq,
          title: { text: "Gauge Chart"},
          type: "indicator",
          mode: "gauge+number+delta",
          gauge: 
            {axis: {range:[0,10]}, 
            steps: [{range: [0,5], 
                    color: "green"},
                    {range: [5,8], 
                    color: "yellow"},
                    {range: [8,10], 
                    color: "red"}], 
            threshold: {line: {color: "black", width: 10},
                        thickness: 0.75, value: wfreq}
            }
        },
        
      ];
      
      var gaugelayout = {width: 600, height: 500, margin: {t: 0, b: 0}};
      Plotly.newPlot("gauge", gaugedata, gaugelayout);
  
    }); //END d3.json()  
  } //END buildCharts()
  
init();