import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {


  public dataSource = {
    datasets: [{
        data: [],
        backgroundColor : [
            '#ffcd56',
            '#ff6384',
            '#36a2eb',
            '#fd6b19',
            '#1A5276',
            '#1ABC9C',
            '#BB8FCE',
            '#7B7D7D'
        ]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: []
};



private dataD3 = [{ label: '', value: 1 }];
public dataMap = [];

margin = {top: 20, right: 20, bottom: 30, left: 50};
width: number;
height: number;
radius: number;

arc: any;
labelArc: any;
labelPer: any;
pie: any;
color: any;
svg: any;


initSvg() {
  this.color = d3Scale.scaleOrdinal()
      .range(['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19', '#1A5276', '#1ABC9C', '#BB8FCE', '#7B7D7D']);
  this.arc = d3Shape.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(80);
  this.labelArc = d3Shape.arc()
      .outerRadius(this.radius - 40)
      .innerRadius(this.radius - 40);

  this.labelPer = d3Shape.arc()
      .outerRadius(this.radius - 80)
      .innerRadius(this.radius - 80);

  this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.value);

  this.svg = d3.select('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + Math.min(this.width, this.height) + ' ' + Math.min(this.width, this.height))
      .append('g')
      .attr('transform', 'translate(' + Math.min(this.width, this.height) / 2 + ',' + Math.min(this.width, this.height) / 2 + ')');
}

// tslint:disable-next-line: typedef
drawPie() {
  const g = this.svg.selectAll('.arc')
      .data(this.pie( this.dataD3))
      .enter().append('g')
      .attr('class', 'arc');
  g.append('path').attr('d', this.arc)
      .style('fill', (d: any) => this.color(d.data.label) );
  g.append('text').attr('transform', (d: any) => 'translate(' + this.labelArc.centroid(d) + ')')
      .attr('dy', '.35em')
      .text((d: any) => d.data.label);

  g.append('text').attr('transform', (d: any) => 'translate(' + this.labelPer.centroid(d) + ')')
      .attr('dy', '.35em')
      .text((d: any) => d.data.value );
}


  constructor(private http: HttpClient,  private dataService: DataService) {
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;
   }

  ngOnInit(): void {
    this.dataService.getBudget()
    .subscribe((res : any) => {
      for (var i=0; i< res.myBudget.length; i++){
        this.dataSource.datasets[0].data[i]=res.myBudget[i].budget;
        this.dataSource.labels[i]=res.myBudget[i].title;

        var obj = { label: res.myBudget[i].title, value: res.myBudget[i].budget };
        this.dataMap[i] = obj;
        }
      this.dataD3 = JSON.parse(JSON.stringify(this.dataMap));
      this.createChart();
      this.initSvg();
      this.drawPie();
      });
  }


  createChart() {
    //var ctx = document.getElementById('myChart').getContext('2d');
    // By default document.getElementById returns a HTMLElementtype which is a generic type. In order to make your app understand it is a canvas element you need to cast it using <CastedToType> syntax

    const canvas = <HTMLCanvasElement> document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
    var myPieChart = new Chart(ctx,{
        type: 'pie',
        data: this.dataSource
    });
}
}
