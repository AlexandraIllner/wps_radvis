package de.htw.radvis.app;

import de.htw.radvis.data.ReportRepository;
import de.htw.radvis.domain.Issue;
import de.htw.radvis.domain.Report;
import de.htw.radvis.web.ReportCreateDTO;
import de.htw.radvis.web.ReportResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public ReportResponseDTO create(ReportCreateDTO dto) {
        Report report = new Report();

        if (dto.getIssue() != null) {
            report.setIssue(dto.getIssue());
        } else {
            report.setIssue(null);
        }

        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
            report.setDescription(dto.getDescription().trim());
        } else {
            report.setDescription(null);
        }

        report.setLatitude(dto.getLatitude());
        report.setLongitude(dto.getLongitude());


        var saved = reportRepository.save(report);

        return new ReportResponseDTO(
                saved.getId(),
                saved.getIssue(),
                saved.getCreationDate()
        );
    }
}
