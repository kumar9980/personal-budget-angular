import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  budgetData: Observable<any[]>;

  public budgetStore = [];

  constructor(private http: HttpClient) { }

  getBudget() {
    if (this.budgetStore.length === 0) {
        this.budgetData = this.http.get<any>('http://localhost:3000/budget');
        this.budgetData.subscribe((res) => {
        this.budgetStore = res;
      });
        return this.budgetData;
    }
    else {
      return this.budgetData;
    }
  }
}
