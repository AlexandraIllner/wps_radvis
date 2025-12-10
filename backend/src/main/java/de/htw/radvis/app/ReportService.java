package de.htw.radvis.app;

import de.htw.radvis.data.ReportRepository;
import de.htw.radvis.domain.report.Report;
import de.htw.radvis.domain.report.ReportPhoto;
import de.htw.radvis.web.report.ReportCreateDTO;
import de.htw.radvis.web.report.ReportResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.RoundingMode;

import static de.htw.radvis.app.PhotoValidator.log;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final PhotoValidator photoValidator;

    public ReportService(ReportRepository reportRepository, PhotoValidator photoValidator) {
        this.reportRepository = reportRepository;
        this.photoValidator = photoValidator;
    }

    public ReportResponseDTO create(ReportCreateDTO dto, MultipartFile[] photos) throws IOException {
        Report report = getReport(dto);

        if (photos != null) {
            photoValidator.validatePhotos(photos);
            log.info("Received {} photos for report", photos.length);

            for (MultipartFile file : photos) {
                if (file != null && !file.isEmpty()) {
                    ReportPhoto photoEntity = new ReportPhoto();
                    photoEntity.setData(file.getBytes());
                    photoEntity.setReport(report);
                    report.getPhotos().add(photoEntity);
                }
            }
        }

        var saved = reportRepository.save(report);
        log.info("Created report with id={} (lat={}, lon={})",
                saved.getId(), saved.getLatitude(), saved.getLongitude());
        return new ReportResponseDTO(saved.getId(), saved.getIssue(), saved.getCreationDate());

    }

    private static Report getReport(ReportCreateDTO dto) {
        Report report = new Report();

        if (dto.getIssue() != null) {
            report.setIssue(dto.getIssue());
        }

        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
            report.setDescription(dto.getDescription().trim());
        }

        if (dto.getLatitude() != null) {
            report.setLatitude(dto.getLatitude().setScale(6, RoundingMode.HALF_UP));
        }

        if (dto.getLongitude() != null) {
            report.setLongitude(dto.getLongitude().setScale(6, RoundingMode.HALF_UP));
        }
        return report;
    }
}
