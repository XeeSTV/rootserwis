import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Repair } from '../types';
import { 
  Wrench, 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface Stats {
  total_repairs: number;
  pending_repairs: number;
  completed_repairs: number;
  total_clients: number;
  total_protocols: number;
  monthly_revenue: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRepairs, setRecentRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, repairsData] = await Promise.all([
          apiService.getStats(),
          apiService.getRepairs()
        ]);
        setStats(statsData);
        setRecentRepairs(repairsData.slice(0, 5)); // Ostatnie 5 napraw
      } catch (error) {
        console.error('Błąd podczas ładowania danych:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'przyjęte':
        return <Clock className="h-5 w-5 text-warning-500" />;
      case 'w naprawie':
        return <Wrench className="h-5 w-5 text-primary-500" />;
      case 'gotowe':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'odebrane':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'anulowane':
        return <XCircle className="h-5 w-5 text-danger-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'przyjęte':
        return 'bg-warning-100 text-warning-800';
      case 'w naprawie':
        return 'bg-primary-100 text-primary-800';
      case 'gotowe':
        return 'bg-success-100 text-success-800';
      case 'odebrane':
        return 'bg-success-100 text-success-800';
      case 'anulowane':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Przegląd systemu serwisowego</p>
      </div>

      {/* Statystyki */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wrench className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Wszystkie naprawy
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total_repairs}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    W oczekiwaniu
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pending_repairs}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Klienci
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total_clients}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Przychód (miesiąc)
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.monthly_revenue?.toFixed(2)} zł
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ostatnie naprawy */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Ostatnie naprawy</h2>
          <a href="/repairs" className="text-sm text-primary-600 hover:text-primary-500">
            Zobacz wszystkie
          </a>
        </div>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kod
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urządzenie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Klient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentRepairs.map((repair) => (
                <tr key={repair.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {repair.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repair.device}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repair.client?.name || 'Brak danych'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(repair.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(repair.status)}`}>
                        {repair.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(repair.created_at).toLocaleDateString('pl-PL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 