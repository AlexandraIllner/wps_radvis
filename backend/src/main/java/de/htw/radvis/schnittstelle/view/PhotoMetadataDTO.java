package de.htw.radvis.schnittstelle.view;

public record PhotoMetadataDTO(
        Long id,
        String fileName,
        String contentType,
        long size,
        String url
) {}

