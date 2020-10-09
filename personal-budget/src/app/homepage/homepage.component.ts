import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res : any) => {
      for (var i=0; i< res.myBudget.length; i++){
        this.dataSource.datasets[0].data[i]=res.myBudget[i].budget;
        this.dataSource.labels[i]=res.myBudget[i].title;
        this.createChart();
    }

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
