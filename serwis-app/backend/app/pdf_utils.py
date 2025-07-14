from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import io, base64

def generate_protocol_pdf(client, repair, protocol, client_signature_b64, service_signature_b64):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "Protokół przyjęcia sprzętu do serwisu")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 90, f"Klient: {client.name} ({client.company or ''})")
    c.drawString(50, height - 110, f"E-mail: {client.email or ''}  Telefon: {client.phone or ''}")
    c.drawString(50, height - 140, f"Sprzęt: {repair.device}")
    c.drawString(50, height - 160, f"Opis: {repair.description or ''}")
    c.drawString(50, height - 180, f"Przybliżona cena naprawy: {protocol.price_estimate or ''} zł")
    c.drawString(50, height - 210, f"Data przyjęcia: {repair.created_at.strftime('%Y-%m-%d %H:%M')}")
    c.drawString(50, height - 250, "Podpis klienta:")
    if client_signature_b64:
        imgdata = base64.b64decode(client_signature_b64.split(',')[-1])
        c.drawImage(ImageReader(io.BytesIO(imgdata)), 50, height - 350, width=200, height=60, mask='auto')
    c.drawString(300, height - 250, "Podpis serwisanta:")
    if service_signature_b64:
        imgdata2 = base64.b64decode(service_signature_b64.split(',')[-1])
        c.drawImage(ImageReader(io.BytesIO(imgdata2)), 300, height - 350, width=200, height=60, mask='auto')
    c.showPage()
    c.save()
    pdf = buffer.getvalue()
    buffer.close()
    return pdf 