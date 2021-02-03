const width = 1800;
const height = 840;
const leftPadding = 80;
const rightPadding = 30;
const topPadding = 30;
const botPadding = 80;

d3.select("body").append("h1")
    .text("Doping in Professional Bicycle Racing").attr("id", "title");

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(data => {
        const lowestTime = data[0].Time.split(":");
        const highestTime = data[data.length-1].Time.split(":");

        const xScale = d3.scaleLinear()
                        .domain([parseInt(d3.min(data, d => d.Year))-1,
                            parseInt(d3.max(data, d => d.Year))+1])
                        .range([leftPadding, width - rightPadding]);

        const yScale = d3.scaleTime()
                        .domain([new Date(lowestTime[0] * 60000 + lowestTime[1] * 1000),
                        new Date(highestTime[0] * 60000 + highestTime[1]* 1000)])
                        .range([topPadding, height - botPadding]);
        
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        const svg = d3.select("body").append("svg")
                        .attr("width", width).attr("height", height)
                        .style("background-color", "#DDDDDD");
        
        svg.selectAll("circle").data(data).enter().append("circle")
            .attr("cx", (d, i) => {
                return xScale(d.Year);
            })
            .attr("cy", (d, i) => {
                let time = d.Time.split(":");
                return height + topPadding - botPadding - yScale(new Date(time[0] * 60000 + time[1] * 1000));
            })
            .attr("r", 5);
        
        svg.append("g").attr("id", "x-axis")
            .attr("transform", "translate(0," + (height - botPadding) + ")")
            .call(xAxis);

        svg.append("g").attr("id", "y-axis")
            .attr("transform", "translate(" + leftPadding + ", 0)")
            .call(yAxis);

        d3.select("body").append("text").text(JSON.stringify(data));
    });