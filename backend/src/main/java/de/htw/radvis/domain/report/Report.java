package de.htw.radvis.domain.report;

import de.htw.radvis.domain.issue.Issue;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Issue issue;

    @Column(length = 1000, nullable= true)
    private String description;

    @Column(precision = 10, scale = 6, nullable = true)
    private BigDecimal latitude;
    @Column(precision = 10, scale = 6, nullable = true)
    private BigDecimal longitude;

    @Column(nullable = false, updatable = false)
    private Instant creationDate = Instant.now();

    @OneToMany(
            mappedBy = "report",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private java.util.List<ReportPhoto> photos = new java.util.ArrayList<>();
}
