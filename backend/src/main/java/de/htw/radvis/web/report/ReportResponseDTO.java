package de.htw.radvis.web.report;

import de.htw.radvis.domain.issue.Issue;

import java.time.Instant;

public record ReportResponseDTO(Long id, Issue issue, Instant created) {
}
