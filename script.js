// Obsługa formularza kontaktowego
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Pobierz dane z formularza
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            const consent = formData.get('consent');
            
            // Walidacja
            if (!validateForm(name, email, message, consent)) {
                return;
            }
            
            // Symulacja wysłania formularza
            showLoadingState();
            
            setTimeout(() => {
                showSuccessMessage();
                contactForm.reset();
            }, 2000);
        });
    }
    
    // Walidacja formularza
    function validateForm(name, email, message, consent) {
        let isValid = true;
        
        // Walidacja imienia
        if (!name || name.trim().length < 2) {
            showError('name', 'Imię i nazwisko musi mieć co najmniej 2 znaki');
            isValid = false;
        } else {
            clearError('name');
        }
        
        // Walidacja email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showError('email', 'Podaj poprawny adres e-mail');
            isValid = false;
        } else {
            clearError('email');
        }
        
        // Walidacja wiadomości
        if (!message || message.trim().length < 10) {
            showError('message', 'Wiadomość musi mieć co najmniej 10 znaków');
            isValid = false;
        } else {
            clearError('message');
        }
        
        // Walidacja zgody
        if (!consent) {
            showError('consent', 'Musisz wyrazić zgodę na przetwarzanie danych');
            isValid = false;
        } else {
            clearError('consent');
        }
        
        return isValid;
    }
    
    // Pokazanie błędu
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.getElementById(fieldName + '-error') || createErrorElement(fieldName);
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        field.style.borderColor = '#dc3545';
    }
    
    // Usunięcie błędu
    function clearError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.getElementById(fieldName + '-error');
        
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        field.style.borderColor = '#e9ecef';
    }
    
    // Tworzenie elementu błędu
    function createErrorElement(fieldName) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.createElement('div');
        errorDiv.id = fieldName + '-error';
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.display = 'none';
        
        field.parentNode.appendChild(errorDiv);
        return errorDiv;
    }
    
    // Pokazanie stanu ładowania
    function showLoadingState() {
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Wysyłanie...';
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#6c757d';
    }
    
    // Pokazanie komunikatu sukcesu
    function showSuccessMessage() {
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Wysłano!';
        submitBtn.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            submitBtn.textContent = 'Wyślij wiadomość';
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '#7DC42C';
        }, 3000);
    }
});

// Płynne przewijanie do sekcji
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Animacje przy przewijaniu
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Obserwuj elementy do animacji
    const animatedElements = document.querySelectorAll('.faq-item, .document-card, .service-card, .stat-item, .feature-item');
    animatedElements.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        }
    });
});

// Walidacja w czasie rzeczywistym
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    showFieldError(field, 'Imię i nazwisko musi mieć co najmniej 2 znaki');
                } else {
                    clearFieldError(field);
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(field, 'Podaj poprawny adres e-mail');
                } else {
                    clearFieldError(field);
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    showFieldError(field, 'Wiadomość musi mieć co najmniej 10 znaków');
                } else {
                    clearFieldError(field);
                }
                break;
        }
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#dc3545';
        
        let errorDiv = field.parentNode.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#dc3545';
            errorDiv.style.fontSize = '0.9rem';
            errorDiv.style.marginTop = '5px';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '#e9ecef';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
});

// Dodatkowe funkcje UX
document.addEventListener('DOMContentLoaded', function() {
    // Licznik znaków dla wiadomości
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.fontSize = '0.8rem';
        charCounter.style.color = '#666';
        charCounter.style.textAlign = 'right';
        charCounter.style.marginTop = '5px';
        messageTextarea.parentNode.appendChild(charCounter);
        
        function updateCharCounter() {
            const length = messageTextarea.value.length;
            const maxLength = 1000;
            charCounter.textContent = `${length} / ${maxLength} znaków`;
            
            if (length > maxLength * 0.9) {
                charCounter.style.color = '#dc3545';
            } else {
                charCounter.style.color = '#666';
            }
        }
        
        messageTextarea.addEventListener('input', updateCharCounter);
        updateCharCounter();
    }
    
    // Automatyczne formatowanie numeru telefonu
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.startsWith('48')) {
                    value = value.substring(2);
                }
                
                if (value.length <= 3) {
                    value = `+48 ${value}`;
                } else if (value.length <= 6) {
                    value = `+48 ${value.substring(0, 3)} ${value.substring(3)}`;
                } else if (value.length <= 9) {
                    value = `+48 ${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6)}`;
                } else {
                    value = `+48 ${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 9)}`;
                }
            }
            
            e.target.value = value;
        });
    }
});

// Obsługa responsywnego menu
// Usunięto kod chowający nagłówek przy scrollu, menu jest zawsze sticky 
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        // Zamknij menu po kliknięciu w link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
}); 