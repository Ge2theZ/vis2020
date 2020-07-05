import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import * as d3 from 'd3';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from 'src/app/services/DataService';

//import SalesPerYearGenre from ;

@Component({
  selector: 'app-stacked-line-graph',
  templateUrl: './stacked-line-graph.component.html',
  styleUrls: ['./stacked-line-graph.component.css'],
})

export class StackedLineGraphComponent implements OnInit {
  data: any;
  data2: any;

  private margin: any;
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;

  private color: any;
  private stackedData: any;

  private genreList: any;
  private publisherList: any;
  private groupData: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService) {
    // configure margins and width/height of the graph
    this.margin = {top: 30, right: 30, bottom: 30, left: 50},
    this.width = 1400 - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {  
    this.svg = null;
    this.buildGenreGraph()
  }

  private buildGenreGraph() {
    this.dataService.readInGenreSalesPerYears().subscribe(data => {
      this.data = data;
      this.prepareGenrePerYearData();

      if (this.svg == null) {
        this.buildSvg()
      } else {
        this.svg.selectAll("*").remove();
      }

      this.addAxis();
      this.drawData();

    });
  }

  private prepareGenrePerYearData() {
    // group the data: one array for each value of the X axis.
    this.groupData = d3.nest()
      .key(function(d) { return d.Year;})
      .entries(this.data);

    // create set of all genres
    let set = new Set();
    this.data.forEach(data => {
      set.add(data.Genre);
    });
    this.genreList = Array.from(set);

    if (this.genreList.length > 1)
    // create color pallet
    this.color = d3.scaleOrdinal()
      .domain(this.genreList)
      .range(['#51574a', '#447c69', '#74c493', '#8e8c6d', '#e4bf80', '#e9d78e', '#e2975d', '#f19670', '#e16552', '#c94a53', '#be5168', '#a34974', '#993767', '#65387d', '#4e2472', '#9163b6', '#e279a3', '#e0598b', '#7c9fb0', '#5698c4', '#9abf88'
    ])

    // create key list with entry for every genre
    let genreKeys = new Array(this.genreList.length); // create an empty array with length 45
    
    for(var i = 0; i < genreKeys.length; i++)
    genreKeys[i] = i
    
    // Stack the data: each group will be represented on top of each other
    this.stackedData = d3.stack()
      .offset(d3.stackOffsetSilhouette) // stream chart
      .keys(genreKeys)
      .value(function(d, key){
        if ((typeof d.values[key] != "undefined")) {
          return d.values[key].Percentage_per_year }
        else
          return 0
      })
      (this.groupData)
  }

  private preparePublisherPerYearData(factors:any) {
      
    this.data.sort(function(a, b) {
      return a.year - b.year;
    });
    // group the data: one array for each value of the X axis.
    let groupData = d3.nest()
      .key(function(d) { return d.year;})
      .entries(this.data);
    let min = groupData[0].key
    let max = parseInt(groupData[groupData.length-1].key)+1

    let minArr = []
    for(var i = 1970; i < min; i++) minArr.push({key:i.toString(), values:[]})

    let maxArr = []
    for(var i = max; i <= 2020; i++) maxArr.push({key:i.toString(), values:[]})

    groupData = minArr.concat(groupData).concat(maxArr)

    for(var i = 0; i < groupData.length; i++) {
      for(var j = 0; j < groupData[i].values.length; j++) {
        groupData[i].values[j].share *= (factors[groupData[i].key]*0.01)
      }
    }


    // create set of all genres
    let set = new Set();
    this.data.forEach(data => {
      set.add(data.publisher);
    });
    this.genreList = Array.from(set);

    if (this.genreList.length > 1)
    // create color pallet
    this.color = d3.scaleOrdinal()
      .domain(this.genreList)
      .range(['#51574a', '#447c69', '#74c493', '#8e8c6d', '#e4bf80', '#e9d78e', '#e2975d', '#f19670', '#e16552', '#c94a53', '#be5168', '#a34974', '#993767', '#65387d', '#4e2472', '#9163b6', '#e279a3', '#e0598b', '#7c9fb0', '#5698c4', '#9abf88'
    ])

    // create key list with entry for every genre
    let publisherKeys = new Array(this.genreList.length); // create an empty array with length 45
    
    for(var i = 0; i < publisherKeys.length; i++)
    publisherKeys[i] = i
    
    // Stack the data: each group will be represented on top of each other
    this.stackedData = d3.stack()
      .offset(d3.stackOffsetSilhouette) // stream chart
      .keys(publisherKeys)
      .value(function(d, key){
        if ((typeof d.values[key] != "undefined")) {
          return d.values[key].share }
        else
          return 0
      })
      (groupData)
  }

  private buildSvg() {
    // append the svg object to the body of the page
    this.svg = d3.select("#my_chart")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right + 150)
      .attr("height", this.height + this.margin.top + this.margin.bottom + 20)
      .append("g")
      .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("text")
      .attr("x", (this.width / 2))             
      .attr("y", 0 - (this.margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .text("Genre Market Share Per Year");
  }

  private addAxisPublisher() {
    // Add X axis
    this.x = d3.scaleLinear()
      .domain([1970, 2020])
      //.domain(d3.extent(this.data, function(d) { return d.year; }))
      .range([ 0, this.width ]);
      
      this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x).ticks(5).tickFormat(d3.format("d")));

    this.svg.append("text")             
      .attr("transform",
            "translate(" + (this.width/2) + " ," + 
                           (this.height + this.margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Year");
    
    // Add Y axis
    this.y = d3.scaleLinear()
      .domain([-50, 50]) //stream chart
      //.domain([0, d3.max(this.data, function(d) { return + d.Percentage_per_year; })])
      .range([ this.height, 0 ]);
    //this.svg.append("g") // stream chart
    //  .call(d3.axisLeft(this.y));
    // text label for the y axis
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Market Share");  
  }
  
  
  private addAxis() {
    // Add X axis
    this.x = d3.scaleLinear()
      .domain(d3.extent(this.data, function(d) { return d.Year; }))
      .range([ 0, this.width ]);
      
      this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x).ticks(5).tickFormat(d3.format("d")));

    this.svg.append("text")             
      .attr("transform",
            "translate(" + (this.width/2) + " ," + 
                           (this.height + this.margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Year");
    
    // Add Y axis
    this.y = d3.scaleLinear()
      .domain([-50, 50]) //stream chart
      //.domain([0, d3.max(this.data, function(d) { return + d.Percentage_per_year; })])
      .range([ this.height, 0 ]);
    //this.svg.append("g") // stream chart
    //  .call(d3.axisLeft(this.y));
    // text label for the y axis
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Market Share");  
  }

  private mouseleave(d) {
    //Tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    d3.selectAll(".areas").style("opacity",1.0)
  }

  private mouseclick(d,i) { 
    console.log("Genre Id: " + i);
    console.log("Genre Name: " + this.genreList[i]);
    
   // Check if data is already calculated
   if (this.dataService.isMarketShareForGenrePerYearCached(this.genreList[i])) {
     let yourData = this.dataService.getCachedMarketShareForGenrePerYear(this.genreList[i])// here is your data
   } else { // calculate data
     this.dataService.getMarketShareForGenrePerYear(this.genreList[i]);
   }

   this.router.navigate(['home/genre', this.genreList[i]]);
   this.transitionToStreamChart(i);
  }

 private transitionToStreamChart(genreID:any) {
  let genreName=this.genreList[genreID];

  // calculate genre percentage per year
  let factors = {}
  for(var i = 1970; i <= 2020; i++) factors[i.toString()] = 0
  for(var i = 0; i < this.groupData.length; i++) {
    for(var j = 0; j < this.groupData[i].values.length; j++) {
      if (this.groupData[i].values[j].Genre == genreName) factors[this.groupData[i].key] = this.groupData[i].values[j].Percentage_per_year
    }
  }


  this.data = this.dataService.getMarketShareForGenrePerYear(this.genreList[genreID]);

  this.preparePublisherPerYearData(factors);
  this.svg.selectAll("*").remove(); 
  this.addAxisPublisher();
  this.drawData();
 }


 private drawData() {

  // Add the areas
  this.svg
    .selectAll("mylayers")
    .data(this.stackedData)
    .enter()
    .append("path")
      .attr("class", "myArea")
      .style("fill", (d: any) => { 
        return this.color(d.key)
      })
        
      .attr("d", d3.area()
        .curve(d3.curveBasis)
        .x( (d: any, i) => this.x(d.data.key) )
        .y0( (d: any) => this.y(d[1]) ) 
        .y1( (d: any) => this.y(d[0]) ) 
      )
      .on("mouseover.a", (d,i) => {
        d3.selectAll(".myArea").style("opacity", (d:any, g:any) => {if (g==i) {return 1.0} else return 0.2})
        d3.selectAll(".areas").style("opacity", (d:any, g:any) =>   {if (this.genreList.length-1-g==i) {return 1.0} else return 0.2})

      })
      .on("mouseover.b", (d,i) => {
        this.dataService.updateCoverCarousel(this.genreList[i], null, 1970, 2019, 7)
      })
      .on("mouseleave", this.mouseleave)
      .on("click", (d:any, i:any) => this.mouseclick(d,i));

  // Add one dot in the legend for each name.
  let size = 12;
  this.svg.selectAll("myrect")
    .data(this.stackedData)
    .enter()
    .append("rect")
      .attr("x", this.width+10)
      .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", (d: any) =>  this.color(this.genreList.length-1-d.key) ) // reverse legend to adjust for area order 

  // Add one dot in the legend for each name.
  this.svg.selectAll("mylabels")
    .data(this.stackedData)
    .enter()
    .append("text")
      .attr("class", "areas")
      .attr("x", this.width + size*1.2 +10)
      .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", (d: any) =>  this.color(this.genreList.length-1-d.key) ) // reverse legend to adjust for area order 
      .text((d:any, i:any) =>  this.genreList[this.genreList.length-1-i]) // reverse legend to adjust for area order 
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  }
}
