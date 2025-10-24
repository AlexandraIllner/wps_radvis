import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.log('Ein Fehler wurde erkannt!');
      console.log('Status:', error.status);
      console.log('Nachricht:', error.message);

      alert('Es ist ein Fehler aufgetreten.');

      return throwError(() => error);
    })
  );
};
