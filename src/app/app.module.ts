import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ChequeBookRequestComponent } from './cheque-book-request/cheque-book-request.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransferBetweenAccountsComponent } from './transfer-between-accounts/transfer-between-accounts.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AgGridModule } from 'ag-grid-angular';
import { LoginComponent } from './login/login.component';
// import { WebpushComponent } from './webpush/webpush.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { WebpushComponent } from './web-push-notification/webpush.component';
// import { TokenInterceptor } from './interceptor/token.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ChequeBookRequestComponent,
    TransactionHistoryComponent,
    TransferBetweenAccountsComponent,
    EditProfileComponent,
    TransferHistoryComponent,
    DepositComponent,
    WithdrawComponent,
    FooterComponent,
    HeaderComponent,
    WebpushComponent
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AgGridModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true }),
  ],
  providers: [
    RegisterService,
     LoginService,
      AuthService,
      // {
      //   provide: HTTP_INTERCEPTORS,
      //   useClass: TokenInterceptor,
      //   multi: true,
      // },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }