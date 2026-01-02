package de.htw.radvis.domain.report;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * Entity-Klasse für ein Foto, das zu einem Report gehört.
 *
 * Speichert die Bilddaten direkt in der Datenbank
 * und ist über eine Many-to-One-Beziehung einem Report zugeordnet.
 *
 * Ein Report kann mehrere Fotos besitzen.
 */
@Entity
@Table(name = "report_photo")
public class ReportPhoto implements Serializable {


    /**
     * Eindeutige ID des Fotos.
     * Wird automatisch von der Datenbank generiert.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Binäre Bilddaten des Fotos.
     *
     * Wird als LONGBLOB in der Datenbank gespeichert.
     */
    @Lob
    @Column(columnDefinition = "LONGBLOB", nullable = false)
    private byte[] data;

    /**
     * Zugehöriger Report, zu dem das Foto gehört.
     *
     * Jedes Foto ist genau einem Report zugeordnet.
     */
    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    // ------------- Getter & Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Report getReport() {
        return report;
    }

    public void setReport(Report report) {
        this.report = report;
    }
}
