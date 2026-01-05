package de.htw.radvis.domain;

import de.htw.radvis.domain.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository für die Report-Entität.
 * Stellt grundlegende CRUD-Operationen für Reports bereit,
 * z.B. Speichern, Finden, Löschen und Aktualisieren von Meldungen.
 * Erweitert {@link JpaRepository} und nutzt dessen Standardmethoden.
 */
public interface ReportRepository extends JpaRepository<Report, Long> {
}

