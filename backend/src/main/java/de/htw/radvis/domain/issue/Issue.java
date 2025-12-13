package de.htw.radvis.domain.issue;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

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

    private final String label;

    Issue(String label){ this.label = label; }

    @JsonValue
    public String getLabel(){ return this.label; }

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