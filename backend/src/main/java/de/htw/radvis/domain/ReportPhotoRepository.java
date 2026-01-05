package de.htw.radvis.domain;

import de.htw.radvis.domain.entity.ReportPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportPhotoRepository extends JpaRepository <ReportPhoto, Long> {
}
