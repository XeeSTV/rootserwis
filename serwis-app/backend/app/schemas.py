from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    role: Optional[str] = "serwisant"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(UserBase):
    id: int
    signature: Optional[str] = None
    class Config:
        orm_mode = True

class UserSignatureUpdate(BaseModel):
    signature: str

class ClientBase(BaseModel):
    name: str
    company: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientOut(ClientBase):
    id: int
    class Config:
        orm_mode = True

class RepairBase(BaseModel):
    device: str
    description: Optional[str] = None
    status: Optional[str] = "przyjęte"
    price_estimate: Optional[float] = None

class RepairCreate(RepairBase):
    client_id: int

class RepairUpdate(BaseModel):
    device: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    price_estimate: Optional[float] = None

class RepairOut(RepairBase):
    id: int
    client_id: int
    code: str
    created_at: datetime
    updated_at: datetime
    client: Optional[ClientOut] = None
    class Config:
        orm_mode = True

class ProtocolBase(BaseModel):
    device_info: str
    price_estimate: Optional[float] = None
    client_signature: Optional[str] = None

class ProtocolCreate(ProtocolBase):
    client_id: int
    repair_id: int

class ProtocolOut(ProtocolBase):
    id: int
    client_id: int
    repair_id: int
    created_at: datetime
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    username: Optional[str] = None 