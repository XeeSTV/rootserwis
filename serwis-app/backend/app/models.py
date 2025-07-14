from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Text
from sqlalchemy.orm import relationship, declarative_base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="serwisant")
    email = Column(String, unique=True, index=True, nullable=True)
    signature = Column(Text, nullable=True)  # base64 SVG/png podpis serwisanta

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    company = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    repairs = relationship("Repair", back_populates="client")

class Repair(Base):
    __tablename__ = "repairs"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    device = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="przyjęte")
    price_estimate = Column(Float, nullable=True)
    code = Column(String, unique=True, index=True)  # kod do podglądu statusu
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    protocol_id = Column(Integer, ForeignKey("protocols.id"), nullable=True)
    client = relationship("Client", back_populates="repairs")
    protocol = relationship("Protocol", back_populates="repair")

class Protocol(Base):
    __tablename__ = "protocols"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    repair_id = Column(Integer, ForeignKey("repairs.id"))
    device_info = Column(Text, nullable=False)
    price_estimate = Column(Float, nullable=True)
    client_signature = Column(Text, nullable=True)  # base64 SVG/png podpis klienta
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    repair = relationship("Repair", back_populates="protocol") 