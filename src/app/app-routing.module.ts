import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonsComponent } from './web-push-notification/webpush.component';

const routes: Routes = [
  {
    path: '',
    component: LessonsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
