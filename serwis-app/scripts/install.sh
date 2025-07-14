#!/bin/bash

# Skrypt instalacyjny dla aplikacji serwisowej
# Automatycznie tworzy bazę danych, konto administratora i serwer email

set -e

echo "=========================================="
echo "  INSTALATOR APLIKACJI SERWISOWEJ"
echo "=========================================="
echo ""

# Kolory dla lepszej czytelności
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcja do walidacji adresu email
validate_email() {
    local email=$1
    if [[ $email =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Funkcja do walidacji portu
validate_port() {
    local port=$1
    if [[ $port =~ ^[0-9]+$ ]] && [ $port -ge 1 ] && [ $port -le 65535 ]; then
        return 0
    else
        return 1
    fi
}

# Funkcja do walidacji IP
validate_ip() {
    local ip=$1
    if [[ $ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
        IFS='.' read -r -a ip_parts <<< "$ip"
        for part in "${ip_parts[@]}"; do
            if [ "$part" -lt 0 ] || [ "$part" -gt 255 ]; then
                return 1
            fi
        done
        return 0
    else
        return 1
    fi
}

# Funkcja do generowania losowego sekretu JWT
generate_jwt_secret() {
    openssl rand -hex 32
}

# Funkcja do generowania losowego klucza bazy danych
generate_db_key() {
    openssl rand -hex 16
}

echo -e "${BLUE}Konfiguracja bazy danych PostgreSQL:${NC}"
echo ""

# Baza danych - tylko podstawowe dane
read -p "Nazwa bazy danych [serwis]: " DB_NAME
DB_NAME=${DB_NAME:-serwis}

read -p "Nazwa użytkownika bazy danych [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

while true; do
    read -s -p "Hasło do bazy danych: " DB_PASSWORD
    echo ""
    if [ -z "$DB_PASSWORD" ]; then
        echo -e "${RED}Hasło nie może być puste!${NC}"
        continue
    fi
    read -s -p "Potwierdź hasło do bazy danych: " DB_PASSWORD_CONFIRM
    echo ""
    if [ "$DB_PASSWORD" = "$DB_PASSWORD_CONFIRM" ]; then
        break
    else
        echo -e "${RED}Hasła nie są identyczne!${NC}"
    fi
done

echo ""
echo -e "${BLUE}Konfiguracja aplikacji:${NC}"
echo ""

# Automatyczne generowanie sekretów i kluczy
echo -e "${YELLOW}Generowanie bezpiecznych kluczy i tokenów...${NC}"
JWT_SECRET=$(generate_jwt_secret)
JWT_EXPIRE_MINUTES=30
BACKEND_PORT=8000
FRONTEND_PORT=3000
DB_PORT=5432

echo -e "${GREEN}✓ Sekret JWT wygenerowany${NC}"
echo -e "${GREEN}✓ Czas ważności tokenu: 30 minut${NC}"
echo -e "${GREEN}✓ Porty skonfigurowane: Backend 8000, Frontend 3000, DB 5432${NC}"

echo ""
echo -e "${BLUE}Konfiguracja serwera email:${NC}"
echo ""

read -p "Domena email (np. serwis.local): " APP_DOMAIN
while [ -z "$APP_DOMAIN" ]; do
    echo -e "${RED}Domena email jest wymagana!${NC}"
    read -p "Domena email (np. serwis.local): " APP_DOMAIN
done

read -p "Nazwa użytkownika email [serwis]: " SMTP_USER
SMTP_USER=${SMTP_USER:-serwis}

while true; do
    read -s -p "Hasło do konta email: " SMTP_PASSWORD
    echo ""
    if [ -z "$SMTP_PASSWORD" ]; then
        echo -e "${RED}Hasło nie może być puste!${NC}"
        continue
    fi
    read -s -p "Potwierdź hasło do konta email: " SMTP_PASSWORD_CONFIRM
    echo ""
    if [ "$SMTP_PASSWORD" = "$SMTP_PASSWORD_CONFIRM" ]; then
        break
    else
        echo -e "${RED}Hasła nie są identyczne!${NC}"
    fi
done

# Automatyczna konfiguracja SMTP dla lokalnego serwera
SMTP_HOST="mail"
SMTP_PORT=587
FROM_EMAIL="$SMTP_USER@$APP_DOMAIN"

echo -e "${GREEN}✓ Konto email: $SMTP_USER@$APP_DOMAIN${NC}"
echo -e "${GREEN}✓ Serwer SMTP: $SMTP_HOST:$SMTP_PORT${NC}"

echo ""
echo -e "${BLUE}Konfiguracja administratora aplikacji:${NC}"
echo ""

read -p "Nazwa użytkownika administratora [admin]: " ADMIN_USERNAME
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}

while true; do
    read -s -p "Hasło administratora (min. 8 znaków): " ADMIN_PASSWORD
    echo ""
    if [ ${#ADMIN_PASSWORD} -lt 8 ]; then
        echo -e "${RED}Hasło musi mieć co najmniej 8 znaków!${NC}"
        continue
    fi
    read -s -p "Potwierdź hasło administratora: " ADMIN_PASSWORD_CONFIRM
    echo ""
    if [ "$ADMIN_PASSWORD" = "$ADMIN_PASSWORD_CONFIRM" ]; then
        break
    else
        echo -e "${RED}Hasła nie są identyczne!${NC}"
    fi
done

echo ""
echo -e "${BLUE}Konfiguracja sieci:${NC}"
echo ""

read -p "Adres IP serwera [localhost]: " SERVER_IP
SERVER_IP=${SERVER_IP:-localhost}

echo ""
echo -e "${BLUE}Podsumowanie konfiguracji:${NC}"
echo "=========================================="
echo -e "Baza danych: ${GREEN}$DB_NAME${NC} na porcie ${GREEN}$DB_PORT${NC}"
echo -e "Backend: ${GREEN}http://$SERVER_IP:$BACKEND_PORT${NC}"
echo -e "Frontend: ${GREEN}http://$SERVER_IP:$FRONTEND_PORT${NC}"
echo -e "Domena: ${GREEN}$APP_DOMAIN${NC}"
echo -e "Konto email: ${GREEN}$SMTP_USER@$APP_DOMAIN${NC}"
echo -e "Administrator: ${GREEN}$ADMIN_USERNAME${NC}"
echo ""
echo -e "${YELLOW}Automatycznie utworzone/wygenerowane:${NC}"
echo -e "✓ Sekret JWT (64 znaki)"
echo -e "✓ Tabele bazy danych"
echo -e "✓ Konto administratora w DB"
echo -e "✓ Serwer email (Postfix)"
echo -e "✓ Konto email"
echo -e "✓ Porty aplikacji"
echo "=========================================="
echo ""

read -p "Czy chcesz kontynuować instalację? (t/n): " CONFIRM
if [[ ! $CONFIRM =~ ^[Tt]$ ]]; then
    echo -e "${YELLOW}Instalacja została anulowana.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Generowanie pliku .env...${NC}"

# Generowanie pliku .env w backend
mkdir -p backend
cat > backend/.env << EOF
# Konfiguracja bazy danych
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@db:5432/$DB_NAME

# Konfiguracja JWT (automatycznie wygenerowane)
SECRET_KEY=$JWT_SECRET
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=$JWT_EXPIRE_MINUTES

# Konfiguracja SMTP (lokalny serwer)
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER
SMTP_PASSWORD=$SMTP_PASSWORD
FROM_EMAIL=$FROM_EMAIL

# Konfiguracja administratora
ADMIN_USERNAME=$ADMIN_USERNAME
ADMIN_PASSWORD=$ADMIN_PASSWORD

# Konfiguracja aplikacji
APP_NAME=Serwis Komputerowy
APP_URL=http://$SERVER_IP:$FRONTEND_PORT
API_URL=http://$SERVER_IP:$BACKEND_PORT

# Zmienne dla Docker Compose
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
APP_DOMAIN=$APP_DOMAIN
EOF

echo -e "${GREEN}Plik backend/.env został utworzony pomyślnie!${NC}"

# Sprawdzenie czy Docker jest zainstalowany
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker nie jest zainstalowany! Zainstaluj Docker przed kontynuacją.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose nie jest zainstalowany! Zainstaluj Docker Compose przed kontynuacją.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Budowanie i uruchamianie aplikacji...${NC}"

# Uruchomienie aplikacji
docker-compose up -d --build

# Czekanie na uruchomienie bazy danych
echo -e "${YELLOW}Czekanie na uruchomienie bazy danych...${NC}"
sleep 15

# Czekanie na uruchomienie serwera email
echo -e "${YELLOW}Czekanie na uruchomienie serwera email...${NC}"
sleep 10

# Sprawdzenie statusu kontenerów
echo ""
echo -e "${BLUE}Status kontenerów:${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}=========================================="
echo "  INSTALACJA ZAKOŃCZONA POMYŚLNIE!"
echo "=========================================="
echo ""
echo -e "Aplikacja jest dostępna pod adresami:${NC}"
echo -e "${GREEN}Frontend: http://$SERVER_IP:$FRONTEND_PORT${NC}"
echo -e "${GREEN}Backend API: http://$SERVER_IP:$BACKEND_PORT${NC}"
echo -e "${GREEN}API Dokumentacja: http://$SERVER_IP:$BACKEND_PORT/docs${NC}"
echo -e "${GREEN}Portal klienta: http://$SERVER_IP:$FRONTEND_PORT/client${NC}"
echo ""
echo -e "${BLUE}Dane logowania administratora:${NC}"
echo -e "Nazwa użytkownika: ${GREEN}$ADMIN_USERNAME${NC}"
echo -e "Hasło: ${GREEN}[wprowadzone podczas instalacji]${NC}"
echo ""
echo -e "${BLUE}Dane konta email:${NC}"
echo -e "Email: ${GREEN}$SMTP_USER@$APP_DOMAIN${NC}"
echo -e "Hasło: ${GREEN}[wprowadzone podczas instalacji]${NC}"
echo -e "Serwer SMTP: ${GREEN}$SMTP_HOST:$SMTP_PORT${NC}"
echo ""
echo -e "${YELLOW}Automatycznie utworzone:${NC}"
echo -e "✓ Baza danych PostgreSQL z tabelami"
echo -e "✓ Konto administratora w aplikacji"
echo -e "✓ Serwer email Postfix"
echo -e "✓ Konto email $SMTP_USER@$APP_DOMAIN"
echo -e "✓ Sekret JWT (64 znaki - bezpieczny)"
echo -e "✓ Tokeny sesji (generowane podczas logowania)"
echo ""
echo -e "${YELLOW}Przydatne komendy:${NC}"
echo -e "  Zatrzymanie: ${GREEN}docker-compose down${NC}"
echo -e "  Aktualizacja konfiguracji: ${GREEN}./scripts/update-config.sh${NC}"
echo -e "  Logi: ${GREEN}docker-compose logs -f${NC}"
echo -e "  Restart: ${GREEN}docker-compose restart${NC}"
echo -e "  Status: ${GREEN}docker-compose ps${NC}"
echo ""
echo -e "${GREEN}==========================================" 