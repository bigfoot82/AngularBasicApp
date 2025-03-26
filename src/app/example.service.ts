import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExampleService{

  private API_URL = 'http://eu-west-2.cdn.hygraph.com/content/cm8eeuj6m02cw07w2ojhign5g/master';

  constructor(private apollo: Apollo) {}

  getSportEvents() {
    return this.apollo.watchQuery({
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
      error: (error) => console.error('GraphQL Error:', error)
    });
  }
}