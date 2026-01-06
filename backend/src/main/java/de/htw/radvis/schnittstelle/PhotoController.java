package de.htw.radvis.schnittstelle;

import de.htw.radvis.domain.ReportPhotoRepository;
import de.htw.radvis.domain.entity.ReportPhoto;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private final ReportPhotoRepository reportPhotoRepository;

    public PhotoController(ReportPhotoRepository reportPhotoRepository) {
        this.reportPhotoRepository = reportPhotoRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable Long id) {
        ReportPhoto photo = reportPhotoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found"));

        MediaType mediaType = MediaType.parseMediaType(photo.getContentType());

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(photo.getData());
    }
}
