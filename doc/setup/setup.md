# Projekt Setup Anleitung 
### 1. Voraussetzungen vorbereiten/installieren

- **Git installieren**: [Download Git](https://git-scm.com/downloads)
- **Node.js installieren**: [Download Node.js](https://nodejs.org)
- **Angular CLI installieren**:
  ```bash
  npm install -g @angular/cli
  ```
- **Entwicklungsumgebung**:
    - Wählen und installieren Sie eine IDE, um den Code anzusehen und zu starten (z.B. IntelliJ IDEA oder VS Code).

### Verifikation der Installation

- Überprüfen Sie, ob Git erfolgreich installiert wurde:
  ```bash
  git --version
  ```
- Überprüfen Sie, ob Node.js erfolgreich installiert wurde:
  ```bash
  node -v
  ```
- Überprüfen Sie, ob npm (Node Package Manager) erfolgreich installiert wurde:
  ```bash
  npm -v
  ```

## 2. Repository klonen

- Repository klonen:
  ```bash
  git clone https://github.com/AlexandraIllner/wps_radvis.git
  ```
- In den Projektordner wechseln:
  ```bash
  cd wps_radvis
  ```

## 3. Backend starten

- In das Backend-Verzeichnis wechseln:
  ```bash
  cd backend
  ```
- Backend starten:
  ```bash
  ./mvnw spring-boot:run
  ```
- Das Backend läuft unter: [http://localhost:8000](http://localhost:8000)

## 4. Frontend starten

- In das Frontend-Verzeichnis wechseln:
  ```bash
  cd frontend
  ```
- Abhängigkeiten installieren:
  ```bash
  npm install
  ```
- Angular Server starten:
  ```bash
  ng serve
  ```
- Das Frontend läuft unter: [http://localhost:4200](http://localhost:4200)