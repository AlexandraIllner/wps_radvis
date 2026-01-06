package de.htw.radvis.app;

import de.htw.radvis.data.ReportRepository;
import de.htw.radvis.domain.report.Report;
import de.htw.radvis.domain.report.ReportPhoto;
import de.htw.radvis.web.report.ReportCreateDTO;
import de.htw.radvis.web.report.ReportResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.RoundingMode;

import static de.htw.radvis.app.PhotoValidator.log;

/**
 * Service-Klasse für die Verarbeitung von Meldungen (Reports).
 *
 * Enthält die Geschäftslogik zum Erstellen neuer Meldungen
 * inklusive Validierung und Speicherung von hochgeladenen Fotos.
 *
 * Der Service verbindet Controller, Repository und Foto-Validierung.
 */
@Service
public class ReportService {

    /** Repository für den Zugriff auf Report-Entitäten */
    private final ReportRepository reportRepository;

    /** Validator für hochgeladene Fotos */
    private final PhotoValidator photoValidator;

    /**
     * Erstellt einen neuen ReportService.
     *
     * @param reportRepository Repository zum Speichern von Reports
     * @param photoValidator   Validator für Bild-Uploads
     */
    public ReportService(ReportRepository reportRepository, PhotoValidator photoValidator) {
        this.reportRepository = reportRepository;
        this.photoValidator = photoValidator;
    }

    /**
     * Erstellt eine neue Meldung (Report) inklusive optionaler Fotos.
     *
     * - Wandelt das DTO in eine Report-Entität um
     * - Validiert hochgeladene Fotos
     * - Speichert Fotos als ReportPhoto.
     * - Persistiert den Report in der Datenbank
     *
     * @param dto    DTO mit den Report-Daten (Kategorie, Beschreibung, Koordinaten)
     * @param photos Optionale hochgeladene Bilder
     * @return Antwort-DTO mit Basisinformationen zur erstellten Meldung
     * @throws IOException
     *         wenn ein Fehler beim Lesen der Bilddaten auftritt
     * @throws ResponseStatusException
     *       wenn die hochgeladenen Bilder ungültig sind oder Größenlimits überschreiten
     */
    public ReportResponseDTO create(ReportCreateDTO dto, MultipartFile[] photos) throws IOException {
        Report report = getReport(dto);

        if (photos != null) {
            photoValidator.validatePhotos(photos);
            log.info("Received {} photos for report", photos.length);

            for (MultipartFile file : photos) {
                if (file != null && !file.isEmpty()) {
                    ReportPhoto photoEntity = new ReportPhoto();
                    photoEntity.setData(file.getBytes());
                    photoEntity.setReport(report);
                    report.getPhotos().add(photoEntity);
                }
            }
        }

        var saved = reportRepository.save(report);
        log.info("Created report with id={} (lat={}, lon={})",
                saved.getId(), saved.getLatitude(), saved.getLongitude());
        return new ReportResponseDTO(saved.getId(), saved.getIssue(), saved.getCreationDate());

    }

    /**
     * Erstellt eine Report-Entität aus den Daten des Create-DTOs.
     *
     * Dabei werden:
     * - optionale Felder geprüft
     * - Texte getrimmt
     * - Koordinaten auf 6 Nachkommastellen gerundet
     *
     * @param dto DTO mit den Eingabedaten des Reports
     * @return Neue, noch nicht gespeicherte Report-Entität
     */
    private static Report getReport(ReportCreateDTO dto) {
        Report report = new Report();

        if (dto.getIssue() != null) {
            report.setIssue(dto.getIssue());
        }

        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
            report.setDescription(dto.getDescription().trim());
        }

        if (dto.getLatitude() != null) {
            report.setLatitude(dto.getLatitude().setScale(6, RoundingMode.HALF_UP));
        }

        if (dto.getLongitude() != null) {
            report.setLongitude(dto.getLongitude().setScale(6, RoundingMode.HALF_UP));
        }
        return report;
    }
}
