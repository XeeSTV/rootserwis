#!/bin/bash

# Skrypt aktualizacji konfiguracji aplikacji serwisowej
# Automatycznie generuje tokeny i klucze, użytkownik wprowadza tylko podstawowe dane

set -e

echo "=========================================="
echo "  AKTUALIZACJA KONFIGURACJI APLIKACJI"
echo "=========================================="
echo ""

# Kolory dla lepszej czytelności
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Sprawdzenie czy jesteśmy w odpowiednim katalogu
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Błąd: Uruchom skrypt z katalogu głównego aplikacji (serwis-app/)${NC}"
    exit 1
fi

# Sprawdzenie czy plik .env istnieje
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}Plik backend/.env nie istnieje! Uruchom instalator: ./scripts/install.sh${NC}"
    exit 1
fi

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

# Funkcja do generowania losowego sekretu JWT
generate_jwt_secret() {
    openssl rand -hex 32
}

# Wczytanie obecnej konfiguracji
source backend/.env

echo -e "${BLUE}Obecna konfiguracja:${NC}"
echo "=========================================="
echo -e "Backend: ${GREEN}$API_URL${NC}"
echo -e "Frontend: ${GREEN}$APP_URL${NC}"
echo -e "Konto email: ${GREEN}$SMTP_USER@$APP_DOMAIN${NC}"
echo -e "Administrator: ${GREEN}$ADMIN_USERNAME${NC}"
echo "=========================================="
echo ""

echo -e "${YELLOW}Wybierz co chcesz zaktualizować:${NC}"
echo "1. Konfiguracja email"
echo "2. Konfiguracja administratora"
echo "3. Konfiguracja sieci"
echo "4. Wygeneruj nowy sekret JWT"
echo "5. Wszystko (pełna rekonfiguracja)"
echo "6. Anuluj"
echo ""

read -p "Wybierz opcję (1-6): " OPTION

case $OPTION in
    1)
        echo ""
        echo -e "${BLUE}Aktualizacja konfiguracji email:${NC}"
        echo ""
        
        read -p "Domena email [$APP_DOMAIN]: " NEW_APP_DOMAIN
        NEW_APP_DOMAIN=${NEW_APP_DOMAIN:-$APP_DOMAIN}
        
        read -p "Nazwa użytkownika email [$SMTP_USER]: " NEW_SMTP_USER
        NEW_SMTP_USER=${NEW_SMTP_USER:-$SMTP_USER}
        
        read -s -p "Nowe hasło do konta email (pozostaw puste aby nie zmieniać): " NEW_SMTP_PASSWORD
        echo ""
        if [ -n "$NEW_SMTP_PASSWORD" ]; then
            read -s -p "Potwierdź nowe hasło do konta email: " NEW_SMTP_PASSWORD_CONFIRM
            echo ""
            if [ "$NEW_SMTP_PASSWORD" != "$NEW_SMTP_PASSWORD_CONFIRM" ]; then
                echo -e "${RED}Hasła nie są identyczne!${NC}"
                exit 1
            fi
            SMTP_PASSWORD=$NEW_SMTP_PASSWORD
        fi
        
        # Aktualizacja zmiennych
        APP_DOMAIN=$NEW_APP_DOMAIN
        SMTP_USER=$NEW_SMTP_USER
        FROM_EMAIL="$SMTP_USER@$APP_DOMAIN"
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}Aktualizacja konfiguracji administratora:${NC}"
        echo ""
        
        read -p "Nazwa użytkownika administratora [$ADMIN_USERNAME]: " NEW_ADMIN_USERNAME
        NEW_ADMIN_USERNAME=${NEW_ADMIN_USERNAME:-$ADMIN_USERNAME}
        
        read -s -p "Nowe hasło administratora (min. 8 znaków, pozostaw puste aby nie zmieniać): " NEW_ADMIN_PASSWORD
        echo ""
        if [ -n "$NEW_ADMIN_PASSWORD" ]; then
            if [ ${#NEW_ADMIN_PASSWORD} -lt 8 ]; then
                echo -e "${RED}Hasło musi mieć co najmniej 8 znaków!${NC}"
                exit 1
            fi
            read -s -p "Potwierdź nowe hasło administratora: " NEW_ADMIN_PASSWORD_CONFIRM
            echo ""
            if [ "$NEW_ADMIN_PASSWORD" != "$NEW_ADMIN_PASSWORD_CONFIRM" ]; then
                echo -e "${RED}Hasła nie są identyczne!${NC}"
                exit 1
            fi
            ADMIN_PASSWORD=$NEW_ADMIN_PASSWORD
        fi
        
        # Aktualizacja zmiennych
        ADMIN_USERNAME=$NEW_ADMIN_USERNAME
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}Aktualizacja konfiguracji sieci:${NC}"
        echo ""
        
        # Wyciągnięcie IP z obecnego URL
        CURRENT_IP=$(echo $APP_URL | sed 's|http://||' | sed 's|:.*||')
        CURRENT_FRONTEND_PORT=$(echo $APP_URL | sed 's|.*:||' | sed 's|/.*||')
        CURRENT_BACKEND_PORT=$(echo $API_URL | sed 's|.*:||' | sed 's|/.*||')
        
        read -p "Adres IP serwera [$CURRENT_IP]: " NEW_SERVER_IP
        NEW_SERVER_IP=${NEW_SERVER_IP:-$CURRENT_IP}
        
        read -p "Port frontendu [$CURRENT_FRONTEND_PORT]: " NEW_FRONTEND_PORT
        NEW_FRONTEND_PORT=${NEW_FRONTEND_PORT:-$CURRENT_FRONTEND_PORT}
        
        read -p "Port backendu [$CURRENT_BACKEND_PORT]: " NEW_BACKEND_PORT
        NEW_BACKEND_PORT=${NEW_BACKEND_PORT:-$CURRENT_BACKEND_PORT}
        
        # Aktualizacja URL-i
        APP_URL="http://$NEW_SERVER_IP:$NEW_FRONTEND_PORT"
        API_URL="http://$NEW_SERVER_IP:$NEW_BACKEND_PORT"
        ;;
        
    4)
        echo ""
        echo -e "${BLUE}Generowanie nowego sekretu JWT...${NC}"
        echo ""
        
        echo -e "${YELLOW}Uwaga: Wygenerowanie nowego sekretu JWT spowoduje wylogowanie wszystkich użytkowników!${NC}"
        read -p "Czy na pewno chcesz wygenerować nowy sekret JWT? (t/n): " CONFIRM_JWT
        if [[ $CONFIRM_JWT =~ ^[Tt]$ ]]; then
            SECRET_KEY=$(generate_jwt_secret)
            echo -e "${GREEN}Nowy sekret JWT został wygenerowany!${NC}"
        else
            echo -e "${YELLOW}Generowanie sekretu JWT zostało anulowane.${NC}"
            exit 0
        fi
        ;;
        
    5)
        echo ""
        echo -e "${YELLOW}Uruchamiam pełną rekonfigurację...${NC}"
        chmod +x ./scripts/install.sh
        ./scripts/install.sh
        exit 0
        ;;
        
    6)
        echo -e "${YELLOW}Aktualizacja została anulowana.${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Nieprawidłowa opcja!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}Nowa konfiguracja:${NC}"
