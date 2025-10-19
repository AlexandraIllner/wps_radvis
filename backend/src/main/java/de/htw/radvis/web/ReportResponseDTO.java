package de.htw.radvis.web;

import de.htw.radvis.domain.Issue;

import java.time.Instant;

public record ReportResponseDTO(Long id, Issue issue, Instant created) {
}
