import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyServiceProviderService {

  myHttp = "http://3716-35-188-48-118.ngrok.io";

  constructor(private http: HttpClient) {
    console.log("create Service provider");
  }

  async getDataFromServiceProvider(winnerInp, openingChoice, gameList, numtime:number, level, event) {
    if (winnerInp == 'Any') {winnerInp='undefined'};
    if (openingChoice == 'Any') {openingChoice='undefined'};
    openingChoice = openingChoice.replace("#", '%23')
    console.log(openingChoice);
    var minner = '';
    var maxxer = '';
    
    switch (level) {
      case ('Beginner'):
        minner = '0';
        maxxer = '1000';
        break;
      case ('Intermediate'):
        minner = '1000';
        maxxer = '2000';
        break;
      case ('Expert'):
        minner = '2000';
        maxxer = '3000';
        break;
      case ('Any'):
        minner = maxxer = "undefined";
    }

    console.log('I will get the data from ' + winnerInp + openingChoice)
    console.log(this.myHttp + "/get?winner=" + winnerInp + "&opening=" + openingChoice + "&numtime=" + numtime*10 + "&minner=" + minner + "&maxxer=" + maxxer)
    this.http.get(this.myHttp + "/get?winner=" + winnerInp + "&opening=" + openingChoice + "&numtime=" + numtime*10 + "&minner=" + minner + "&maxxer=" + maxxer).subscribe(data =>
      {
        for (var i = 0; i < data['length']; i++) {
          // console.log(data['data'][i]);
          gameList.push(data['data'][i])
        }

        console.log("Found " + data['length'] + " games");
      }
    );

    if (numtime == 0) {numtime += 1};
    if (numtime != 0 && event != undefined) {
      event.target.complete();
    }
  }

  getOpeningListFromServiceProvider(openingInp, openingList) {
    if (openingInp == 'Any') {openingInp='undefined'}
    // var openingList = [];
    console.log("I will get opening list from " + openingInp);
    this.http.get(this.myHttp + "/getOpening?phrase=" + openingInp).subscribe(data =>
        {
          for (var i = 0; i < data['data'].length; i++) {
            // console.log(data['data'][i]);
            openingList.push(data['data'][i]);
          }

          console.log("Found " + data['length'] + " games");
        }
      );
  }

  getOneGameFromServiceProvider(id, oneGame) {
    console.log("I will get one game with id " + id);
    const promise = new Promise<void>(resolve => this.http.get(this.myHttp + "/getOnId?id=" + id).subscribe(data =>
        {
          console.log(data['data']);
          oneGame.push(data['data']);
          resolve();
        }
      ))
      return promise;
  }

  getWatchListFromProvider(watchlist) {
    console.log("I will get the watchlist")
    this.http.get(this.myHttp + "/getwatchlist").subscribe(data =>
        {
          for (var i = 0; i < data['data'].length; i++) {
            // console.log(data['data'][i]);
            watchlist.push(data['data'][i]);
          }
        }
      )
  }

  insertWatchListFromProvider(watchListInput) {
    var a = watchListInput;
    console.log("I will insert new watchlist to the database");
    var firstPrompt = "title=" + a['match_title'] + "&tour=" + a['tour'] + "&where=" + a['where']; 
    var secondPrompt = "&day=" + String(a['day']) + "&month=" + String(a['month']) + "&year=" + String(a['year']) + "&time=" + String(a['hour']) + ":" + String(a['minutes']);
    this.http.get(this.myHttp + "/insertwatchlist?" + firstPrompt + secondPrompt + "&status=" + a['status']).subscribe()
    
      
  }

  updateWatchListStatusFromServiceProvider(id) {
    this.http.get(this.myHttp + "/updatewatchliststatus?id=" + id).subscribe();

  }

  deleteWatchListFromServiceProvider(id) {
    this.http.get(this.myHttp + "/deletewatchlist?id=" + id).subscribe();
  }

  getOpeningStatFromServiceProvider(openingName, mydata) {
    mydata[0].pop(0);
    openingName = openingName.replace('#', '%23')
    const promise = new Promise<void>(resolve => this.http.get(this.myHttp + "/getopeningstat?opening=" + openingName).subscribe(data => 
      {
        for (var i of Object.keys(data['winner'])) {
          // console.log(i);
          mydata[0].push(i);
          mydata[1].push(data['winner'][i]);
        }
        resolve();
      }))

      return promise;
  }

  getTopFourOpeningFromServiceProvider(side, mydata) {
    const promise = new Promise<void>(resolve => this.http.get(this.myHttp + "/gettopfouropening?side=" + side).subscribe(data => 
      {
        for (var i of Object.keys(data['opening'])) {
          // console.log(i);
          mydata[0].push(i);
          mydata[1].push(data['opening'][i]);
        }
        resolve();
      }))

      return promise;
  }

}