echo "=========================================="
echo -e "Backend: ${GREEN}$API_URL${NC}"
echo -e "Frontend: ${GREEN}$APP_URL${NC}"
echo -e "Konto email: ${GREEN}$SMTP_USER@$APP_DOMAIN${NC}"
echo -e "Administrator: ${GREEN}$ADMIN_USERNAME${NC}"
echo "=========================================="
echo ""

read -p "Czy chcesz zastosować te zmiany? (t/n): " CONFIRM
if [[ ! $CONFIRM =~ ^[Tt]$ ]]; then
    echo -e "${YELLOW}Aktualizacja została anulowana.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Aktualizowanie pliku backend/.env...${NC}"

# Generowanie nowego pliku .env
cat > backend/.env << EOF
# Konfiguracja bazy danych
DATABASE_URL=$DATABASE_URL

# Konfiguracja JWT (automatycznie wygenerowane)
SECRET_KEY=$SECRET_KEY
ALGORITHM=$ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES=$ACCESS_TOKEN_EXPIRE_MINUTES

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
APP_NAME=$APP_NAME
APP_URL=$APP_URL
API_URL=$API_URL

# Zmienne dla Docker Compose
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
APP_DOMAIN=$APP_DOMAIN
EOF

echo -e "${GREEN}Plik backend/.env został zaktualizowany!${NC}"

# Sprawdzenie czy aplikacja jest uruchomiona
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo -e "${YELLOW}Aplikacja jest uruchomiona. Czy chcesz ją zrestartować? (t/n): ${NC}"
    read -p "" RESTART_APP
    if [[ $RESTART_APP =~ ^[Tt]$ ]]; then
        echo -e "${BLUE}Restartowanie aplikacji...${NC}"
        docker-compose down
        docker-compose up -d
        echo -e "${GREEN}Aplikacja została zrestartowana!${NC}"
    else
        echo -e "${YELLOW}Pamiętaj o zrestartowaniu aplikacji, aby zmiany zostały zastosowane.${NC}"
    fi
else
    echo -e "${YELLOW}Aplikacja nie jest uruchomiona. Uruchom ją komendą: docker-compose up -d${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "  KONFIGURACJA ZOSTAŁA ZAKTUALIZOWANA!"
echo "=========================================="
echo ""
echo -e "Aplikacja będzie dostępna pod adresami:${NC}"
echo -e "${GREEN}Frontend: $APP_URL${NC}"
echo -e "${GREEN}Backend API: $API_URL${NC}"
echo -e "${GREEN}API Dokumentacja: $API_URL/docs${NC}"
echo -e "${GREEN}Portal klienta: $APP_URL/client${NC}"
echo ""
echo -e "${BLUE}Dane konta email:${NC}"
echo -e "Email: ${GREEN}$SMTP_USER@$APP_DOMAIN${NC}"
echo -e "Serwer SMTP: ${GREEN}$SMTP_HOST:$SMTP_PORT${NC}"
echo ""
echo -e "${GREEN}==========================================" 