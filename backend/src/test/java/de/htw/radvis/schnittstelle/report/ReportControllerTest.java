package de.htw.radvis.schnittstelle.report;

import de.htw.radvis.domain.ReportService;
import de.htw.radvis.domain.valueObjects.Issue;
import de.htw.radvis.schnittstelle.view.ReportResponseDTO;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ReportControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ReportService reportService;

    @Test
    void createReport_withValidMultipart_shouldReturn201() throws Exception {

        ReportResponseDTO mockResponse = new ReportResponseDTO(
                123L,
                Issue.SCHLAGLOCH,
                "Grosses Loch",
                BigDecimal.valueOf(52.52),
                BigDecimal.valueOf(13.40),
                Instant.now()
        );

        when(reportService.create(Mockito.any(), Mockito.any()))
                .thenReturn(mockResponse);

        String reportJson = """
                {
                    "issue":"Schlagloch",
                    "description":"Grosses Loch",
                    "latitude":52.52,
                    "longitude":13.40
                }
                """;

        MockMultipartFile reportPart = new MockMultipartFile(
                "report", "", MediaType.APPLICATION_JSON_VALUE, reportJson.getBytes()
        );

        MockMultipartFile photo = new MockMultipartFile(
                "photos", "bild.jpg", MediaType.IMAGE_JPEG_VALUE, "dummy".getBytes()
        );

        mockMvc.perform(multipart("/api/reports")
                        .file(reportPart)
                        .file(photo)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/reports/123"))
                .andExpect(jsonPath("$.id").value(123));
    }

    @Test
    void createReport_invalidFileType_shouldReturn415() throws Exception {

        String reportJson = """
                {
                    "issue":"Schlagloch",
                    "description":"Grosses Loch",
                    "latitude":52.52,
                    "longitude":13.40
                }
                """;

        MockMultipartFile reportPart = new MockMultipartFile(
                "report", "", MediaType.APPLICATION_JSON_VALUE, reportJson.getBytes()
        );

        MockMultipartFile invalidFile = new MockMultipartFile(
                "photos", "file.txt", MediaType.TEXT_PLAIN_VALUE, "xxx".getBytes()
        );

        when(reportService.create(Mockito.any(), Mockito.any()))
                .thenThrow(new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE));

        mockMvc.perform(multipart("/api/reports")
                        .file(reportPart)
                        .file(invalidFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isUnsupportedMediaType());
    }


    @Test
    void createReport_withoutLocation_shouldReturn201_andSaveNullCoordinates() throws Exception {

        ReportResponseDTO mockResponse = new ReportResponseDTO(
                999L,
                Issue.SCHLAGLOCH,
                "Grosses Loch",
                BigDecimal.valueOf(52.52),
                BigDecimal.valueOf(13.40),
                Instant.now()
        );

        when(reportService.create(Mockito.any(), Mockito.any()))
                .thenReturn(mockResponse);

        String reportJson = """
                {
                    "issue":"SCHLAGLOCH",
                    "description":"Meldung ohne Standort",
                    "latitude": null,
                    "longitude": null
                }
                """;

        MockMultipartFile reportPart = new MockMultipartFile(
                "report", "", MediaType.APPLICATION_JSON_VALUE,
                reportJson.getBytes()
        );


        mockMvc.perform(multipart("/api/reports")
                        .file(reportPart)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(999));
    }

    @Test
    void getReports_returnsListOfReports() throws Exception {
        ReportResponseDTO dto = new ReportResponseDTO(
                1L,
                Issue.SCHLAGLOCH,
                "Test description",
                BigDecimal.valueOf(52.5),
                BigDecimal.valueOf(13.4),
                Instant.parse("2024-01-01T10:00:00Z")
        );

        when(reportService.getAllReports()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].issue").value("Schlagloch"))
                .andExpect(jsonPath("$[0].description").value("Test description"))
                .andExpect(jsonPath("$[0].latitude").value(52.5))
                .andExpect(jsonPath("$[0].longitude").value(13.4))
                .andExpect(jsonPath("$[0].created").exists());
    }

    @Test
    void getReportById_returnsReport() throws Exception {
        ReportResponseDTO dto = new ReportResponseDTO(
                1L,
                Issue.BEWUCHS,
                null,
                BigDecimal.valueOf(52.5),
                BigDecimal.valueOf(13.4),
                Instant.now()
        );

        when(reportService.getReportById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/reports/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.issue").value("Bewuchs"));
    }

    @Test
    void getReportById_returns404_whenNotFound() throws Exception {
        when(reportService.getReportById(99L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

        mockMvc.perform(get("/api/reports/99"))
                .andExpect(status().isNotFound());
    }
}
