package de.htw.radvis.web;

import de.htw.radvis.app.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.URI;

@Controller
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    private final ReportService reportService;
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ReportResponseDTO>createReport(@Valid @RequestBody ReportCreateDTO reportCreateDTO) {
        var response = reportService.create(reportCreateDTO);
        var location = URI.create("/api/reports/" + response.id());
        return ResponseEntity.created(location).body(response);
    }
}
