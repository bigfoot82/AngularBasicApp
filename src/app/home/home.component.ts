import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../housinglocation';
import { HousingService } from '../housing.service';
import { ExampleService } from '../example.service';
import { Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HousingLocationComponent],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" #filter>
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
      </form>
    </section>
    <section class="results">
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation"
      ></app-housing-location>
    </section>

    <!-- Falls die Daten noch laden -->
    <div *ngIf="loading">
      <p>Lade Daten...</p>
    </div>

    <!-- Falls ein Fehler auftritt -->
    <div *ngIf="error">
      <p style="color: red;">Fehler: {{ error | json }}</p>
    </div>

    <!-- Falls keine Posts vorhanden sind -->
    <div *ngIf="!loading && sportEvents.length === 0">
      <p>Keine Daten gefunden.</p>
    </div>

    <!-- Falls Posts vorhanden sind -->
    <ul *ngIf="!loading && sportEvents.length > 0">
      <li *ngFor="let event of sportEvents">
        <h3>{{ event.title }}</h3>
        {{ event.description }}
        {{ event.startTime }}
      </li>
    </ul>
  `,
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit{
  housingLocationList: HousingLocation[] = [];

  private querySubscription!: Subscription; // Subscription-Variable

  // sportEvents: any;

  loading = true;
  error: any;

  sportEvents: any[] = [];
  housingService: HousingService = inject(HousingService);
  exampleService: ExampleService = inject(ExampleService);
  filteredLocationList: HousingLocation[] = [];

  constructor(private apollo: Apollo) {
        this.housingLocationList = this.housingService.getAllHousingLocations();
    this.filteredLocationList = this.housingLocationList;
  }
  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }
    this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
      housingLocation?.city.toLowerCase().includes(text.toLowerCase()),
    );
  }

  ngOnInit(): void {


    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: gql`
        query {
          events {
            title
            description
            startTime
            endTime
          }
        }
      `,
      })
      .valueChanges.subscribe(({ data, loading, errors }) => {
        console.log("GraphQL Antwort:", data);
        this.loading = loading;
        this.sportEvents = data?.events || [];
        if (errors) {
          console.error("GraphQL Fehler:", errors);
          this.error = errors;
        }
      });

    this.querySubscription = this.apollo.watchQuery({
      query: gql`
        query {
          events {
            title
            description
          }
        }
      `,
    }).valueChanges.subscribe({
      next: (result) => console.log('GraphQL Response:', result),
      error: (error) => console.error('GraphQL Error Test:', error)
    });

    
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe(); // Sauberes Aufräumen der Subscription
    }
  }
}