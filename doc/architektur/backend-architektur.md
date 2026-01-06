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
  - `IssueController`: Kategorien abrufen
    - `GET /api/issues` → Alle Issue-Enums
    - `GET /api/issue-labels` → Issue-Labels für Dropdown
  - `ReportController`: Report-Verwaltung
    - `POST /api/reports` → Report mit Fotos erstellen (Multipart)
  - `PingController`: Health-Check
  - DTOs: `IssueLabelDTO`, `ReportCreateDTO`, `ReportResponseDTO`

### 2. Application Layer (`*.app`)
- **Zweck:** Business-Logik, Validierung, Orchestrierung
- **Komponenten:**
  - `PhotoValidator`: Foto-Validierung
    - Max 10 MB pro Bild
    - Max 30 MB gesamt
    - Erlaubte Formate: JPG, JPEG, PNG
    - HTTP-Status: 413 (zu groß), 415 (falscher Typ)
  - `ReportService`: Report-Verarbeitung
    - `create(ReportCreateDTO, MultipartFile[])` → Erstellt Report mit Fotos
    - Koordinaten-Rundung auf 6 Nachkommastellen
    - Foto-Speicherung als ReportPhoto

### 3. Domain Layer (`*.domain`)
- **Zweck:** Geschäftsobjekte, Entitäten
- **Entitäten:**
  - `Issue` (Enum): 9 Kategorien (Schlagloch, Schlechter Straßenbelag, etc.)
  - `Report`: Problem-Meldungen mit Geo-Daten
    - `id`, `issue`, `description`, `latitude`, `longitude`, `creationDate`, `photos`
  - `ReportPhoto`: Foto-Anhänge (LONGBLOB)
    - `id`, `data` (byte[]), `report` (ManyToOne)

### 4. Data Layer (`*.data`)
- **Zweck:** Datenbankzugriff
- **Komponenten:**
  - `ReportRepository`: Spring Data JPA Repository

## Package-Struktur

```
de.htw.radvis
├── app/              (Services, Validators)
│   ├── PhotoValidator
│   └── ReportService
├── data/             (Repositories)
│   └── ReportRepository
├── domain/
│   ├── issue/        (Issue Enum)
│   └── report/       (Report, ReportPhoto)
└── web/
    ├── issue/        (IssueController, IssueLabelDTO)
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

## REST-API Endpunkte

| Endpunkt | Methode | Request | Response | Status |
|----------|---------|---------|----------|--------|
| `/api/issues` | GET | - | `List<Issue>` | 200 |
| `/api/issue-labels` | GET | - | `List<IssueLabelDTO>` | 200 |
| `/api/reports` | POST | Multipart (report + photos) | `ReportResponseDTO` | 201 |

## Request Flow Beispiele

### Report mit Foto erstellen (POST /api/reports)

```
Client (FormData)
    │
    ▼
ReportController.createReport()
    │ (CORS, Multipart)
    ▼
PhotoValidator.validatePhotos()
    │ (10MB/Bild, 30MB gesamt, JPG/PNG)
    ▼
ReportService.create()
    │ (DTO → Entity, Koordinaten runden)
    ▼
ReportRepository.save()
    │ (JPA)
    ▼
H2 Database (Report + ReportPhoto)
    │
    ▼
Response (201 Created, Location-Header)
```

### Kategorien abrufen (GET /api/issues)

```
Client Request
    │
    ▼
IssueController.getIssues()
    │ (direkt Enum-Werte)
    ▼
Response (200 OK, List<Issue>)
```

## DTOs & Entities

### ReportCreateDTO (Input)
```java
{
  "issue": "SCHLAGLOCH",              // optional, Issue-Enum
  "description": "Großes Loch...",    // optional, max 1000 Zeichen
  "latitude": 52.520008,              // optional, -90 bis 90
  "longitude": 13.404954              // optional, -180 bis 180
}
+ photos: MultipartFile[] (max 3)
```

### ReportResponseDTO (Output)
```java
{
  "id": 1,
  "issue": "SCHLAGLOCH",
  "created": "2026-01-03T10:30:00Z"
}
```

### Report Entity (Datenbank)
- `id` (Long, auto-generated)
- `issue` (Issue Enum as String, nullable)
- `description` (String, max 1000, nullable)
- `latitude` (BigDecimal, precision 10, scale 6, nullable)
- `longitude` (BigDecimal, precision 10, scale 6, nullable)
- `creationDate` (Instant, auto, not updatable)
- `photos` (OneToMany → ReportPhoto, cascade ALL, orphanRemoval)

### ReportPhoto Entity
- `id` (Long, auto-generated)
- `data` (byte[], LONGBLOB)
- `report` (ManyToOne → Report)

## Validation Rules

### PhotoValidator
- **Max-Size pro Bild:** 10 MB
- **Max-Size gesamt:** 30 MB
- **Erlaubte Formate:** image/jpg, image/jpeg, image/png
- **Error Responses:**
  - `415 UNSUPPORTED_MEDIA_TYPE` → Falscher Dateityp
  - `413 PAYLOAD_TOO_LARGE` → Datei/Gesamtgröße überschritten

### Bean Validation (ReportCreateDTO)
- `@Size(max=1000)` → description
- `@DecimalMin("-90.0") @DecimalMax("90.0")` → latitude
- `@DecimalMin("-180.0") @DecimalMax("180.0")` → longitude
- Issue oder Description muss ausgefüllt sein (Frontend-Validierung)

## Error Handling

### HTTP Status Codes

| Status | Verwendung |
|--------|------------|
| 200 OK | Erfolgreiche GET-Requests |
| 201 Created | Erfolgreiche POST-Requests (mit Location-Header) |
| 400 Bad Request | Validation-Fehler (Bean Validation) |
| 413 Payload Too Large | Foto zu groß (PhotoValidator) |
| 415 Unsupported Media Type | Falsches Foto-Format (PhotoValidator) |
| 500 Internal Server Error | Server-Fehler |

### Exception Handling
- `ResponseStatusException` für PhotoValidator-Fehler
- Bean Validation → automatisch 400 Bad Request
- Location-Header bei 201 Created: `/api/reports/{id}`

## Configuration

### application.properties

```properties
# Application Name
spring.application.name=radvis-mock-backend

# File Upload
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=30MB

# H2 Database (Defaults)
spring.datasource.url=jdbc:h2:mem:radvisdb
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

### CORS Configuration
- Erlaubt: `http://localhost:4200` (Frontend)
- Controllers: `@CrossOrigin(origins = "http://localhost:4200")`

## Externe Services

| Service | Zweck | Port |
|---------|-------|------|
| H2 Console | DB-Verwaltung | 8080/h2-console |

## Design Patterns

- **Layered Architecture** - Schichtentrennung
- **Repository Pattern** - Datenzugriff-Abstraktion (Spring Data JPA)
- **DTO Pattern** - API/Domain-Trennung (CreateDTO, ResponseDTO)
- **Service Layer** - Business-Logik-Kapselung (ReportService)
- **Validator Pattern** - Input-Validierung (PhotoValidator)

---

**Stand:** Januar 2026