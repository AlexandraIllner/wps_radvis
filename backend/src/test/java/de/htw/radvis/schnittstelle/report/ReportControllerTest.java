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

import java.time.Instant;

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
                Instant.now()
        );

        Mockito.when(reportService.create(Mockito.any(), Mockito.any()))
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
                "report","",MediaType.APPLICATION_JSON_VALUE,reportJson.getBytes()
        );

        MockMultipartFile photo = new MockMultipartFile(
                "photos","bild.jpg",MediaType.IMAGE_JPEG_VALUE,"dummy".getBytes()
        );

        mockMvc.perform(multipart("/api/reports")
                        .file(reportPart)
                        .file(photo)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location","/api/reports/123"))
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
                "report","",MediaType.APPLICATION_JSON_VALUE,reportJson.getBytes()
        );

        MockMultipartFile invalidFile = new MockMultipartFile(
                "photos","file.txt",MediaType.TEXT_PLAIN_VALUE,"xxx".getBytes()
        );

        Mockito.when(reportService.create(Mockito.any(),Mockito.any()))
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
                Instant.now()
        );

        Mockito.when(reportService.create(Mockito.any(), Mockito.any()))
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
}
