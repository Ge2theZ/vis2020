import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import * as d3 from 'd3';
import {ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {DataService} from 'src/app/services/DataService';
import {SharePerYearPerPublisher} from '../../../../models/SharePerYearPerPublisher';
import {filter, map} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {InteractionService} from '../../../services/interaction.service';
import { timeStamp } from 'console';

//import SalesPerYearGenre from ;

@Component({
  selector: 'app-stacked-line-graph',
  templateUrl: './stacked-line-graph.component.html',
  styleUrls: ['./stacked-line-graph.component.css'],
})

export class StackedLineGraphComponent implements OnInit, OnDestroy {
  data: any;
  data2: any;

  title: any = "Evolution of Genre Popularity in Video Games";

  private margin: any;
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;

  private color: any;
  private stackedGraphData: any;

  private labelList: any;
  private genreYearGroupData: any;

  public inHomeView: boolean;
  public inGenreView: boolean;
  public inPublisherView: boolean;

  private Tooltip: any;

  public currentClusterIndex = 0;
  public clusteredDataSet: any;

  private genreName: any;
  private publisherName: any;

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
    
    this.dataService.onReady$.subscribe(ready => {
      if (ready) {
        this.data = this.dataService.genreSalesPerYears;
        this.prepareHomeData();

        if (this.svg == null) {
          this.buildSvg()
        } else {
          this.svg.selectAll("*").remove();
        }
        this.handleTransitions()
        this.updateToolTip();
      }
    });
    
    

    this.routerSubscription = this.router.events.subscribe(events => {
      if (events instanceof NavigationEnd) {
        this.handleTransitions()       
      }
    });

    this.interactionSubscription = this.interactionService.gameCardHoverSubject$.subscribe(game => {
      if(game) {
        // this is an hover event, highlight the genre/publisher depending on view
        if (this.inHomeView) {
          d3.selectAll(".areaLabel").style("opacity", (d:any, g:any) => {if (this.labelList[this.labelList.length-1-g]==game.genre) {return 1.0}else return 0.2})
          d3.selectAll(".areaRect").style("opacity", (d:any, g:any) => {if (this.labelList[this.labelList.length-1-g]==game.genre) {return 1.0}else return 0.2})
          d3.selectAll(".myArea").style("opacity", (d:any, g:any) => {if (this.labelList[g]==game.genre) {return 1.0} else return 0.2})

        } else if (this.inGenreView) {
          d3.selectAll(".areaLabel").style("opacity", (d:any, g:any) => {if (this.labelList[this.labelList.length-1-g]==game.publisher) {return 1.0}else return 0.2})
          d3.selectAll(".areaRect").style("opacity", (d:any, g:any) => {if (this.labelList[this.labelList.length-1-g]==game.publisher) {return 1.0}else return 0.2})
          d3.selectAll(".myArea").style("opacity", (d:any, g:any) => {if (this.labelList[g]==game.publisher) {return 1.0} else return 0.2})
        }

      } else {
        // this is a leave event, unhighlight what ever is highligted
        d3.selectAll(".areaLabel").style("opacity", 1.0);
        d3.selectAll(".areaRect").style("opacity", 1.0);
        d3.selectAll(".myArea").style("opacity", 1.0);
      }
    })
  }

  private handleTransitions() {
    this.determineRouterState();
    this.getParameterFromUrl();
    this.currentClusterIndex = 0;
    if (this.inHomeView) {
      this.title = "Evolution of Genre Popularity in Video Games"
      this.transitionToHome();
    } else if (this.inGenreView) {
      this.title =  "Evolution of " + this.genreName + " genre by publisher"
      this.transitionToGenre(this.genreName);
    } else if (this.inPublisherView) {
      this.title = "Evolution of " + this.publisherName + " games in " + this.genreName + " genre"
      this.transitionToPublisher(this.genreName, this.publisherName);
    }
  }

  private getParameterFromUrl() {
    let routeSnapshot: ActivatedRouteSnapshot = this.route.snapshot;
    let url: string = routeSnapshot["_routerState"]["url"];

    let splitted = url.split('/');
    this.genreName = ''
    this.publisherName = ''
    if (this.inGenreView)
    {
      this.genreName = splitted[splitted.map(function(e) { return e; }).indexOf('genre')+1].split('%20').join(' ');
    } else if (this.inPublisherView) {
      this.genreName = splitted[splitted.map(function(e) { return e; }).indexOf('genre')+1].split('%20').join(' ');
      this.publisherName = splitted[splitted.map(function(e) { return e; }).indexOf('publisher')+1].split('%20').join(' ');
    }

  }

  /**
   * Workaround because route params are empty
   */
  private determineRouterState(){
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
    //this.routerSubscription.unsubscribe();
    this.interactionSubscription.unsubscribe();
  }

  private transitionToHome() {
    this.dataService.onReady$.subscribe(ready => {
      if (ready) {
        this.data = this.dataService.genreSalesPerYears;
        this.prepareHomeData();

      if (this.svg == null) {
        this.buildSvg()
      } else {
        this.svg.selectAll("*").remove();
      }

      this.addAxisHome();
      this.updatePath();
      this.updateLegend();
      }
    });
  }

  private transitionToGenre(genreName:any) {

    // calculate genre percentage per year
    let factors = {}
    for(var i = 1970; i <= 2020; i++) factors[i.toString()] = 0
    for(var i = 0; i < this.genreYearGroupData.length; i++) {
      for(var j = 0; j < this.genreYearGroupData[i].values.length; j++) {
        if (this.genreYearGroupData[i].values[j].Genre == genreName) {
          factors[this.genreYearGroupData[i].key] = this.genreYearGroupData[i].values[j].Percentage_per_year
        }
      }
    }
    //this.data = this.dataService.getMarketShareForGenrePerYear(this.genreList[genreID]);

    this.clusteredDataSet = this.dataService.getClusteredMarketShareForGenrePerYear(genreName);
  
    let temp = []
    for (let i = 0; i < this.clusteredDataSet[this.currentClusterIndex].data.length; i++) {
      temp = temp.concat(this.clusteredDataSet[this.currentClusterIndex].data[i])
    }
    this.data = temp
  
    this.prepareGenreData(factors);
    this.svg.selectAll("*").remove(); 
    this.addAxisGenre();
    this.updatePath();
    this.updateLegend();
  }

  private transitionToPublisher(genreName:any, publisherName:any) {
    // calculate genre percentage per year
    let factors = {}
    for(var i = 1970; i <= 2020; i++) factors[i.toString()] = 0
    for(var i = 0; i < this.genreYearGroupData.length; i++) {
      for(var j = 0; j < this.genreYearGroupData[i].values.length; j++) {
        if (this.genreYearGroupData[i].values[j].Genre == genreName) {
          factors[this.genreYearGroupData[i].key] = this.genreYearGroupData[i].values[j].Percentage_per_year
        }
      }
    }

    let unfiltered = this.dataService.getMarketShareForGenrePerYear(genreName);
    let filtered = [];
    unfiltered.forEach(element => {
      if (element.publisher == publisherName) {
        filtered.push(element)
      }
    });
    this.data = filtered

    //this.clusteredDataSet = this.dataService.getClusteredMarketShareForGenrePerYear(genreName);
  
    this.prepareGenreData(factors);
    this.svg.selectAll("*").remove(); 
    this.addAxisGenre();
    this.updatePath();
    this.updateLegend();
  }

  private prepareHomeData() {
    // group the data: one array for each value of the X axis.
    this.genreYearGroupData = d3.nest()
      .key(function(d) { return d.Year;})
      .entries(this.data);

    // create set of all genres
    let set = new Set();
    this.data.forEach(data => {
      set.add(data.Genre);
    });
    this.labelList = Array.from(set);

    if (this.labelList.length > 1)
    // create color pallet
    this.color = d3.scaleOrdinal()
      .domain(this.labelList)
      .range(['#51574a', '#447c69', '#74c493', '#8e8c6d', '#e4bf80', '#e9d78e', '#e2975d', '#f19670', '#e16552', '#c94a53', '#be5168', '#a34974', '#993767', '#65387d', '#4e2472', '#9163b6', '#e279a3', '#e0598b', '#7c9fb0', '#5698c4', '#9abf88'
    ])

    // create key list with entry for every genre
    let genreKeys = new Array(this.labelList.length); // create an empty array with length 45
    
    for(var i = 0; i < genreKeys.length; i++)
    genreKeys[i] = i
    
    // Stack the data: each group will be represented on top of each other
    this.stackedGraphData = d3.stack()
      //.offset(d3.stackOffsetSilhouette) // stream chart
      .keys(genreKeys)
      .value(function(d, key){
        if ((typeof d.values[key] != "undefined")) {
          return d.values[key].Percentage_per_year }
        else
          return 0
      })
      (this.genreYearGroupData)
  }

  private prepareGenreData(factors:any) {
      
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
    this.labelList = Array.from(set);

    if (this.labelList.length > 1)
    // create color pallet
    this.color = d3.scaleOrdinal()
      .domain(this.labelList)
      .range(['#51574a', '#447c69', '#74c493', '#8e8c6d', '#e4bf80', '#e9d78e', '#e2975d', '#f19670', '#e16552', '#c94a53', '#be5168', '#a34974', '#993767', '#65387d', '#4e2472', '#9163b6', '#e279a3', '#e0598b', '#7c9fb0', '#5698c4', '#9abf88'
    ])

    // create key list with entry for every genre
    let publisherKeys = new Array(this.labelList.length); // create an empty array with length 45
    
    for(var i = 0; i < publisherKeys.length; i++)
    publisherKeys[i] = i
    
    // Stack the data: each group will be represented on top of each other
    this.stackedGraphData = d3.stack()
      //.offset(d3.stackOffsetSilhouette) // stream chart
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

  private addAxisGenre() {
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
    
    let domain = this.getStackedDomain(this.stackedGraphData);
    // Add Y axis
    this.y = d3.scaleLinear()
      .domain(domain)
      //.domain([-50, 50]) //stream chart
      //.domain([0, d3.max(this.data, function(d) { return + d.Percentage_per_year; })])
      .range([ this.height, 0 ]);
    this.svg.append("g") // stream chart
      //.call(d3.axisLeft(this.y))//.ticks(3).tickFormat((d,i) => tickLabels[i]));
      //.call(d3.axisLeft(this.y).ticks(3).tickFormat((d,i) => tickLabels[i]));
      .call(d3.axisLeft(this.y).ticks(5).tickFormat((d,i) => {return (d).toFixed(2)}));
    // text label for the y axis
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Market Share");  
  }
  
  private addAxisHome() {
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
      .domain(this.getStackedDomain(this.stackedGraphData))
      .range([ this.height, 0 ]);

    let tickLabels = [0, 50, 100];
    this.svg.append("g") // stream chart
      .call(d3.axisLeft(this.y).ticks(3).tickFormat((d,i) => tickLabels[i]));
    // text label for the y axis
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Market Share");  
  }

  private getStackedDomain(stackedData:any) {
    let tempMax = 0;
    let tempMin = 0;
    this.stackedGraphData.forEach(element => {
      element.forEach(element => {
        element.forEach(element => {
          tempMax = Math.max(tempMax, element);
          tempMin = Math.min(tempMin, element);
        });
      });
    });
    return [tempMin, tempMax]
  }

  private mouseClick(d,i) {    
    // Check if data is already calculated
    //if (this.dataService.isMarketShareForGenrePerYearCached(this.genreList[i])) {
    //  let yourData = this.dataService.getCachedMarketShareForGenrePerYear(this.genreList[i])// here is your data
    //} else { // calculate data
    //  this.dataService.getMarketShareForGenrePerYear(this.genreList[i]);
    //}
    if (this.inHomeView) {
      this.router.navigate(['home/genre', this.labelList[i]]);
    } else if (this.inGenreView) {
      this.router.navigate(['home/genre', this.genreName,'publisher',this.labelList[i]]);
    }
   
  }

  private updatePath() {
    // Add the areas
    this.svg
      .selectAll("mylayers")
      .data(this.stackedGraphData)
      .enter()
      .append("path")
        .attr("class", "myArea")
        .style("fill", (d: any) => { 
          return this.color(d.key)
        })

        .style("cursor", "pointer")
          
        .attr("d", d3.area()
          .curve(d3.curveBasis)
          .x( (d: any, i) => this.x(d.data.key) )
          .y0( (d: any) => this.y(d[1]) ) 
          .y1( (d: any) => this.y(d[0]) ) 
        )
        .on("mouseover.a", (d,i) => {
          d3.selectAll(".myArea").style("opacity", (d:any, g:any) => {if (g==i) {return 1.0} else return 0.2})
          d3.selectAll(".areaLabel").style("opacity", (d:any, g:any) =>   {if (this.labelList.length-1-g==i) {return 1.0} else return 0.2})
          d3.selectAll(".areaRect").style("opacity", (d:any, g:any) =>   {if (this.labelList.length-1-g==i) {return 1.0} else return 0.2})
          this.Tooltip
            .style("opacity", 1)
        })
        .on("mouseover.b", (d,i) => {
          if(this.inGenreView){
            this.dataService.updateCoverCarousel(this.genreName, this.labelList[i], 1970, 2019, 7)
          } else {
            this.dataService.updateCoverCarousel(this.labelList[i], null, 1970, 2019, 7)
          }
        })
        .on("mousemove", (d,i) => {
          d3.select(".tooltip")
            .html(this.labelList[i])
            .style("left", (d3.mouse(document.body)[0]-20) + "px")
            .style("top", (d3.mouse(document.body)[1]-70) + "px")
        })
        .on("mouseleave", (d) => {
          d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none");
          d3.selectAll(".areaLabel").style("opacity",1.0);
          d3.selectAll(".areaRect").style("opacity",1.0);
          this.Tooltip
              .style("opacity", 0)
        })
        .on("click", (d:any, i:any) => this.mouseClick(d,i));
  }

  private updateLegend() {
    // Add one dot in the legend for each name.
    let size = 12;
    this.svg.selectAll("areaRect")
      .data(this.stackedGraphData)
      .enter()
      .append("rect")
        .attr("class", "areaRect")
        .attr("x", this.width+10)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) 
        .attr("width", size)
        .attr("height", size)
        .style("fill", (d: any) =>  this.color(this.labelList.length-1-d.key) ) 

    // Add one dot in the legend for each name.
    this.svg.selectAll("mylabels")
      .data(this.stackedGraphData)
      .enter()
      .append("text")
        .attr("class", "areaLabel")
        .attr("x", this.width + size*1.2 +10)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) 
        .style("fill", (d: any) =>  this.color(this.labelList.length-1-d.key) ) 
        .text((d:any, i:any) =>  this.labelList[this.labelList.length-1-i]) 
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("cursor", "pointer")
        .on("mouseover", (d,i) => {
          d3.selectAll(".myArea").style("opacity", (d:any, g:any) => {if (this.labelList.length-1-g==i) {return 1.0} else return 0.2})
          d3.selectAll(".areaLabel").style("opacity", (d:any, g:any) =>   {if (g==i) {return 1.0} else return 0.2})
          d3.selectAll(".areaRect").style("opacity", (d:any, g:any) =>   {if (g==i) {return 1.0} else return 0.2})

          if(this.inGenreView){
            this.dataService.updateCoverCarousel(this.genreName, this.labelList[this.labelList.length-1-i], 1970, 2019, 7)
          } else {
            this.dataService.updateCoverCarousel(this.labelList[this.labelList.length-1-i], null, 1970, 2019, 7)
          }
        })
        .on("mouseleave", (d) => {
          d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none");
          d3.selectAll(".areaLabel").style("opacity",1.0);
          d3.selectAll(".areaRect").style("opacity",1.0);
        })
        .on("click", (d:any, i:any) => this.mouseClick(d,this.labelList.length-1-i));
  }

  private updateToolTip() {
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
    if(!(this.currentClusterIndex+1 === this.clusteredDataSet.length)) {
      this.currentClusterIndex++
    }
    this.transitionToGenre(this.genreName);
  }

  previousDataset(){
    if(!(this.currentClusterIndex === 0)) {
      this.currentClusterIndex--
    }
    this.transitionToGenre(this.genreName);
  }
}
