package de.htw.radvis.domain;

public enum Issue {
    SCHLAGLOCH("Schlagloch"),
    SCHLECHTER_STRASSENBELAG("Schlechter Straßenbelag"),
    BEWUCHS("Bewuchs"),
    FEHLENDE_BESCHILDERUNG("Fehlende Beschilderung"),
    FALSCHE_BESCHILDERUNG("Falsche Beschilderung");

    private final String label;

    Issue(String label){
        this.label = label;
    }

    public String getLabel(){
        return this.label;
    }
}
