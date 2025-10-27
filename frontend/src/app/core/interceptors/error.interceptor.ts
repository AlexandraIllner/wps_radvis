import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor fängt alle HTTP-Fehler ab
 * Wird automatisch bei jedem fehlgeschlagenen Request ausgeführt
 */

export const errorInterceptor: HttpInterceptorFn =(req,next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Fehler:', error);
      // Status 0 = Server offline/nicht erreichbar
      if (error.status === 0) {
        alert('Server nicht erreichbar!');
      }
      // Status 400 = Ungültige Daten gesendet
      else if (error.status === 400) {
        alert('Fehler in den Daten! Bitte prüfe deine Eingaben.');
      }
      // Status 404 = Endpunkt existiert nicht
      else if (error.status === 404) {
        alert('Endpunkt nicht gefunden!');
      }
      // Status >= 500 = Serverfehler
      else if (error.status >= 500) {
        alert('Serverfehler!');
      }
      // Alle anderen Fehler
      else {
        alert('Ein Fehler ist aufgetreten!');
      }

      // Gibt den Fehler weiter, damit er in .subscribe() behandelt werden kann
      return throwError(() => error);
    })
  );
};
