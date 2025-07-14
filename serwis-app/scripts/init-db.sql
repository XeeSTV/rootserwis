-- Inicjalizacja bazy danych serwis-app
-- Ten skrypt jest automatycznie uruchamiany przy pierwszym uruchomieniu kontenera PostgreSQL

-- Tworzenie tabel
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repairs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    client_id INTEGER REFERENCES clients(id),
    device_type VARCHAR(100) NOT NULL,
    device_model VARCHAR(100),
    problem_description TEXT,
    status VARCHAR(20) DEFAULT 'przyjęte',
    estimated_cost DECIMAL(10,2),
    final_cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS protocols (
    id SERIAL PRIMARY KEY,
    repair_id INTEGER REFERENCES repairs(id),
    protocol_number VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tworzenie indeksów
CREATE INDEX IF NOT EXISTS idx_repairs_code ON repairs(code);
CREATE INDEX IF NOT EXISTS idx_repairs_client_id ON repairs(client_id);
CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Funkcja do aktualizacji timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger do automatycznej aktualizacji updated_at
CREATE TRIGGER update_repairs_updated_at 
    BEFORE UPDATE ON repairs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Komunikat o utworzeniu bazy danych
DO $$
BEGIN
    RAISE NOTICE 'Baza danych serwis została zainicjalizowana pomyślnie!';
END $$; 