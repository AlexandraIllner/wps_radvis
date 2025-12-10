import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


/**
 * Komponente zum Aufnehmen oder Auswählen eines Fotos.
 * Stellt eine einfache Oberfläche bereit und gibt das gewählte Bild
 * über ein Output-Event an die Parent-Komponente weiter.
 */

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './camera.html',
  styleUrl: './camera.css',
})

/**
 * Komponente zum Aufnehmen oder Auswählen eines Fotos.
 * Stellt eine einfache Oberfläche bereit und gibt das gewählte Bild
 * über ein Output-Event an die Parent-Komponente weiter.
 */

export class Camera {
  fileName = '';

  /** Base64-Daten für die Bildvorschau (null, wenn kein Bild gewählt wurde) */
  previewData: string | null = null;

  /**
   * Gibt das gewählte oder aufgenommene Foto an die Parent-Komponente zurück
   *
   * -Emit: File → wenn ein Foto erfolgreich ausgewählt wurde
   * -Emit: File → wenn die Auswahl abgebrochen oder zurückgesetzt wurde
   */
  @Output() photoTaken = new EventEmitter<File | null >();

  /**
   * Wird ausgelöst, wenn der Benutzer eine Datei auswählt.
   *
   * - Liest die gewählte Datei aus dem Input-Element
   * - Zeigt eine Bildvorschau an (Base64)
   * - Sendet die Datei über das Output-Event an die Parent-Komponente
   * - Sendet `null`, wenn keine Datei ausgewählt wurde
   *
   * @param e Browser-Event des Datei-Inputs
   */
  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0] || null;
    this.fileName = f ? f.name : '';
    if (!f) {
      this.previewData = null;
      this.photoTaken.emit(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => (this.previewData = reader.result as string);
    reader.readAsDataURL(f);

    this.photoTaken.emit(f);
    input.value = ' ';
  }

  /**
   * Löscht das aktuell ausgewählte Foto.
   * - Entfernt den Dateinamen.
   * - Setzt die Bildvorschau auf null.
   * - Informiert die Parent-Komponente über das Output-Event,
   *   das kein Foto mehr vorhanden ist
   */
  removePhoto() {
    this.fileName = '';
    this.previewData = null;
    this.photoTaken.emit(null);
  }
}
