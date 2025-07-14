import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from app import config
import os

def send_protocol_email(client_email: str, client_name: str, repair_code: str, pdf_data: bytes, filename: str = "protokol_naprawy.pdf"):
    """
    Wysyła protokół naprawy na email klienta
    """
    if not client_email:
        return False
    
    try:
        # Tworzenie wiadomości
        msg = MIMEMultipart()
        msg['From'] = config.FROM_EMAIL
        msg['To'] = client_email
        msg['Subject'] = f"Protokół przyjęcia sprzętu - {repair_code}"
        
        # Treść wiadomości
        body = f"""
        Szanowny/a {client_name},
        
        W załączniku znajduje się protokół przyjęcia sprzętu do serwisu.
        Kod naprawy: {repair_code}
        
        Status naprawy można sprawdzić pod adresem:
        http://localhost:3000/client
        
        Pozdrawiamy,
        Zespół Serwisu
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Załącznik PDF
        attachment = MIMEBase('application', 'octet-stream')
        attachment.set_payload(pdf_data)
        encoders.encode_base64(attachment)
        attachment.add_header('Content-Disposition', f'attachment; filename= {filename}')
        msg.attach(attachment)
        
        # Wysyłanie - dostosowane dla MailHog
        server = smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT)
        
        # MailHog nie wymaga TLS ani uwierzytelniania
        if config.SMTP_USER and config.SMTP_PASSWORD:
            server.starttls()
            server.login(config.SMTP_USER, config.SMTP_PASSWORD)
        
        text = msg.as_string()
        server.sendmail(config.FROM_EMAIL, client_email, text)
        server.quit()
        
        return True
        
    except Exception as e:
        print(f"Błąd wysyłania email: {e}")
        return False

def send_status_notification(client_email: str, client_name: str, repair_code: str, status: str):
    """
    Wysyła powiadomienie o zmianie statusu naprawy
    """
    if not client_email:
        return False
    
    try:
        msg = MIMEMultipart()
        msg['From'] = config.FROM_EMAIL
        msg['To'] = client_email
        msg['Subject'] = f"Status naprawy {repair_code} - {status}"
        
        status_text = {
            'przyjęte': 'urządzenie zostało przyjęte do serwisu',
            'w naprawie': 'urządzenie jest w trakcie naprawy',
            'gotowe': 'naprawa została zakończona - urządzenie gotowe do odbioru',
            'odebrane': 'urządzenie zostało odebrane',
            'anulowane': 'naprawa została anulowana'
        }.get(status, status)
        
        body = f"""
        Szanowny/a {client_name},
        
        Status naprawy o kodzie {repair_code} został zmieniony na: {status}
        
        {status_text}
        
        Status naprawy można sprawdzić pod adresem:
        http://localhost:3000/client
        
        Pozdrawiamy,
        Zespół Serwisu
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Wysyłanie - dostosowane dla MailHog
        server = smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT)
        
        # MailHog nie wymaga TLS ani uwierzytelniania
        if config.SMTP_USER and config.SMTP_PASSWORD:
            server.starttls()
            server.login(config.SMTP_USER, config.SMTP_PASSWORD)
        
        text = msg.as_string()
        server.sendmail(config.FROM_EMAIL, client_email, text)
        server.quit()
        
        return True
        
    except Exception as e:
        print(f"Błąd wysyłania powiadomienia: {e}")
        return False 