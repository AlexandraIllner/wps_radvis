package de.htw.radvis.schnittstelle;

import de.htw.radvis.domain.ReportService;
import de.htw.radvis.schnittstelle.view.ReportCreateDTO;
import de.htw.radvis.schnittstelle.view.ReportResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;

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
        System.out.println("=== REPORT DTO INCOMING ===");
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

    @GetMapping
    public ResponseEntity<List<ReportResponseDTO>> getReports() {
        List<ReportResponseDTO> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponseDTO> getReportById(@PathVariable Long id) {
        ReportResponseDTO report = reportService.getReportById(id);
        return ResponseEntity.ok(report);
    }
}
