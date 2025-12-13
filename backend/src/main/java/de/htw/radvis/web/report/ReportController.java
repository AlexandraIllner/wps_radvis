package de.htw.radvis.web.report;

import de.htw.radvis.app.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;

@Controller
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponseDTO> createReport(
            @Valid @RequestPart("report") ReportCreateDTO reportCreateDTO,
            @RequestPart(value = "photos", required = false) MultipartFile[] photos
    ) throws IOException {
        System.out.println("=== REPORT DTO INCOMMING ===");
        System.out.println("Issue: " + reportCreateDTO.getIssue());
        System.out.println("Latitude: " + reportCreateDTO.getLatitude());
        System.out.println("Longitude: " + reportCreateDTO.getLongitude());
        System.out.println("Description: " + reportCreateDTO.getDescription());
        System.out.println("Fotos: " + (photos != null ? photos.length : 0));
        System.out.println("============================");
        var response = reportService.create(reportCreateDTO, photos);
        var location = URI.create("/api/reports/" + response.id());
        return ResponseEntity.created(location).body(response);
    }
}
