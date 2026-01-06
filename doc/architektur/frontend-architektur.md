# Frontend-Architektur

## Übersicht

Angular-Anwendung mit **Component-Based Architecture** und **Standalone Components**. Klare Trennung zwischen Presentation, Service und Data Layer.

## Architektur-Diagramm

```
┌─────────────────────────────────────────────────────────────┐
│            PRESENTATION LAYER (Components)                   │
│  Formular  │  Karte  │  Camera  │  PhotoUpload  │  Header   │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│              SERVICE LAYER (Services/Interceptors)           │
│  ApiService (globalService)  │  errorInterceptor             │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                   DATA LAYER (Models)                        │
│  FormData  │  Observable<any>  │  File[]                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                      ┌──────▼──────┐
                      │   Backend   │
                      │  REST API   │
                      │   :8080     │
                      └─────────────┘
```

## Layer-Übersicht

### 1. Presentation Layer (Components)
- **Zweck:** UI-Darstellung, User Interaction, Templates
- **Komponenten:**
    - `Formular`: Hauptformular für Mängelmeldung (Kategorie, Beschreibung, Koordinaten, Fotos)
    - `Karte`: Leaflet-basierte Karten-Komponente mit Geolocation und Marker-Auswahl
    - `Camera`: Foto-Aufnahme über Gerätekamera oder Galerie
    - `PhotoUpload`: Foto-Upload mit Validierung (max. 3 Bilder, 10MB pro Bild, JPG/PNG)
    - `Header`: App-Header und Navigation

### 2. Service Layer
- **Zweck:** Business-Logik, API-Kommunikation, HTTP-Handling
- **Services:**
    - `ApiService` (`core/globalService`): Zentrale API-Kommunikation
        - `getIssue()`: Holt alle Issues/Kategorien vom Backend
        - `createReport(data: FormData)`: Erstellt Report mit Kategorie, Beschreibung, Fotos, Geo-Koordinaten
    - `errorInterceptor` (`core/interceptors`): HTTP-Error-Handling mit MatSnackBar
        - Status 0: Server offline
        - Status 400: Validierungsfehler
        - Status 404: Endpunkt nicht gefunden
        - Status 500+: Serverfehler

### 3. Data Layer (Models)
- **Zweck:** Datenstrukturen für API-Kommunikation
- **Daten:**
    - FormData-Objekte für Multipart-Uploads
    - Observable<any> für asynchrone API-Responses
    - File[] für Foto-Verwaltung
    - Report-Objekt: `{ issue, description, latitude, longitude }`

## Folder-Struktur

```
src/app/
├── core/                    (Singleton Services, Interceptors)
│   ├── globalService/
│   │   ├── api.services.spec.ts
│   │   └── api.services.ts
│   └── interceptors/
│       └── error.interceptor.ts
├── camera/                  (Foto-Aufnahme)
│   ├── camera.component.ts
│   ├── camera.component.html
│   ├── camera.component.css
│   └── camera.spec.ts
├── formular/                (Hauptformular)
│   ├── formular.component.ts
│   ├── formular.component.html
│   ├── formular.component.css
│   └── formular.spec.ts
├── header/                  (App-Header)
│   ├── header.component.ts
│   ├── header.component.html
│   ├── header.component.css
│   └── header.spec.ts
├── karte/                   (Leaflet Map)
│   ├── karte.component.ts
│   ├── karte.component.html
│   ├── karte.component.css
│   └── karte.spec.ts
├── photo-upload/            (Foto-Upload & Validierung)
│   ├── photo-upload.component.ts
│   ├── photo-upload.component.html
│   ├── photo-upload.component.css
│   └── photo-upload.spec.ts
├── app.component.ts         (Root Component)
├── app.routes.ts            (Routing: /mängel)
└── app.config.ts            (App-Konfiguration)
```

## Technologie-Stack

- **Framework:** Angular 20.3.0
- **HTTP-Client:** Angular HttpClient
- **Routing:** Angular Router (Standalone Components, kein NgModule)
- **Forms:** Template-driven Forms (FormsModule, `[(ngModel)]`)
- **UI-Library:** Angular Material 20.2.9 (Buttons, SnackBar, Forms, Icons)
- **Maps:** Leaflet 1.9.4 mit ngx-leaflet, ngx-leaflet-locate
- **Build:** Angular CLI 20.3.6
- **Sprache:** TypeScript 5.9.2

## Abhängigkeitsregeln

```
Components ──> Services ──> HttpClient ──> Backend
```

✅ **Erlaubt:** Components nutzen ApiService, ApiService nutzt HttpClient  
❌ **Verboten:** Services dürfen nicht von Components abhängen

## API-Kommunikation

| Component | ApiService Methode | Backend-Endpunkt | Methode | Daten-Format |
|-----------|-------------------|------------------|---------|--------------|
| Formular (ngOnInit) | getIssue() | /api/issues | GET | JSON (Kategorien) |
| Formular (submitReport) | createReport() | /api/reports | POST | FormData (Multipart) |

**FormData-Struktur für createReport():**
```typescript
{
  report: Blob({
    issue: string,           // Kategorie
    description: string,     // Beschreibung
    latitude: number | null, // Geo-Koordinaten
    longitude: number | null
  }),
  photos: File[]             // Max. 3 Bilder (JPG/PNG, 10MB)
}
```

**Validierung:**
- Foto-Upload: Max. 3 Bilder, 10MB pro Bild, JPG/PNG, Gesamt max. 30MB
- Formular: Kategorie oder Beschreibung muss ausgefüllt sein
- Koordinaten: Optional, via Karten-Klick oder Geolocation

## Design Patterns

- **Standalone Components** - Kein NgModule, moderne Angular-Architektur
- **Service Pattern** - ApiService als Singleton (`providedIn: 'root'`)
- **Interceptor Pattern** - Globales Error-Handling mit funktionalem Interceptor
- **Observer Pattern** - RxJS Observables für asynchrone API-Calls
- **ViewChild Pattern** - Parent-Child-Kommunikation (Formular ↔ PhotoUpload/Karte)

---

**Stand:** Januar 2026