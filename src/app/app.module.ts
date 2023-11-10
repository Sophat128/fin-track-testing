import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
// import { NewsletterService } from './newsletter.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LessonsComponent } from './web-push-notification/webpush.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
