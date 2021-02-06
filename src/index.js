const width = screen.width * 9/10;
const height = screen.height * 8/10;
const leftPadding = 80;
const rightPadding = 30;
const topPadding = 30;
const botPadding = 80;

const MINUTE = 60000;
const SECOND = 1000;

d3.select("body").append("h1")
    .text("Doping in Professional Bicycle Racing").attr("id", "title");

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(data => {
        const lowestTime = data[0].Time.split(":");
        const highestTime = data[data.length-1].Time.split(":");

        var tooltip = d3.select('body').append('div')
            .attr("id", "tooltip")
            .style("width", "200px")
            .style("height", "150px")
            .style("opacity", 0)
            .style("text-align", "center")
            .attr("data-year", "")
            .style("left", width - 100 + "px")
            .style("top", "0px");
        
        var nameText = tooltip.append("text");
        var nationalityText = tooltip.append("text");
        var timeText = tooltip.append("text");
        var yearText = tooltip.append("text");
        var dopingText = tooltip.append("text");

        const xScale = d3.scaleLinear()
                        .domain([parseInt(d3.min(data, d => d.Year))-1,
                            parseInt(d3.max(data, d => d.Year))+1])
                        .range([leftPadding, width - rightPadding]);

        const yScale = d3.scaleTime()
                        .domain([new Date(lowestTime[0] * MINUTE + lowestTime[1] * SECOND),
                        new Date(highestTime[0] * MINUTE + highestTime[1]* SECOND)])
                        .range([topPadding, height - botPadding]);
        
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        const svg = d3.select("body").append("svg")
                        .attr("width", width).attr("height", height);
        
        svg.selectAll("circle").data(data).enter().append("circle")
            .attr("class", "dot")
            .attr("data-xvalue", (d, i) => d.Year)
            .attr("data-yvalue", (d, i) => {
                let time = d.Time.split(":");
                return new Date(time[0] * MINUTE + time[1] * SECOND);
            })
            .attr("cx", (d, i) => {
                return xScale(d.Year);
            })
            .attr("cy", (d, i) => {
                let time = d.Time.split(":");
                return yScale(new Date(time[0] * MINUTE + time[1] * SECOND));
            })
            .attr("r", 10)
            .style("fill", (d, i) => {
                if (d.Doping == "") {
                    return "rgba(0, 0, 255, 0.5)";
                }
                else {
                    return "rgba(255, 0, 0, 0.5)";
                }
            })
            .on("mouseover", (d, i) => {
                let time = d.Time.split(":");
                tooltip.style("opacity", 1)
                    .style("top", yScale(new Date(time[0] * MINUTE + time[1] * SECOND)) + "px")
                    .attr("data-year", d.Year);
                if (xScale(d.Year) < width/2) {
                    tooltip.style("left", xScale(d.Year) + 100 + "px");
                }
                else {
                    tooltip.style("left", xScale(d.Year) - 120 + "px");
                }
                nameText.text("Name: " + d.Name);
                nationalityText.text("Nationality: " + d.Nationality);
                timeText.text("Time: " + d.Time);
                yearText.text("Year: " + d.Year);
                dopingText.text(d.Doping);
            })
            .on("mouseout", (d, i) => {
                tooltip.style("opacity", 0)
                    .style("left", width - 100 + "px")
                    .style("top", "0px");
            });
        
        svg.append("g").attr("id", "x-axis")
            .attr("transform", "translate(0," + (height - botPadding) + ")")
            .call(xAxis.tickFormat(x => x.toString()));

        svg.append("g").attr("id", "y-axis")
            .attr("transform", "translate(" + leftPadding + ", 0)")
            .call(yAxis.tickFormat(d3.timeFormat("%M:%S")));
        
        var legend = d3.select('body').append('div')
            .attr("id", "legend")
            .style("width", "300px")
            .style("height", "150px")
            .style("opacity", 1)
            .style("top", topPadding + "px")
            .style("left", width - 200 + "px");

        legend.append("div")
            .style("width", "20px")
            .style("height", "20px")
            .style("background-color", "red");

        legend.append("label").text("Alleged Doping");

        legend.append("div")
            .style("width", "20px")
            .style("height", "20px")
            .style("background-color", "blue");

        legend.append("label").text("No Alleged Doping");
    });