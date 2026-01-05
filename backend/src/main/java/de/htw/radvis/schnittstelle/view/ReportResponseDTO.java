package de.htw.radvis.schnittstelle.view;

import de.htw.radvis.domain.valueObjects.Issue;

import java.math.BigDecimal;
import java.time.Instant;

public record ReportResponseDTO(Long id, Issue issue, String description, BigDecimal latitude, BigDecimal longitude,
                                Instant createdAt, java.util.List<PhotoMetadataDTO> photos) {
}
