package de.htw.radvis.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@Component
public class PhotoValidator {
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    private static final long MAX_TOTAL_SIZE = 30 * 1024 * 1024;
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of("image/jpg", "image/jpeg", "image/png");
    public static final Logger log = LoggerFactory.getLogger(PhotoValidator.class);


    public void validatePhotos(MultipartFile[] photos) {

        if (photos == null) {
            return;
        }

        long totalSize = 0;

        for (MultipartFile file : photos) {
            if (file == null || file.isEmpty()) {
                continue;
            }

            String contentType = file.getContentType();
            if (contentType != null &&
                    !ALLOWED_IMAGE_TYPES.contains(contentType)) {
                throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Nur jpg- und png-Dateien sind erlaubt.");
            }

            long size = file.getSize();
            totalSize += size;

            if (size > MAX_FILE_SIZE) {
                throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,
                        "Die Datei " + file.getOriginalFilename() + " überschreitet das Limit von 10 MB.");
            }

            if (totalSize > MAX_TOTAL_SIZE) {
                throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,
                        "Die Gesamtgröße der Bilder überschreitet das Limit von 30 MB.");
            }

            log.info("Accepted file: {} ({} MB, {})",
                    file.getOriginalFilename(),
                    String.format("%.2f", (double) size / (1024 * 1024)),
                    contentType);
        }
    }
}
