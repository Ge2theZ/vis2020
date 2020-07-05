import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import * as d3 from 'd3';
import {ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {DataService} from 'src/app/services/DataService';
import {SharePerYearPerPublisher} from '../../../../models/SharePerYearPerPublisher';
import {filter, map} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {InteractionService} from '../../../services/interaction.service';

//import SalesPerYearGenre from ;

@Component({
  selector: 'app-stacked-line-graph',
  templateUrl: './stacked-line-graph.component.html',
  styleUrls: ['./stacked-line-graph.component.css'],
})

export class StackedLineGraphComponent implements OnInit, OnDestroy {
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
  private mockGenreName:any;

  public inHomeView: boolean;
  public inGenreView: boolean;
  public inPublisherView: boolean;

  private Tooltip: any;
  public mockedDataSet =  [
    { from: 0, to: 20, data: []},
    { from: 20, to: 40, data: []}
    ];
  public mockedCurrentDatasetIndex = 0;

  private routerSubscription: any;
  private interactionSubscription: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService,
              private interactionService: InteractionService) {
    // configure margins and width/height of the graph
    this.margin = {top: 30, right: 30, bottom: 30, left: 50},
    this.width = 1400 - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {  
    this.svg = null;
    this.buildGenreGraph();

    this.determineRouterState();
    this.routerSubscription = this.router.events.subscribe(events => {
      if (events instanceof NavigationEnd) {
        this.determineRouterState();
      }
    })

    this.interactionSubscription = this.interactionService.gameCardHoverSubject$.subscribe(game => {
      if(game) {
        // this is an hover event, highlight the genre/publisher depending on view
        console.log("Hover over card!");
      } else {
        // this is a leave event, unhighlight what ever is highligted
        console.log("Unhover over card!");
      }
    })
  }

  /**
   * Workaround because route params are empty
   */
  determineRouterState(){
    let routeSnapshot: ActivatedRouteSnapshot = this.route.snapshot;
    let url: string = routeSnapshot["_routerState"]["url"];

    if(url.includes('home') && !url.includes('genre') && !url.includes('publisher')) {
      this.inHomeView = true;
      this.inGenreView = false;
      this.inPublisherView = false;
    } else if(url.includes('home') && url.includes('genre') && !url.includes('publisher')) {
      this.inHomeView = false;
      this.inGenreView = true;
      this.inPublisherView = false;
    } else if(url.includes('home') && url.includes('genre') && url.includes('publisher')) {
      this.inHomeView = false;
      this.inGenreView = false;
      this.inPublisherView = true;
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription.destroy();
    this.interactionSubscription.destroy();
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

  private preparePublisherPerYearData(factors:any, maxFactor:any) {
      
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
        groupData[i].values[j].share *= (factors[groupData[i].key]*0.01)*(100/maxFactor)
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
   this.mockGenreName=this.genreList[i];
   this.transitionToStreamChart(this.mockGenreName);
  }

 private transitionToStreamChart(genreID:any) {

  let maxFactor = 0;
  // calculate genre percentage per year
  let factors = {}
  for(var i = 1970; i <= 2020; i++) factors[i.toString()] = 0
  for(var i = 0; i < this.groupData.length; i++) {
    for(var j = 0; j < this.groupData[i].values.length; j++) {
      if (this.groupData[i].values[j].Genre == genreID) {
        factors[this.groupData[i].key] = this.groupData[i].values[j].Percentage_per_year
        maxFactor = Math.max(maxFactor, this.groupData[i].values[j].Percentage_per_year);
      }
    }
  }
  //this.data = this.dataService.getMarketShareForGenrePerYear(this.genreList[genreID]);
  console.log(genreID)
  let clusters = this.dataService.getClusteredMarketShareForGenrePerYear(genreID);
  console.log(clusters)
  let temp = []
  for (let i = 0; i < clusters[this.mockedCurrentDatasetIndex].data.length; i++) {
    temp = temp.concat(clusters[this.mockedCurrentDatasetIndex].data[i])
  }
  this.data = temp

  this.preparePublisherPerYearData(factors, maxFactor);
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
        this.Tooltip
        .style("opacity", 1)
        //d3.select(this)
        //  .style("stroke", "black")
        //  .style("opacity", 1)
      })
      .on("mouseover.b", (d,i) => {
        this.dataService.updateCoverCarousel(this.genreList[i], null, 1970, 2019, 7)
      })
      .on("mousemove", (d,i) => {
        d3.select(".tooltip")
          .html(this.genreList[i])
          .style("left", (d3.mouse(document.body)[0]-20) + "px")
          .style("top", (d3.mouse(document.body)[1]-70) + "px")
      })
      .on("mouseleave", (d) => {
        d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none");
        d3.selectAll(".areas").style("opacity",1.0);
        this.Tooltip
            .style("opacity", 0)
      })
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

        // create a tooltip
    this.Tooltip = d3.select("#my_chart").append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
  }

  nextDataSet(){
    if(!(this.mockedCurrentDatasetIndex+1 === this.mockedDataSet.length)) {
      this.mockedCurrentDatasetIndex++
    }
    this.transitionToStreamChart(this.mockGenreName);
    console.log("Next Dataset Clicked");
  }

  previousDataset(){
    if(!(this.mockedCurrentDatasetIndex === 0)) {
      this.mockedCurrentDatasetIndex--
    }
    this.transitionToStreamChart(this.mockGenreName);
    console.log("Previous Dataset Clicked")
  }
}
