# ROOT - Serwis Komputerowy

Strona internetowa serwisu komputerowego ROOT, stworzona na wzór www.serwisroot.pl.

## 🚀 Funkcjonalności

- **Responsywny design** - strona działa na wszystkich urządzeniach
- **Formularz kontaktowy** - z walidacją i obsługą JavaScript
- **Sekcja FAQ** - najczęściej zadawane pytania
- **Dokumenty** - regulamin i polityka prywatności
- **Mapa Google** - lokalizacja serwisu
- **Ikony social media** - linki do Facebook i Instagram
- **Animacje** - płynne przejścia i efekty

## 📁 Struktura plików

```
serwisroot/
├── index.html              # Strona główna
├── regulamin.html          # Regulamin serwisu
├── polityka-prywatnosci.html # Polityka prywatności
├── styles.css              # Style CSS
├── script.js               # JavaScript
└── README.md               # Ten plik
```

## 🛠️ Technologie

- **HTML5** - struktura strony
- **CSS3** - style i responsywność
- **JavaScript** - interaktywność i walidacja
- **Font Awesome** - ikony
- **Google Fonts** - czcionka Roboto
- **Google Maps** - mapa lokalizacji

## 🎨 Design

Strona wykorzystuje:
- **Kolory firmowe**: zielony (#7DC42C) i szary (#333)
- **Nowoczesny design** z cieniami i zaokrąglonymi rogami
- **Responsywny layout** z CSS Grid i Flexbox
- **Animacje** przy przewijaniu i hover efektach

## 📱 Responsywność

Strona jest w pełni responsywna i dostosowuje się do:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (do 767px)

## 🚀 Jak uruchomić

1. **Pobierz pliki** do lokalnego katalogu
2. **Otwórz index.html** w przeglądarce internetowej
3. **Lub uruchom lokalny serwer**:
   ```bash
   # Używając Python
   python -m http.server 8000
   
   # Używając Node.js
   npx serve .
   
   # Używając PHP
   php -S localhost:8000
   ```

## 📋 Funkcjonalności formularza

Formularz kontaktowy zawiera:
- ✅ **Walidację w czasie rzeczywistym**
- ✅ **Automatyczne formatowanie numeru telefonu**
- ✅ **Licznik znaków dla wiadomości**
- ✅ **Obsługa błędów**
- ✅ **Symulacja wysyłania**
- ✅ **Komunikaty sukcesu**

## 🔧 Dostosowanie

### Zmiana danych kontaktowych
Edytuj plik `index.html` i zmień:
- Numer telefonu
- Adres email
- Godziny otwarcia
- Dane firmowe

### Zmiana kolorów
W pliku `styles.css` znajdź i zmień:
```css
:root {
    --primary-color: #7DC42C;    /* Główny kolor */
    --secondary-color: #6bb025;  /* Kolor hover */
    --text-color: #333;          /* Kolor tekstu */
}
```

### Dodanie nowych sekcji
1. Dodaj sekcję w `index.html`
2. Dodaj style w `styles.css`
3. Dodaj link w nawigacji

## 📞 Kontakt

**ROOT - Serwis Komputerowy**
- **Telefon**: (48) 694-504-789
- **Email**: kontakt@serwisroot.pl
- **Godziny otwarcia**: 
  - PON-PT: 09:00 - 20:00
  - SOB-NIEDZ: 12:00 - 19:00

## 📄 Licencja

Ten projekt jest stworzony na potrzeby edukacyjne i demonstracyjne.

## 🔄 Aktualizacje

- **v1.0** - Pierwsza wersja strony
- Responsywny design
- Formularz kontaktowy z walidacją
- Sekcje FAQ i dokumenty
- Integracja z Google Maps

---

**Uwaga**: Ta strona jest kopią designu www.serwisroot.pl stworzoną w celach edukacyjnych. Wszystkie prawa do oryginalnej strony należą do jej właścicieli. 