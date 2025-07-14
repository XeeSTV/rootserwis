# Aplikacja Serwisowa

Kompletna aplikacja do zarządzania serwisem urządzeń z automatycznym tworzeniem bazy danych, konta administratora i serwera email.

## 🚀 Szybki Start

### Wymagania systemowe

- **Docker** (wersja 20.10+)
- **Docker Compose** (wersja 2.0+)
- **Linux/macOS/Windows** z WSL2
- **4GB RAM** (minimum)
- **10GB** wolnego miejsca na dysku

### Instalacja

1. **Sklonuj lub pobierz aplikację**
   ```bash
   cd serwis-app
   ```

2. **Uruchom interaktywny instalator**
   ```bash
   chmod +x ./scripts/install.sh
   ./scripts/install.sh
   ```

Instalator poprowadzi Cię przez cały proces konfiguracji i automatycznie:
- Zbierze podstawowe dane konfiguracyjne
- Utworzy bazę danych PostgreSQL z tabelami
- Stworzy konto administratora aplikacji
- Skonfiguruje serwer email (Postfix)
- Utworzy konto email
- Wygeneruje bezpieczne tokeny i klucze
- Zbuduje i uruchomi aplikację

## 📋 Proces Instalacji

Instalator poprosi o następujące informacje:

### 🔧 Konfiguracja bazy danych
- Nazwa bazy danych (domyślnie: `serwis`)
- Nazwa użytkownika (domyślnie: `postgres`)
- Hasło do bazy danych

### 📧 Konfiguracja serwera email
- Domena email (np. `serwis.local`)
- Nazwa użytkownika email (domyślnie: `serwis`)
- Hasło do konta email

### 👤 Konfiguracja administratora aplikacji
- Nazwa użytkownika administratora (domyślnie: `admin`)
- Hasło administratora (minimum 8 znaków)

### 🌐 Konfiguracja sieci
- Adres IP serwera (domyślnie: `localhost`)

### ✅ Automatycznie tworzone/generowane
- **Baza danych PostgreSQL** z tabelami (users, clients, repairs, protocols)
- **Konto administratora** w aplikacji
- **Serwer email Postfix** z uwierzytelnianiem
- **Konto email** (np. serwis@serwis.local)
- **Sekret JWT** (64 znaki - bezpieczny)
- **Tokeny sesji** (generowane podczas logowania)
- **Porty aplikacji** (Backend 8000, Frontend 3000, DB 5432, Mail 25/587/993)

## 🎯 Dostępne Adresy

Po instalacji aplikacja będzie dostępna pod adresami:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Dokumentacja**: http://localhost:8000/docs
- **Portal Klienta**: http://localhost:3000/client

## 📧 Serwer Email

Aplikacja zawiera wbudowany serwer email Postfix z następującymi funkcjami:

- **SMTP** na porcie 587 (z uwierzytelnianiem)
- **POP3/IMAP** na porcie 993
- **Automatyczne tworzenie konta email** na podstawie danych z instalacji
- **Wysyłanie protokołów napraw** w formacie PDF
- **Powiadomienia o statusie naprawy**

### Dane konta email:
- **Email**: serwis@serwis.local (lub inna domena)
- **Serwer SMTP**: mail:587
- **Hasło**: ustawione podczas instalacji

## 🔧 Zarządzanie Aplikacją

### Uruchomienie
```bash
docker-compose up -d
```

### Zatrzymanie
```bash
docker-compose down
```

### Sprawdzenie statusu
```bash
docker-compose ps
```

### Wyświetlanie logów
```bash
# Wszystkie logi
docker-compose logs -f

# Logi konkretnego serwisu
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f mail
```

### Restart aplikacji
```bash
docker-compose restart
```

### Przebudowanie aplikacji
```bash
docker-compose down
docker-compose up -d --build
```

### Aktualizacja konfiguracji
```bash
# Aktualizacja wybranych ustawień
./scripts/update-config.sh

# Pełna rekonfiguracja
./scripts/install.sh
```

## 🔍 Diagnostyka

