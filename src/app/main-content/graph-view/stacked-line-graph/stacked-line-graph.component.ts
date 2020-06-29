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

  // mock data
  mockData = [
    {Year: 10, Genre: "genre1", Percentage_per_year: 5},
    {Year: 10, Genre: "genre2", Percentage_per_year: 15},
    {Year: 10, Genre: "genre3", Percentage_per_year: 80},

    {Year: 20, Genre: "genre1", Percentage_per_year: 25},
    {Year: 20, Genre: "genre2", Percentage_per_year: 30},
    {Year: 20, Genre: "genre3", Percentage_per_year: 45},

    {Year: 30, Genre: "genre1", Percentage_per_year: 65},
    {Year: 30, Genre: "genre2", Percentage_per_year: 25},
    {Year: 30, Genre: "genre3", Percentage_per_year: 10},

    {Year: 40, Genre: "genre1", Percentage_per_year: 60},
    {Year: 40, Genre: "genre2", Percentage_per_year: 15},
    {Year: 40, Genre: "genre3", Percentage_per_year: 25},

    {Year: 50, Genre: "genre1", Percentage_per_year: 65},
    {Year: 50, Genre: "genre2", Percentage_per_year: 25},
    {Year: 50, Genre: "genre3", Percentage_per_year: 10}
  ];

  private margin: any;
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;

  private color: any;
  private stackedData: any;

  private genreList: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService) {
    // configure margins and width/height of the graph
    this.margin = {top: 30, right: 30, bottom: 30, left: 50},
    this.width = 1000 - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;
  }

  async ngOnInit() {  
    // save context in variable to make it accessible inside callback function
    //let context = this;

    //console.log(test);

    // load data from csv and handle data in callback
    /*
    d3.csv("https://raw.githubusercontent.com/Ge2theZ/vis2020/master/data/SalesPerYearGenre.csv")
      .then( function(data) { // callback when csv finished loading
        context.data = data;
        //context.data = context.mockData;
        context.prepareData();
        context.buildSvg();
        context.addAxis();
        context.drawData();
        return data
      });
    */
    
    this.data = await d3.json("https://raw.githubusercontent.com/Ge2theZ/vis2020/master/data/SalesPerYearGenre.json");
    this.prepareData();
    this.buildSvg();
    this.addAxis();
    this.drawData();

  }

  private prepareData() {
    // group the data: one array for each value of the X axis.
    let groupData = d3.nest()
      .key(function(d) { return d.Year;})
      .entries(this.data);

    // create set of all genres
    let set = new Set();
    this.data.forEach(data => {
      set.add(data.Genre);
    });
    this.genreList = Array.from(set);

    // create key list with entry for every genre
    let genreKeys = new Array(this.genreList.length); // create an empty array with length 45
    
    for(var i = 0; i < genreKeys.length; i++)
    genreKeys[i] = i
    
    // Stack the data: each group will be represented on top of each other
    this.stackedData = d3.stack()
      .keys(genreKeys)
      .value(function(d, key){
        if ((typeof d.values[key] != "undefined")) {
          return d.values[key].Percentage_per_year }
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
      .domain([0, d3.max(this.data, function(d) { return + d.Percentage_per_year; })])
      .range([ this.height, 0 ]);
    this.svg.append("g")
      .call(d3.axisLeft(this.y));
    // text label for the y axis
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Market Share (%)");  
  }

  // Three function that change the tooltip when user hover / move / leave a cell
  public mouseover(d, i) {
    //Tooltip.style("opacity", 1)
    d3.selectAll(".myArea").style("opacity", .2)
    d3.selectAll(".areas").style("opacity", .2)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  }

  private mouseleave(d) {
    //Tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
  }

  private mouseclick(d,i) { 
   console.log("Genre Id: " + i);
   console.log("Genre Name: " + this.genreList[i]);
   //this.dataService.updateCoverCarousel(this.genreList[i], 1970, 2019)
   this.router.navigate(['home/genre', this.genreList[i]]);
  }

 private drawData() {
  // create color pallet
  this.color = d3.scaleOrdinal()
    .domain(this.genreList)
    .range(['#51574a', '#447c69', '#74c493', '#8e8c6d', '#e4bf80', '#e9d78e', '#e2975d', '#f19670', '#e16552', '#c94a53', '#be5168', '#a34974', '#993767', '#65387d', '#4e2472', '#9163b6', '#e279a3', '#e0598b', '#7c9fb0', '#5698c4', '#9abf88'
  ])

  // Add the areas
  this.svg
    .selectAll("mylayers")
    .data(this.stackedData)
    .enter()
    .append("path")
      .attr("class", "myArea")
      .style("fill", (d: any) =>  this.color(d.key) )
      .attr("d", d3.area()
        .curve(d3.curveBasis)
        .x( (d: any, i) => this.x(d.data.key) )
        .y0( (d: any) => this.y(d[0]) ) 
        .y1( (d: any) => this.y(d[1]) ) 
      )
      .on("mouseover.a", this.mouseover)
      .on("mouseover.b", (d,i) => {
        this.dataService.updateCoverCarousel(this.genreList[i], 1970, 2019)
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
