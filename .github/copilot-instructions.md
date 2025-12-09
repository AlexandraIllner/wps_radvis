# Copilot Agent Onboarding Instructions

## Repository Overview

**RadVIS Mängelmelder** - A defect reporting application for bicycle infrastructure, consisting of an Angular frontend and Spring Boot backend.

- **Size**: ~66MB (excluding node_modules)
- **Languages**: TypeScript (19 files), Java (14 files)
- **Frontend**: Angular 20.3.0 with Angular Material
- **Backend**: Spring Boot 3.5.6 with Java 17
- **Database**: H2 in-memory database (PostgreSQL mode)

## Architecture

### Frontend (`/frontend`)

- **Framework**: Angular 20.3.0 (standalone components)
- **Runtime**: Node.js v20.19.5, npm v10.8.2
- **UI Library**: Angular Material 20.2.9
- **Testing**: Karma + Jasmine with ChromeHeadless
- **Main Entry**: `src/main.ts` → `src/app/app.ts`
- **Components**: app, camera, formular, header, karte, photo-upload
- **API Service**: `src/app/core/globalService/api.services.ts`
- **Environment Config**: `src/enviroments/enviroment.ts` (backend URL: http://localhost:8000)

### Backend (`/backend`)

- **Framework**: Spring Boot 3.5.6
- **Runtime**: Java 17 (OpenJDK Temurin)
- **Build Tool**: Maven wrapper (`./mvnw`)
- **Main Class**: `de.htw.radvis.RadvisMockBackendApplication`
- **Server Port**: 8000
- **Database**: H2 in-memory (jdbc:h2:mem:radvis)
- **H2 Console**: Enabled at `/h2-console`
- **Packages**:
  - `de.htw.radvis.web`: Controllers (PingController, IssueController, ReportController)
  - `de.htw.radvis.app`: Services (ReportService)
  - `de.htw.radvis.domain`: Entities (Issue, Report)
  - `de.htw.radvis.data`: Repositories (ReportRepository)

## Build & Test Instructions

### Frontend

**CRITICAL: Always set PUPPETEER_SKIP_DOWNLOAD=true for npm install due to network restrictions.**

```bash
cd frontend

# Install dependencies (REQUIRED on first run or after package.json changes)
PUPPETEER_SKIP_DOWNLOAD=true npm install

# Build (development mode - RECOMMENDED, ~5 seconds)
npx ng build --configuration=development
# Output: frontend/dist/frontend/

# Build (production mode - FAILS due to network restrictions accessing fonts.googleapis.com)
# DO NOT USE: npx ng build

# Run development server
npm run start:frontend  # or: npx ng serve
# Opens on http://localhost:4200/

# Run tests (CURRENTLY FAILING - TypeScript errors in app.spec.ts)
# Tests reference properties that are commented out in app.ts
npm test
# Expected: Tests will fail with TS2339 errors for selectedCategory, description, submitReport, isLoading
```

**Known Frontend Issues**:

- Production builds fail due to font inlining from googleapis.com (network blocked)
- Tests are currently failing because app.ts has commented-out code that tests reference
- Always use `--configuration=development` for builds

### Backend

```bash
cd backend

# Clean and build (skip tests, ~41 seconds)
./mvnw clean package -DskipTests

# Build output: backend/target/radvis-mock-backend-0.0.1-SNAPSHOT.jar

# Run tests (CURRENTLY 1 FAILING TEST)
./mvnw test
# Expected failure: IssueControllerTest.getIssues_returnsAllEnumValues_asJsonArray
# Reason: Test expects uppercase enum values like "SCHLAGLOCH" but API returns "Schlagloch"

# Run Spring Boot application
./mvnw spring-boot:run
# Server starts on http://localhost:8000
# API endpoints: /api/ping, /api/issues, /api/reports
```

**Known Backend Issues**:

- One test failure in IssueControllerTest due to enum case mismatch
- Duplicate dependency warning for spring-boot-starter-validation in pom.xml (line 56)

### Run Both Together

From frontend directory:

```bash
npm run start:dev  # Uses concurrently to start both frontend and backend
```

## Configuration Files

### Frontend

- `package.json`: Scripts and dependencies
- `angular.json`: Angular CLI configuration, build settings
- `karma.conf.js`: Test runner configuration (ChromeHeadless)
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`: TypeScript configs
- `.editorconfig`: Code style (2 spaces, single quotes for TS)

### Backend

- `pom.xml`: Maven dependencies and build configuration
- `src/main/resources/application.properties`: Application name
- `src/main/resources/application.yml`: Database, JPA, H2 console, server port

## Key Project Files

**Root**:

- `LICENSE.txt`: European Union Public Licence v1.2
- `.gitignore`: Excludes .idea/, node_modules/, coverage/, .angular/, \*.tsbuildinfo

**Frontend Structure**:

```
frontend/
  src/
    app/
      app.ts - Main component (some code commented out)
      app.html - Main template
      app.routes.ts - Routing configuration
      core/globalService/api.services.ts - HTTP service
      [camera, formular, header, karte, photo-upload]/ - Feature components
    enviroments/enviroment.ts - Backend API URL
    main.ts - Bootstrap application
  public/ - Static assets
```

**Backend Structure**:

```
backend/
  src/main/java/de/htw/radvis/
    RadvisMockBackendApplication.java - Spring Boot main class
    web/ - REST controllers
    app/ - Business logic services
    domain/ - JPA entities
    data/ - Spring Data repositories
  src/test/java/ - JUnit tests
```

## Validation & CI

**No GitHub Actions or CI pipelines are currently configured.**

To validate changes:

1. Run `PUPPETEER_SKIP_DOWNLOAD=true npm install` in frontend/
2. Build frontend with `npx ng build --configuration=development`
3. Build backend with `./mvnw clean package -DskipTests`
4. Optionally run tests (expect known failures)

## Common Workflows

**Making Frontend Changes**:

1. Navigate to `frontend/`
2. Ensure dependencies installed: `PUPPETEER_SKIP_DOWNLOAD=true npm install`
3. Make changes to TypeScript/HTML/CSS files
4. Build: `npx ng build --configuration=development`
5. Test locally: `npm run start:frontend`

**Making Backend Changes**:

1. Navigate to `backend/`
2. Make changes to Java files
3. Build: `./mvnw clean package -DskipTests`
4. Run: `./mvnw spring-boot:run`
5. Test endpoints with curl: `curl http://localhost:8000/api/ping`

**Adding Dependencies**:

- Frontend: Add to `frontend/package.json`, run `PUPPETEER_SKIP_DOWNLOAD=true npm install`
- Backend: Add to `backend/pom.xml`, Maven will auto-download on next build

## Important Notes

- **Always use PUPPETEER_SKIP_DOWNLOAD=true** when running npm install due to network restrictions
- **Always build frontend in development mode** to avoid Google Fonts network issues
- Frontend tests currently fail due to commented code in app.ts - this is a known issue
- Backend has one failing test due to enum case mismatch - this is a known issue
- The application has NO continuous integration or automated validation pipeline
- Trust these instructions and only search for additional information if something documented here is incorrect or incomplete
