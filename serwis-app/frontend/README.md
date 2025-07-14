# Frontend Aplikacji Serwisowej

Nowoczesna aplikacja React z TypeScript do zarządzania serwisem urządzeń.

## Funkcjonalności

### Dla Serwisantów (Panel Administracyjny)
- **Dashboard** - przegląd statystyk i ostatnich napraw
- **Zarządzanie naprawami** - dodawanie, edycja, usuwanie napraw
- **Lista klientów** - zarządzanie bazą klientów
- **Protokoły** - generowanie protokołów napraw
- **Statystyki** - analiza wydajności serwisu

### Dla Klientów (Portal Publiczny)
- **Sprawdzanie statusu naprawy** - po kodzie naprawy
- **Szczegóły naprawy** - pełne informacje o urządzeniu i postępach

## Technologie

- **React 18** z TypeScript
- **React Router** do nawigacji
- **React Hook Form** do formularzy
- **Tailwind CSS** do stylowania
- **Lucide React** do ikon
- **React Hot Toast** do powiadomień
- **Axios** do komunikacji z API

## Instalacja i Uruchomienie

### Wymagania
- Node.js 16+ 
- npm lub yarn

### Instalacja zależności
```bash
cd serwis-app/frontend
npm install
```

### Uruchomienie w trybie deweloperskim
```bash
npm start
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

### Budowanie do produkcji
```bash
npm run build
```

## Struktura Projektu

```
src/
├── components/          # Komponenty wielokrotnego użytku
│   ├── Layout.tsx      # Główny layout z nawigacją
│   ├── LoginForm.tsx   # Formularz logowania
│   └── RepairForm.tsx  # Formularz naprawy
├── contexts/           # Konteksty React
│   └── AuthContext.tsx # Kontekst autoryzacji
├── pages/              # Strony aplikacji
│   ├── Dashboard.tsx   # Strona główna
│   ├── RepairsList.tsx # Lista napraw
│   └── ClientPortal.tsx # Portal klienta
├── services/           # Serwisy API
│   └── api.ts         # Serwis komunikacji z backendem
├── types/              # Definicje typów TypeScript
│   └── index.ts       # Interfejsy danych
├── App.tsx            # Główny komponent aplikacji
├── index.tsx          # Punkt wejścia
└── index.css          # Style globalne
```

## Routing

### Trasy Publiczne
- `/login` - Logowanie serwisanta
- `/client` - Portal klienta

### Trasy Chronione (wymagają logowania)
- `/dashboard` - Panel główny
- `/repairs` - Lista napraw
- `/repairs/new` - Nowa naprawa
- `/repairs/:id/edit` - Edycja naprawy

## API Integration

Aplikacja komunikuje się z backendem FastAPI przez:
- **Base URL**: `http://localhost:8000/api`
- **Autoryzacja**: JWT Bearer Token
- **Proxy**: Skonfigurowany w `package.json`

### Endpointy
- `POST /auth/login` - Logowanie
- `GET /auth/me` - Dane użytkownika
- `GET /repairs` - Lista napraw
- `POST /repairs` - Nowa naprawa
- `PUT /repairs/:id` - Aktualizacja naprawy
- `GET /repairs/code/:code` - Naprawa po kodzie
- `GET /stats` - Statystyki

## Stylowanie

Aplikacja używa Tailwind CSS z customowymi kolorami:
- **Primary**: Niebieski (#3b82f6)
- **Success**: Zielony (#22c55e)
- **Warning**: Żółty (#f59e0b)
- **Danger**: Czerwony (#ef4444)

## Komponenty

### Layout
Responsywny layout z boczną nawigacją i górnym paskiem.

### Formularze
- Walidacja po stronie klienta
- Obsługa błędów API
- Loading states
- Responsywny design

### Tabele
- Sortowanie i filtrowanie
- Paginacja
- Akcje inline
- Responsywny design

## Bezpieczeństwo

- **Autoryzacja**: JWT Token w localStorage
- **Chronione trasy**: Automatyczne przekierowanie do logowania
- **Interceptory**: Automatyczne dodawanie tokenu do żądań
- **Wylogowanie**: Czyszczenie tokenu przy błędzie 401

## Deployment

### Docker
```bash
# Budowanie obrazu
docker build -t serwis-frontend .

# Uruchomienie kontenera
docker run -p 3000:3000 serwis-frontend
```

### Nginx
Przykładowa konfiguracja dla Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/serwis-frontend/build;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Rozwój

### Dodawanie nowych funkcjonalności
1. Utwórz komponenty w `src/components/`
2. Dodaj strony w `src/pages/`
3. Zaktualizuj routing w `App.tsx`
4. Dodaj typy w `src/types/index.ts`
5. Zaktualizuj API service jeśli potrzeba

### Konwencje kodowania
- **Komponenty**: PascalCase (np. `RepairForm.tsx`)
- **Pliki**: camelCase (np. `apiService.ts`)
- **Typy**: PascalCase (np. `Repair`, `User`)
- **Funkcje**: camelCase (np. `handleSubmit`, `fetchRepairs`)

## Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Upewnij się, że backend jest uruchomiony
3. Sprawdź połączenie z API
4. Zweryfikuj token autoryzacji 