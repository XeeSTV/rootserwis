# Konfiguracja MailHog - Serwer Email dla Developmentu

## Problem rozwiązany
Zastąpiliśmy przestarzały obraz Docker `catatnight/postfix` nowoczesnym rozwiązaniem **MailHog**, które eliminuje ostrzeżenie o przestarzałym formacie obrazu Docker.

## Co to jest MailHog?
MailHog to narzędzie do testowania emaili w środowisku development. Zamiast wysyłać prawdziwe emaile, przechwytuje je i wyświetla w interfejsie webowym.

## Korzyści:
- ✅ Nowoczesny obraz Docker (OCI Format)
- ✅ Brak ostrzeżeń o przestarzałych formatach
- ✅ Prosty interfejs webowy do przeglądania emaili
- ✅ Nie wymaga konfiguracji uwierzytelniania
- ✅ Idealne dla developmentu

## Jak używać:

### 1. Uruchom aplikację
```bash
docker-compose up -d
```

### 2. Dostęp do interfejsu MailHog
Otwórz przeglądarkę i przejdź do: **http://localhost:8025**

### 3. Testowanie emaili
- Wszystkie emaile wysłane przez aplikację będą widoczne w interfejsie MailHog
- Możesz przeglądać, otwierać i testować emaile bez wysyłania ich do prawdziwych adresów

## Konfiguracja SMTP:
- **Host:** `mail` (nazwa kontenera)
- **Port:** `1025`
- **Uwierzytelnianie:** Brak (nie wymagane)

## Zmienne środowiskowe:
Możesz nadpisać domyślne ustawienia w pliku `.env`:
```env
SMTP_HOST=mail
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
FROM_EMAIL=serwis@example.com
```

## Produkcja:
Dla środowiska produkcyjnego zalecamy:
1. Użycie prawdziwego serwera SMTP (Gmail, SendGrid, etc.)
2. Skonfigurowanie uwierzytelniania
3. Włączenie TLS/SSL

## Usunięte pliki:
- `scripts/setup-mail.sh` - nie jest już potrzebny z MailHog
- Volume `mail_data` - MailHog przechowuje dane w pamięci

## Rozwiązywanie problemów:
1. **Email nie wysyła się:** Sprawdź czy kontener `serwis-mail` jest uruchomiony
2. **Nie widzę emaili:** Sprawdź interfejs webowy pod adresem http://localhost:8025
3. **Błąd połączenia:** Upewnij się, że backend używa nazwy kontenera `mail` jako hosta SMTP 