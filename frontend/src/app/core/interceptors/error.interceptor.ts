import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor fängt alle HTTP-Fehler ab
 * Wird automatisch bei jedem fehlgeschlagenen Request ausgeführt
 */

export const errorInterceptor: HttpInterceptorFn =(req,next) => {
  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Ein unbekannter Fehler ist aufgetreten';
      // Status 0 = Server ist offline oder nicht erreichbar
      if (error.status === 0) {
        errorMessage = 'Keine Verbindung zum Server möglich';
      }
      // Status 404 = URL/Endpunkt existiert nicht
      else if (error.status === 404) {
        errorMessage = 'Endpunkt nicht gefunden';
      }
      // Status >= 500 = Interner Serverfehler
      else if (error.status >= 500) {
        errorMessage = 'Serverfehler';
      }

      // Fehlerinfo für Entwickler in der Console
      console.error('HTTP Error:', {
        status: error.status,
        message: error.message,
        url: error.url
      });
      // Zeigt dem User eine verständliche Fehlermeldung
      alert(errorMessage);

      // Gibt den Fehler weiter, damit er in .subscribe() behandelt werden kann
      return throwError(() => error);
    })
  );
};
