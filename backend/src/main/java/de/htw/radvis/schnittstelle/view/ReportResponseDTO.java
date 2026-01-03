package de.htw.radvis.schnittstelle.view;

import de.htw.radvis.domain.valueObjects.Issue;
import java.time.Instant;

public record ReportResponseDTO(Long id, Issue issue, Instant created) {
}
