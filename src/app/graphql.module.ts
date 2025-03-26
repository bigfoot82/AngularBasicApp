import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, HttpLink } from '@apollo/client/core';
import { environment } from '../environments/environment';

const uri = environment.hygraphEndpoint; // API-URL aus den Umgebungsvariablen
const apiKey = environment.hygraphApiKey; // API-Key

export function createApollo(): ApolloClientOptions<any> {
  return {
    link: new HttpLink({
      uri: uri, // Hier setzen wir die API-URL
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Hier wird der API-Key genutzt!
        'Content-Type': 'application/json'
      }
    }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
    },
  ],
})
export class GraphQLModule {}
