package de.htw.radvis.app;

import de.htw.radvis.data.ReportRepository;
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
        report.setIssue(dto.getIssue());
        report.setDescription(dto.getDescription());
        report.setLatitude(dto.getLatitude());
        report.setLongitude(dto.getLongitude());

        var saved = reportRepository.save(report);
        return new ReportResponseDTO(
                saved.getId(),
                saved.getIssue(),
                saved.getCreationDate());
    }
}
