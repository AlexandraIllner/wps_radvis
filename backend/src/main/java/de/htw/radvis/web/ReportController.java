package de.htw.radvis.web;

import de.htw.radvis.app.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
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
    public ResponseEntity<ReportResponseDTO>createReport(
            @Valid @RequestPart ReportCreateDTO reportCreateDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) throws IOException {
        var response = reportService.create(reportCreateDTO, photo);
        var location = URI.create("/api/reports/" + response.id());
        return ResponseEntity.created(location).body(response);
    }
}
