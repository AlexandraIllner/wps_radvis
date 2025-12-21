package de.htw.radvis.domain.issue;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enum für die verschiedenen Mangel-Kategorien (Issues).
 *
 * Wird verwendet, um Meldungen im Backend eindeutig zu kategorisieren.
 * Jede Kategorie besitzt ein lesbares Label, das z.B. im Frontend
 * oder in JSON-Antworten verwendet wird.
 *
 * Die Annotationen {@link JsonValue} und {@link JsonCreator} sorgen dafür,
 * dass die Umwandlung zwischen Enum und String automatisch erfolgt.
 */
public enum Issue {
    SCHLAGLOCH("Schlagloch"),
    SCHLECHTER_STRASSENBELAG("Schlechter Straßenbelag"),
    BEWUCHS("Bewuchs"),
    FEHLENDE_BESCHILDERUNG("Fehlende Beschilderung"),
    FALSCHE_BESCHILDERUNG("Falsche Beschilderung"),
    POLLER_HINDERNIS("Poller/Hindernis"),
    UNKLARE_MARKIERUNG("Unklare Markierung"),
    UNEBENHEITEN_BODENWELLEN("Unebenheiten/Bodenwellen"),
    KEINE_KATEGORIE("Keine Kategorie");

    /** Anzeigename der Kategorie (z.B. für JSON oder Frontend) */
    private final String label;

    Issue(String label){ this.label = label; }

    /**
     * Gibt das lesbare Label der Kategorie zurück.
     *
     * Wird durch {@link JsonValue} beim Serialisieren als String verwendet.
     *
     * @return Anzeigename der Kategorie
     */
    @JsonValue
    public String getLabel(){ return this.label; }

    /**
     * Wandelt ein String-Label in das passende Issue-Enum um.
     *
     * Wird durch {@link JsonCreator} beim Deserialisieren von JSON genutzt.
     *
     * @param value Label der Kategorie (z.B. "Schlagloch")
     * @return Passendes {@link Issue}-Enum
     * @throws IllegalArgumentException wenn kein passendes Issue existiert
     */
    @JsonCreator
    public static Issue fromLabel(String value) {
        for (Issue issue : Issue.values()) {
            if (issue.label.equalsIgnoreCase(value)) {
                return issue;
            }
        }
        throw new IllegalArgumentException("Unknown issue label: " + value);
    }
}