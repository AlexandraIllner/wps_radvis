package de.htw.radvis.web.report;

import de.htw.radvis.domain.issue.Issue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ReportCreateDTO {

    private Issue issue;

    @Size(max = 255)
    private String description;

    // latitude ∈ [-90, 90], longitude ∈ [-180, 180]
    @DecimalMin("-90.0") @DecimalMax("90.0")
    private BigDecimal latitude;
    @DecimalMin("-180.0") @DecimalMax("180.0")
    private BigDecimal longitude;
}
