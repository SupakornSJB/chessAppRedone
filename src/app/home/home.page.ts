import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MyServiceProviderService  } from '../my-service-provider.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('doughnutCanvas', {static: true}) private doughnutCanvas: ElementRef;

  winnerInput : string;
  openingInput : string;
  openingListData = [];
  gameListData = [];
  openingChoice : string;
  shownSelector: boolean = true;
  shownData: boolean = true;
  SWLbool: boolean = false;
  IWLbool: boolean = false;
  SGbool: boolean = false;
  OPDbool: boolean = false;
  // clickedSearch: boolean = true;
  oneGame = [];
  watchlist = []
  watchlistStatus : string;
  watchListInp = {}
  datetimeInp = {}
  numtime : number;
  level : string;
  doughnutChart : any;
  chartData = [[],[]]
  // myNewInput = "";

  constructor(private myServiceProvider: MyServiceProviderService, private alertController: AlertController) {
    
    Chart.register(...registerables);
    this.myServiceProvider.getWatchListFromProvider(this.watchlist);
    this.datetimeInp['hour'] = ['00'];
    this.datetimeInp['day31'] = [];
    this.datetimeInp['minutes'] = ['00'];
    for (var i = 1; i < 60; i++) {
      if (i <= 9) {
        this.datetimeInp['hour'].push('0'+String(i))
        this.datetimeInp['day31'].push('0'+String(i))
        this.datetimeInp['minutes'].push('0'+String(i))
        continue;
      }
      if (i <= 23) {this.datetimeInp['hour'].push(String(i))};
      if (i <= 31) {this.datetimeInp['day31'].push(String(i))};
      if (i <= 59) {this.datetimeInp['minutes'].push(String(i))};
    }
    this.datetimeInp['month'] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.datetimeInp['year'] = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026']
  }

  ionViewDidEnter() {
    // this.winnerInput = "Any";
    // this.openingChoice = "Any";
    this.resetDisplay();
    this.infiniteScroll.disabled = true;
    // this.doughnutChartMethod();
  }

  resetDisplay() {
    console.log('reset display');
    console.log("scroll status: " + this.infiniteScroll.disabled);
    // this.clickedSearch = false;
    this.infiniteScroll.disabled = true;
    this.winnerInput = "Any";
    this.openingChoice = "Any";
    this.openingInput = "";
    this.openingListData = [];
    this.gameListData = [];
    this.oneGame = [];
    this.watchlist = [];
    this.numtime = 0;
    this.shownSelector = this.shownData = true;
    this.watchListInp['match_title'] = this.watchListInp['tour'] = this.watchListInp['where'] = "";
    this.watchListInp['day'] = this.watchListInp['hour'] = this.watchListInp['minutes'] = this.watchListInp['year'] = this.watchListInp['month']  = "Unspecified";
    this.level = "Any";
    this.chartData = [['No data to visualize'], []];
    if (this.doughnutChart != undefined) this.doughnutChart.destroy();
  }

  updateWatchListStatus(id) {
    this.myServiceProvider.updateWatchListStatusFromServiceProvider(id)
    // console.log("updating watchlist status with id " + id);
    this.getWatchlist();
  }

  insertWatchList() {
    this.watchListInp['status'] = 'Unwatched'
    console.log("watchlist inserted")
    this.myServiceProvider.insertWatchListFromProvider(this.watchListInp)
    this.IWLbool = false;
  }

  deleteWatchList(id) {
    this.myServiceProvider.deleteWatchListFromServiceProvider(id);
    this.getWatchlist();
  }


  getData(event) {
    // this.clickedSearch = true;
    console.log('numtime: ' + this.numtime);
    this.infiniteScroll.disabled = false;
    this.myServiceProvider.getDataFromServiceProvider(this.winnerInput, this.openingChoice, this.gameListData, this.numtime, this.level, event);
    this.shownSelector= false;
    this.numtime += 1;
  }

  getOpening() {
    this.openingListData = [];
    this.myServiceProvider.getOpeningListFromServiceProvider(this.openingInput, this.openingListData);
  }

  async getOneGame(id) {
    // this.infiniteScroll.disabled = true;
    this.oneGame = [];
    await this.myServiceProvider.getOneGameFromServiceProvider(id, this.oneGame);
    // var all_key = Object.keys(this.oneGame[0]);
    var messages = "";
    var listOfStats = {'Rated':'rated', 'Number of turns':'turns', 'Victory by':'victory_status', 'Winner':'winner',
                      'Time increment':'time_increment', 'White\'s ID':'white_id', 'White\'s rating':'white_rating',
                      'Black\'s ID': 'black_id','Black\'s Rating':'black_rating', 'Opening':'opening_fullname', 
                      'Variation':'opening_variation', 'Moves':'moves'}
    var allKey = Object.keys(listOfStats);
    for (var i = 0; i < allKey.length; i++) {
      console.log(allKey[i] + ": " + this.oneGame[0][listOfStats[allKey[i]]] + "<br>");
      messages = messages + allKey[i] + ": " + this.oneGame[0][listOfStats[allKey[i]]] + "<br>";
    }

    // console.log(messages);

    this.alertController.create(
      { header:"Detailed Search result", 
        subHeader:"Game ID #" + this.oneGame[0]['game_id'],
        message: messages,
        buttons:['OK']
      }
    ).then(res => res.present());
    // this.shownData = false;
    console.log("get One game done")
  }

  async getWatchlist() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.watchlist = [];
    this.myServiceProvider.getWatchListFromProvider(this.watchlist);
  }

  menuSelector(sg:boolean, swl:boolean, iwl:boolean, opd:boolean) {
    this.resetDisplay();
    if (this.SGbool == sg && this.SWLbool == swl && this.IWLbool == iwl && this.OPDbool == opd) {
      this.SGbool = this.SWLbool = this.IWLbool = this.OPDbool = false;
    } else {
      this.SGbool = sg;
      this.SWLbool = swl;
      this.IWLbool = iwl;
      this.OPDbool = opd;
    }

    if (this.SWLbool) {this.getWatchlist();}
    // console.log(String(this.SGbool) + String(this.SWLbool) + String(this.IWLbool))
  }

  doughnutChartMethod(k, s, typez) {
    
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: typez,
      data: {
        labels: k,
        datasets: [{
          label: 'Data visualization',
          data: s,
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF6384'
          ]
        }]
      },
      options: {
        scales: {
          x: {
            display: false
          }
      }
      }
    });
  }

  async displayOnChart(mode) {
    if (this.doughnutChart != undefined) this.doughnutChart.destroy();
    this.chartData = [[],[]];
    console.log("called displayOnChart()");
    var types = ""
    if (mode == 'search') {
      await this.myServiceProvider.getOpeningStatFromServiceProvider(this.openingChoice, this.chartData);
      types = 'doughnut'
    }
    else if (mode == 'White' || mode == 'Black') {
      await this.myServiceProvider.getTopFourOpeningFromServiceProvider(mode, this.chartData);
      types = 'bar'
    }
      
    this.doughnutChartMethod(this.chartData[0], this.chartData[1], types); 
    this.doughnutChart.update();
  }

}
