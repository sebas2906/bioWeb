import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { PM6750GeneralData } from './types';
import { Pm6750Service } from 'src/app/services/pm6750.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/Users.model';
import { QueryService } from 'src/app/services/query.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit, AfterViewInit {

  private card_width = 0;
  private offscreenCanvas = undefined;

  public pm6750_data: PM6750GeneralData;
  public is_recording = false;
  public user: User;

  constructor(private pm6750Service: Pm6750Service, private activatedRoute: ActivatedRoute, private queryService: QueryService) { }

  ngOnInit(): void {
    //  $.getScript("./assets/js/deafult-dashboard.js")
  }

  ngAfterViewInit(): void {
    if (this.pm6750Service.workerAvailable()) {
      this.pm6750Service.worker.onmessage = ({ data }) => {
        if (data?.download) {
          console.log('...descargando data: ', data.data);
          var encodedUri = encodeURI('data:text/csv;charset=utf-8,' + JSON.parse(data.data));
          window.open(encodedUri);
          return;
        }
        this.pm6750_data = JSON.parse(data);
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
              data: [],
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

      ]
      let canvas = [
        document.getElementById('chart1') as any,
        document.getElementById('chart2') as any,
        document.getElementById('chart3') as any,
      ];

      const card = document.getElementById('card') as HTMLElement;
      this.card_width = card.clientWidth;
      window.addEventListener('resize', () => {
        this.card_width = card.clientWidth;
        //console.log(this.card_width);
        this.pm6750Service.worker.postMessage({ width: this.card_width });
      })
      // console.log('canvas: ', canvas)
      this.offscreenCanvas = [];
      canvas.forEach(c => {
        this.offscreenCanvas.push(c.transferControlToOffscreen());
      });
      this.pm6750Service.worker.postMessage({ _canvas: this.offscreenCanvas[0], _config: config[0], width: this.card_width }, [this.offscreenCanvas[0]]);
      this.pm6750Service.worker.postMessage({ _canvas: this.offscreenCanvas[1], _config: config[1], width: this.card_width }, [this.offscreenCanvas[1]]);
      this.pm6750Service.worker.postMessage({ _canvas: this.offscreenCanvas[2], _config: config[2], width: this.card_width }, [this.offscreenCanvas[2]]);
      this.loadUserDevice();

    }
  }

  async loadUserDevice() {
    let p = this.activatedRoute.snapshot.params
    if (p['user_id']) {
      this.user = await this.queryService.getUserInfo(p['user_id']);
      console.log(`Información de paciente ${p['user_id']}: `, this.user);
      if (this.user?.device_id) {
        this.pm6750Service.worker.postMessage({ device_id: this.user.device_id });
      }
    }
  }

  startRecording() {
    this.is_recording = true;
    this.pm6750Service.worker.postMessage({ save: false, record: true });
  }

  /* stopRecording() {
    this.pm6750Service.worker.postMessage({save:true});
  } */

  downloadRecord() {
    this.is_recording = false;
    this.pm6750Service.worker.postMessage({ save: true, record: false });
  }

}

