package de.htw.radvis.domain.report;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "report_photo")
public class ReportPhoto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGBLOB", nullable = false)
    private byte[] data;

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
