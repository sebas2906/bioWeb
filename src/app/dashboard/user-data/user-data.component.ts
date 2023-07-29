import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { PM6750GeneralData } from './types';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit, AfterViewInit {

  private card_width = 0;
  private offscreenCanvas = undefined;
  
  public pm6750_data:PM6750GeneralData;

  constructor() { }

  ngOnInit(): void {
    //  $.getScript("./assets/js/deafult-dashboard.js")
  }

  ngAfterViewInit(): void {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./user-data.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        //console.log(`page got message: ${data}`);
        this.pm6750_data = JSON.parse(data);
        // this.lineChartData.datasets[0].data.push(data);
      };
      const config = [
        {
          type: 'line',
          data: {
            datasets: [{
              label: 'Formas de onda ECG',
              data: [],
              fill: false,
              borderColor: 'red',
              borderWidth: 2,
              pointRadius: 0
            }]
          },
          options: {
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            },
            plugins: {
              legend: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              displayColors: false
            },
            spanGaps: true, // enable for all datasets
            animation: false
          },
          elements: {
            points: {
              radius: 0
            }
          }
        },
        {
          type: 'line',
          data: {
            datasets: [{
              label: 'Formas de onda RESP',
              data:[],
              fill: false,
              borderColor: 'blue',
              borderWidth: 2,
              pointRadius: 0
            }]
          },
          options: {
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            },
            plugins: {
              legend: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              displayColors: false
            },
            spanGaps: true, // enable for all datasets
            animation: false
          },
          elements: {
            points: {
              radius: 0
            }
          }
        },
        {
          type: 'line',
          data: {
            datasets: [{
              label: 'Formas de onda ECG',
              data: [],
              fill: false,
              borderColor: 'greenyellow',
              borderWidth: 2,
              pointRadius: 0
            }]
          },
          options: {
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            },
            plugins: {
              legend: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              displayColors: false
            },
            spanGaps: true, // enable for all datasets
            animation: false
          },
          elements: {
            points: {
              radius: 0
            }
          }
        },
       /*  {
          type: 'line',
          data: {
            datasets: [{
              label: 'Formas de onda ECG',
              data: [],
              fill: false,
              borderColor: 'greenyellow',
              borderWidth: 2,
              pointRadius: 0
            }]
          },
          options: {
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            },
            plugins: {
              legend: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              displayColors: false
            },
            spanGaps: true, // enable for all datasets
            animation: false
          },
          elements: {
            points: {
              radius: 0
            }
          }
        },
        {
          type: 'line',
          data: {
            datasets: [{
              label: 'Formas de onda ECG',
              data: [],
              fill: false,
              borderColor: 'greenyellow',
              borderWidth: 2,
              pointRadius: 0
            }]
          },
          options: {
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            },
            plugins: {
              legend: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              displayColors: false
            },
            spanGaps: true, // enable for all datasets
            animation: false
          },
          elements: {
            points: {
              radius: 0
            }
          }
        } */
      ]
      let canvas = [
        document.getElementById('chart1') as any,
        document.getElementById('chart2') as any,
        document.getElementById('chart3') as any,
      /*   document.getElementById('chart4') as any,
        document.getElementById('chart5') as any, */
      ];

      const card = document.getElementById('card') as HTMLElement;
      this.card_width = card.clientWidth;
      window.addEventListener('resize', () => {
        this.card_width = card.clientWidth;
        //console.log(this.card_width);
        worker.postMessage({ width: this.card_width });
      })
      // console.log('canvas: ', canvas)
      this.offscreenCanvas = [];
      canvas.forEach(c => {
        this.offscreenCanvas.push(c.transferControlToOffscreen());
      });
      worker.postMessage({ _canvas: this.offscreenCanvas[0], _config: config[0], width: this.card_width }, [this.offscreenCanvas[0]]);
      worker.postMessage({ _canvas: this.offscreenCanvas[1], _config: config[1], width: this.card_width }, [this.offscreenCanvas[1]]);
      worker.postMessage({ _canvas: this.offscreenCanvas[2], _config: config[2], width: this.card_width }, [this.offscreenCanvas[2]]);
/*       worker.postMessage({ _canvas: this.offscreenCanvas[3], _config: config[3], width: this.card_width }, [this.offscreenCanvas[3]]);
      worker.postMessage({ _canvas: this.offscreenCanvas[4], _config: config[4], width: this.card_width }, [this.offscreenCanvas[4]]); */
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

}

