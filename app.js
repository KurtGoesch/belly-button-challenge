const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Fetch JSON data and print to console
d3.json(url).then((data) => {
    return console.log(data);
});

//Initialize selector object to select the dataset and populate dropdown object
function init() {

let selector = d3.select("#selDataset");

d3.json(url).then((data) => {
    
    let sampleNames = data.names;
    for (let i = 0; i < sampleNames.length; i++){
        let name = sampleNames[i]
        selector.append("option").text(name).property("value", name)
    };

    // Set the first sample from the array
    let firstSample = sampleNames[0]
    console.log(firstSample);

    // Build the plots
    demoInfo(firstSample);
    barChart(firstSample);
    bubbleChart(firstSample);
    // buildGaugeChart(firstSample);

})
};

//Function to build demographic info 
function demoInfo(sample) {
d3.json(url).then((data) => {

    let metadata = data.metadata;
    let results = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(results)
    let result = results[0];

    d3.select("#sample-metadata").html("")
    Object.entries(result).forEach(([key, value]) => {

        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);

    });

});

};

//Function to build the bar chart
function barChart(sample) {

    d3.json(url).then((data) => {
    
        //Retrieves all sample data and assign to variables for data manipulation
        let samples = data.samples;
        let results = samples.filter(sampleObj => sampleObj.id == sample);
        let result = results[0];
        let sample_values = result.sample_values;
        let otu_id = result.otu_ids;
        let otu_labels = result.otu_labels;
        
        //Print to the console to verify the data is properly being filtered in the dropdown menu
        console.log(otu_id, otu_labels, sample_values);
        
        // Asigns the top ten ids from the source array and returns the selected into a new array
        // Values are sorted to display the top 10 OTU values from descending order
        let yticks = otu_id.slice(0, 10).map(name => `OTU ${name}`).reverse();
        let xticks = sample_values.slice(0, 10).reverse();
        let labels = otu_labels.slice(0, 10).reverse();
        
        //A trace is assigned to format the bar graph
        var trace_bar = {
            x: xticks,
            y: yticks,
            text: labels,
            type: 'bar',
            orientation: 'h'
        }

// Layout is assigned to present a title in the graph and format the margins
        let layout = {
            title: "The Top 10 OTU's Present",
            margin: {l: 100, r: 100, t: 100, b: 100}};

     Plotly.newPlot("bar", [trace_bar], layout);

    });
};



// Function that builds the bubble chart
function bubbleChart(sample) {
    d3.json(url).then((data) => {

        //Retrieves all sample data and assign to variables for data manipulation
        let samples = data.samples;
        let results = samples.filter(sampleObj => sampleObj.id == sample);
        let result = results[0];
        let sample_values = result.sample_values;
        let otu_id = result.otu_ids;
        let otu_labels = result.otu_labels;


         //A trace is assigned to format the bubble graph graph
        let trace_bubble = {
            x: otu_id,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_id,
                colorscale: "Earth"}
        };
        // Layout is assigned to present a title in the graph and provide additional data
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace_bubble], layout)});
};

//Function to update the dashboard when a new sample is selected
function optionChanged(newSample) {
    barChart(newSample) 
    demoInfo(newSample)
    bubbleChart(newSample) 

};

// Call initialize
init()