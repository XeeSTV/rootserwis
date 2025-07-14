import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Repair } from '../types';
import { Search, Clock, Wrench, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ClientPortal: React.FC = () => {
  const [searchCode, setSearchCode] = useState('');
  const [repair, setRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      toast.error('Wprowadź kod naprawy');
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.getRepairByCode(searchCode.trim());
      setRepair(data);
      setSearched(true);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Nie znaleziono naprawy o podanym kodzie');
      setRepair(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'przyjęte':
        return <Clock className="h-8 w-8 text-warning-500" />;
      case 'w naprawie':
        return <Wrench className="h-8 w-8 text-primary-500" />;
      case 'gotowe':
        return <CheckCircle className="h-8 w-8 text-success-500" />;
      case 'odebrane':
        return <CheckCircle className="h-8 w-8 text-success-600" />;
      case 'anulowane':
        return <XCircle className="h-8 w-8 text-danger-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'przyjęte':
        return 'Urządzenie zostało przyjęte do serwisu';
      case 'w naprawie':
        return 'Urządzenie jest w trakcie naprawy';
      case 'gotowe':
        return 'Naprawa została zakończona - urządzenie gotowe do odbioru';
      case 'odebrane':
        return 'Urządzenie zostało odebrane przez klienta';
      case 'anulowane':
        return 'Naprawa została anulowana';
      default:
        return 'Status nieznany';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'przyjęte':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'w naprawie':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'gotowe':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'odebrane':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'anulowane':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sprawdź status naprawy
          </h1>
          <p className="text-gray-600">
            Wprowadź kod naprawy, aby sprawdzić aktualny status swojego urządzenia
          </p>
        </div>

        {/* Formularz wyszukiwania */}
        <div className="card mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="repairCode" className="block text-sm font-medium text-gray-700 mb-2">
                Kod naprawy
              </label>
              <div className="flex gap-2">
                <input
                  id="repairCode"
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="np. REP001"
                  className="input flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Sprawdź
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wyniki wyszukiwania */}
        {searched && (
          <div className="card">
            {repair ? (
              <div className="space-y-6">
                {/* Status */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {getStatusIcon(repair.status)}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Status: {repair.status}
                  </h2>
                  <p className="text-gray-600">
                    {getStatusText(repair.status)}
                  </p>
                </div>

                {/* Szczegóły naprawy */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Szczegóły naprawy
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Kod naprawy</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{repair.code}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Urządzenie</dt>
                      <dd className="mt-1 text-sm text-gray-900">{repair.device}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Data przyjęcia</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(repair.created_at).toLocaleDateString('pl-PL')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ostatnia aktualizacja</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(repair.updated_at).toLocaleDateString('pl-PL')}
                      </dd>
                    </div>
                    {repair.price_estimate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Szacunkowa cena</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">
                          {repair.price_estimate.toFixed(2)} zł
                        </dd>
                      </div>
                    )}
                  </div>
                </div>

                {/* Opis problemu */}
                {repair.description && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Opis problemu
                    </h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {repair.description}
                    </p>
                  </div>
                )}

                {/* Informacje o kliencie */}
                {repair.client && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Dane klienta
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Imię i nazwisko</dt>
                        <dd className="mt-1 text-sm text-gray-900">{repair.client.name}</dd>
                      </div>
                      {repair.client.company && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Firma</dt>
                          <dd className="mt-1 text-sm text-gray-900">{repair.client.company}</dd>
                        </div>
                      )}
                      {repair.client.email && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{repair.client.email}</dd>
                        </div>
                      )}
                      {repair.client.phone && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                          <dd className="mt-1 text-sm text-gray-900">{repair.client.phone}</dd>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nie znaleziono naprawy
                </h3>
                <p className="text-gray-600">
                  Sprawdź, czy kod naprawy został wprowadzony poprawnie
                </p>
              </div>
            )}
          </div>
        )}

        {/* Informacje dodatkowe */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Masz pytania? Skontaktuj się z nami: +48 123 456 789
          </p>
        </div>
      </div>
    </div>
  );
}; 