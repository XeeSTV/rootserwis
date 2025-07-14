from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app import models, schemas, database, crud, config, pdf_utils, email_service
from typing import List
from fastapi.responses import StreamingResponse
import io
from sqlalchemy import func

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# --- JWT auth ---
def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Nieprawidłowe uwierzytelnienie",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_admin(db)
    if user is None or user.username != username:
        raise credentials_exception
    return user

# --- Klienci ---
@router.post("/clients", response_model=schemas.ClientOut)
def create_client(client: schemas.ClientCreate, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.get("/clients", response_model=List[schemas.ClientOut])
def list_clients(db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    return db.query(models.Client).all()

@router.get("/clients/{client_id}", response_model=schemas.ClientOut)
def get_client(client_id: int, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Nie znaleziono klienta")
    return client

@router.put("/clients/{client_id}", response_model=schemas.ClientOut)
def update_client(client_id: int, client: schemas.ClientCreate, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Nie znaleziono klienta")
    for k, v in client.dict().items():
        setattr(db_client, k, v)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Nie znaleziono klienta")
    db.delete(db_client)
    db.commit()
    return {"ok": True}

# --- Naprawy ---
import random, string, datetime

def generate_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@router.post("/repairs", response_model=schemas.RepairOut)
def create_repair(repair: schemas.RepairCreate, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    code = generate_code()
    db_repair = models.Repair(**repair.dict(), code=code)
    db.add(db_repair)
    db.commit()
    db.refresh(db_repair)
    return db_repair

@router.get("/repairs", response_model=List[schemas.RepairOut])
def list_repairs(db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    return db.query(models.Repair).all()

@router.get("/repairs/{repair_id}", response_model=schemas.RepairOut)
def get_repair(repair_id: int, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    repair = db.query(models.Repair).filter(models.Repair.id == repair_id).first()
    if not repair:
        raise HTTPException(status_code=404, detail="Nie znaleziono naprawy")
    return repair

@router.put("/repairs/{repair_id}", response_model=schemas.RepairOut)
def update_repair(repair_id: int, repair: schemas.RepairCreate, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    db_repair = db.query(models.Repair).filter(models.Repair.id == repair_id).first()
    if not db_repair:
        raise HTTPException(status_code=404, detail="Nie znaleziono naprawy")
    for k, v in repair.dict().items():
        setattr(db_repair, k, v)
    db.commit()
    db.refresh(db_repair)
    return db_repair

@router.delete("/repairs/{repair_id}")
def delete_repair(repair_id: int, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    db_repair = db.query(models.Repair).filter(models.Repair.id == repair_id).first()
    if not db_repair:
        raise HTTPException(status_code=404, detail="Nie znaleziono naprawy")
    db.delete(db_repair)
    db.commit()
    return {"ok": True}

# --- Status naprawy dla klienta (bez autoryzacji) ---
@router.get("/repairs/code/{code}", response_model=schemas.RepairOut)
def get_repair_by_code(code: str, db: Session = Depends(database.get_db)):
    repair = db.query(models.Repair).filter(models.Repair.code == code).first()
    if not repair:
        raise HTTPException(status_code=404, detail="Nie znaleziono naprawy o podanym kodzie")
    return repair

# --- Protokół ---
@router.post("/protocols", response_model=schemas.ProtocolOut)
def create_protocol(protocol: schemas.ProtocolCreate, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    db_protocol = models.Protocol(**protocol.dict())
    db.add(db_protocol)
    db.commit()
    db.refresh(db_protocol)
    return db_protocol

@router.get("/protocols/{protocol_id}", response_model=schemas.ProtocolOut)
def get_protocol(protocol_id: int, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    protocol = db.query(models.Protocol).filter(models.Protocol.id == protocol_id).first()
    if not protocol:
        raise HTTPException(status_code=404, detail="Nie znaleziono protokołu")
    return protocol

@router.get("/protocols/{protocol_id}/pdf")
def generate_protocol_pdf(protocol_id: int, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    """Generuje PDF protokołu i wysyła na email klienta"""
    protocol = db.query(models.Protocol).filter(models.Protocol.id == protocol_id).first()
    if not protocol:
        raise HTTPException(status_code=404, detail="Nie znaleziono protokołu")
    
    # Pobierz dane klienta i naprawy
    client = db.query(models.Client).filter(models.Client.id == protocol.client_id).first()
    repair = db.query(models.Repair).filter(models.Repair.id == protocol.repair_id).first()
    
    if not client or not repair:
        raise HTTPException(status_code=404, detail="Nie znaleziono danych klienta lub naprawy")
    
    # Generuj PDF
    pdf_data = pdf_utils.generate_protocol_pdf(
        client=client,
        repair=repair,
        protocol=protocol,
        client_signature_b64=protocol.client_signature,
        service_signature_b64=user.signature
    )
    
    # Wyślij email jeśli klient ma email
    if client.email:
        email_service.send_protocol_email(
            client_email=client.email,
            client_name=client.name,
            repair_code=repair.code,
            pdf_data=pdf_data
        )
    
    # Zwróć PDF jako response
    return StreamingResponse(
        io.BytesIO(pdf_data),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=protokol_{repair.code}.pdf"}
    )

# --- Ustawienia użytkownika ---
@router.put("/user/signature")
def update_user_signature(signature: str, db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    """Aktualizuje podpis serwisanta"""
    user.signature = signature
    db.commit()
    db.refresh(user)
    return {"message": "Podpis został zaktualizowany"}

@router.get("/user/signature")
def get_user_signature(db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    """Pobiera podpis serwisanta"""
    return {"signature": user.signature}

# --- Statystyki ---
@router.get("/stats")
def get_stats(db: Session = Depends(database.get_db), user=Depends(get_current_admin)):
    """Zwraca statystyki serwisu"""
    total_repairs = db.query(models.Repair).count()
    pending_repairs = db.query(models.Repair).filter(models.Repair.status.in_(["przyjęte", "w naprawie"])).count()
    completed_repairs = db.query(models.Repair).filter(models.Repair.status == "odebrane").count()
    total_clients = db.query(models.Client).count()
    total_protocols = db.query(models.Protocol).count()
    
    # Przychód z tego miesiąca
    current_month = datetime.datetime.now().month
    current_year = datetime.datetime.now().year
    monthly_revenue = db.query(models.Repair).filter(
        models.Repair.created_at >= datetime.datetime(current_year, current_month, 1),
        models.Repair.status == "odebrane"
    ).with_entities(func.sum(models.Repair.price_estimate)).scalar() or 0
    
    return {
        "total_repairs": total_repairs,
        "pending_repairs": pending_repairs,
        "completed_repairs": completed_repairs,
        "total_clients": total_clients,
        "total_protocols": total_protocols,
        "monthly_revenue": monthly_revenue
    } 