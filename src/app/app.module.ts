import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module'; // Apollo GraphQL Module importieren

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    GraphQLModule // Hier registrieren!
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
