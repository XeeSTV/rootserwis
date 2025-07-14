import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")
SECRET_KEY = os.getenv("SECRET_KEY", "supersekretnyklucz")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# Konfiguracja SMTP dla MailHog (development)
SMTP_HOST = os.getenv("SMTP_HOST", "mail")  # Nazwa kontenera MailHog
SMTP_PORT = int(os.getenv("SMTP_PORT", 1025))  # Port SMTP MailHog
SMTP_USER = os.getenv("SMTP_USER", "")  # MailHog nie wymaga uwierzytelniania
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")  # MailHog nie wymaga uwierzytelniania
FROM_EMAIL = os.getenv("FROM_EMAIL", "serwis@example.com") 