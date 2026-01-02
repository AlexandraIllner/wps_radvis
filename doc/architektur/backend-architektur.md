# Backend-Architektur

## Übersicht

Spring Boot Anwendung mit **Layered Architecture** (Schichtenarchitektur). Klare Trennung zwischen Web, Application, Domain und Data Layer.

## Architektur-Diagramm

```
┌─────────────────────────────────────────────────────────────┐
│                     WEB LAYER (*.web)                        │
│  IssueController  │  ReportController  │  PingController     │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                APPLICATION LAYER (*.app)                     │
│  PhotoValidator  │  ReportService                            │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  DOMAIN LAYER (*.domain)                     │
│  Issue  │  Report  │  ReportPhoto                            │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                   DATA LAYER (*.data)                        │
│  ReportRepository (Spring Data JPA)                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                      ┌──────▼──────┐
                      │     H2      │
                      │  (In-Memory)│
                      └─────────────┘
```

## Layer-Übersicht

### 1. Web Layer (`*.web`)
- **Zweck:** REST-Endpunkte, Request/Response-Handling
- **Komponenten:**
    - `IssueController`: CRUD für Issues
    - `ReportController`: Report-Verwaltung
    - `PingController`: Health-Check
    - DTOs: `IssueLabelDTO`, `ReportCreateDTO`, `ReportResponseDTO`

### 2. Application Layer (`*.app`)
- **Zweck:** Business-Logik, Validierung, Orchestrierung
- **Komponenten:**
    - `PhotoValidator`: Foto-Validierung
    - `ReportService`: Report-Verarbeitung

### 3. Domain Layer (`*.domain`)
- **Zweck:** Geschäftsobjekte, Entitäten
- **Entitäten:**
    - `Issue`: Problem-Meldungen
    - `Report`: Berichte mit Geo-Daten
    - `ReportPhoto`: Foto-Anhänge

### 4. Data Layer (`*.data`)
- **Zweck:** Datenbankzugriff
- **Komponenten:**
    - `ReportRepository`: Spring Data JPA Repository

## Package-Struktur

```
de.htw.radvis
├── app/              (Services, Validators)
├── data/             (Repositories)
├── domain/
│   ├── issue/        (Issue Entity)
│   └── report/       (Report, ReportPhoto)
└── web/
    ├── issue/        (IssueController, DTOs)
    └── report/       (ReportController, DTOs)
```

## Technologie-Stack

- **Framework:** Spring Boot 3.5.6
- **Persistierung:** Spring Data JPA
- **Datenbank:** H2 (In-Memory)
- **Build:** Maven 3.6.3
- **Sprache:** Java 21

## Abhängigkeitsregeln

```
Web ──> Application ──> Domain <── Data
```

✅ **Erlaubt:** Jede Schicht darf Domain verwenden  
❌ **Verboten:** Domain darf nicht von Web/Application abhängen

## Externe Services

| Service | Zweck | Port |
|---------|-------|------|
| H2 Console | DB-Verwaltung | 8080/h2-console |
| Keycloak | Auth | 8090 |

## Design Patterns

- **Layered Architecture** - Schichtentrennung
- **Repository Pattern** - Datenzugriff-Abstraktion
- **DTO Pattern** - API/Domain-Trennung
- **Service Layer** - Business-Logik-Kapselung

---

**Stand:** Dezember 2025