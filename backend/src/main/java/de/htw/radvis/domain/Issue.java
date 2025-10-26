package de.htw.radvis.domain;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Issue {
    SCHLAGLOCH("Schlagloch"),
    SCHLECHTER_STRASSENBELAG("Schlechter Straßenbelag"),
    BEWUCHS("Bewuchs"),
    FEHLENDE_BESCHILDERUNG("Fehlende Beschilderung"),
    FALSCHE_BESCHILDERUNG("Falsche Beschilderung"),
    POLLER_HINDERNIS("Poller/Hindernis"),
    UNKLARE_MARKIERUNG("Unklare Markierung"),
    UNEBENHEITEN_BODENWELLEN("Unebenheiten/Bodenwellen");

    private final String label;

    Issue(String label){
        this.label = label;
    }
    @JsonValue
    public String getLabel(){
        return this.label;
    }
}
