import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/**
 * Interceptor fängt alle HTTP-Fehler ab
 * Wird automatisch bei jedem fehlgeschlagenen Request ausgeführt
 */

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Zugriff auf den MatSnackBar-Service (außerhalb von Komponenten via inject)
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Fehler:', error);

      // Standardfehlermeldung
      let message = 'Ein Fehler ist aufgetreten!';

      // Status 0 = Server offline/nicht erreichbar
      if (error.status === 0) {
        message = 'Server nicht erreichbar!';
      }
      // Status 400 = Ungültige Daten gesendet
      else if (error.status === 400) {
        message = 'Fehler in den Daten! Bitte prüfe deine Eingaben.';
      }
      // Status 404 = Endpunkt existiert nicht
      else if (error.status === 404) {
        message = 'Endpunkt nicht gefunden!';
      }
      // Status >= 500 = Serverfehler
      else if (error.status >= 500) {
        message = 'Serverfehler!';
      }

      // SnackBar anzeigen (statt alert)
      snackBar.open(message, 'OK', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });

      // Gibt den Fehler weiter, damit er in .subscribe() behandelt werden kann
      return throwError(() => error);
    })
  );
};