### Sprawdzenie połączenia z bazą danych
```bash
docker-compose exec db psql -U postgres -d serwis -c "SELECT version();"
```

### Sprawdzenie serwera email
```bash
# Test SMTP
docker-compose exec mail postfix status

# Sprawdzenie logów email
docker-compose logs mail
```

### Sprawdzenie logów aplikacji
```bash
# Logi backendu
docker-compose logs backend

# Logi frontendu
docker-compose logs frontend

# Logi bazy danych
docker-compose logs db
```

### Sprawdzenie statusu kontenerów
```bash
docker-compose ps
```

## 🛠️ Rozwiązywanie Problemów

### Port już zajęty
Jeśli instalator zgłasza, że port jest zajęty:
```bash
# Sprawdź co używa portu
sudo lsof -i :[PORT]

# Zatrzymaj proces używający portu
sudo kill -9 [PID]
```

### Błąd połączenia z bazą danych
```bash
# Sprawdź czy baza się uruchomiła
docker-compose logs db

# Restartuj bazę danych
docker-compose restart db
```

### Problem z serwerem email
```bash
# Sprawdź status serwera email
docker-compose exec mail postfix status

# Restartuj serwer email
docker-compose restart mail
```

### Problem z Docker
```bash
# Sprawdź status Docker
docker info

# Restartuj Docker
sudo systemctl restart docker
```

### Problem z uprawnieniami
```bash
# Nadaj uprawnienia do skryptów
chmod +x ./scripts/*.sh

# Sprawdź uprawnienia do plików
ls -la
```

## 🔒 Bezpieczeństwo

### Zmiana hasła administratora
```bash
./scripts/update-config.sh
# Wybierz opcję 2 - Konfiguracja administratora
```

### Zmiana hasła email
```bash
./scripts/update-config.sh
# Wybierz opcję 1 - Konfiguracja email
```

### Zmiana sekretu JWT
```bash
./scripts/update-config.sh
# Wybierz opcję 4 - Wygeneruj nowy sekret JWT
```

### Backup bazy danych
```bash
# Utwórz backup
docker-compose exec db pg_dump -U postgres serwis > backup_$(date +%Y%m%d_%H%M%S).sql

# Przywróć backup
docker-compose exec -T db psql -U postgres -d serwis < backup_file.sql
```

## 📁 Struktura Plików

```
serwis-app/
├── backend/                 # Backend FastAPI
│   ├── app/                # Kod aplikacji
│   ├── requirements.txt    # Zależności Python
│   ├── Dockerfile         # Konfiguracja Docker
│   └── .env               # Zmienne środowiskowe (generowany)
├── frontend/               # Frontend React
│   ├── src/               # Kod aplikacji
│   ├── package.json       # Zależności Node.js
│   └── Dockerfile         # Konfiguracja Docker
├── scripts/                # Skrypty pomocnicze
│   ├── install.sh         # Interaktywny instalator
│   ├── update-config.sh   # Aktualizacja konfiguracji
│   ├── init-db.sql        # Inicjalizacja bazy danych
│   └── setup-mail.sh      # Konfiguracja serwera email
├── docker-compose.yml      # Konfiguracja Docker
└── README.md              # Ta dokumentacja
```

## 🔄 Aktualizacje

### Aktualizacja aplikacji
```bash
# Pobierz najnowszą wersję
git pull origin main

# Przebuduj i uruchom ponownie
docker-compose up -d --build
```

### Aktualizacja konfiguracji
```bash
# Aktualizacja wybranych ustawień
./scripts/update-config.sh

# Pełna rekonfiguracja
./scripts/install.sh
```

## 📞 Wsparcie

W przypadku problemów:

1. Sprawdź logi aplikacji
2. Uruchom diagnostykę
3. Sprawdź dokumentację
4. Skontaktuj się z administratorem

## 📝 Licencja

Ta aplikacja jest przeznaczona do użytku wewnętrznego.

---

**Uwaga**: Pamiętaj o regularnym tworzeniu kopii zapasowych bazy danych i pliku `backend/.env`! 