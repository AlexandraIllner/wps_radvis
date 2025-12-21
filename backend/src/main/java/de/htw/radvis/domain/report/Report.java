package de.htw.radvis.domain.report;

import de.htw.radvis.domain.issue.Issue;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
/**
 * Entity-Klasse für eine Mängelmeldung (Report).
 *
 * Repräsentiert eine vom Benutzer gemeldete Stelle mit optionaler
 * Kategorie, Beschreibung, Koordinaten und Fotos.
 *
 * Die Daten werden in der Datenbank persistiert und über das Backend
 * verarbeitet und bereitgestellt.
 */
@Entity
@Table(
        indexes = {
                @Index(
                        name = "idx_report_latitude_longitude",
                        columnList = "latitude, longitude"
                )
        }
)
@Getter
@Setter
public class Report implements Serializable {

    /**
     * Eindeutige ID des Reports.
     * Wird automatisch von der Datenbank generiert.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Kategorie des gemeldeten Mangels.
     * Wird als String in der Datenbank gespeichert.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Issue issue;

    /**
     * Freitext-Beschreibung des Mangels.
     * Maximal 1000 Zeichen.
     */
    @Column(length = 1000, nullable= true)
    private String description;

    /**
     * Breitengrad der gemeldeten Position.
     * Auf 6 Nachkommastellen begrenzt.
     */
    @Column(precision = 10, scale = 6, nullable = true)
    private BigDecimal latitude;

    /**
     * Längengrad der gemeldeten Position.
     * Auf 6 Nachkommastellen begrenzt.
     */
    @Column(precision = 10, scale = 6, nullable = true)
    private BigDecimal longitude;

    /**
     * Zeitpunkt der Erstellung des Reports.
     * Wird automatisch beim Anlegen gesetzt und danach nicht mehr geändert.
     */
    @Column(nullable = false, updatable = false)
    private Instant creationDate = Instant.now();


    /**
     * Liste der zugehörigen Fotos.
     *
     * Ein Report kann mehrere Fotos besitzen.
     * Die Fotos werden zusammen mit dem Report gespeichert und gelöscht.
     */
    @OneToMany(
            mappedBy = "report",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private java.util.List<ReportPhoto> photos = new java.util.ArrayList<>();
}
