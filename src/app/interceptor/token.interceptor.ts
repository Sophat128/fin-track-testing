// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   constructor() {}

//   intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//      // Get the authentication token from your service
//      const authToken = localStorage.getItem('token');     

//      // Clone the request and add the token to the headers
//      const authReq = req.clone({
//        setHeaders: {
//          Authorization: `Bearer ${authToken}`,
//        },
//      });
 
//      // Pass the cloned request to the next handler
//      return next.handle(authReq);
//   }
// }
