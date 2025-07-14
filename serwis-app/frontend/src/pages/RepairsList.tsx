import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Repair } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Clock,
  Wrench,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const RepairsList: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const data = await apiService.getRepairs();
      setRepairs(data);
    } catch (error) {
      toast.error('Błąd podczas ładowania napraw');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę naprawę?')) {
      try {
        await apiService.deleteRepair(id);
        toast.success('Naprawa została usunięta');
        fetchRepairs();
      } catch (error) {
        toast.error('Błąd podczas usuwania naprawy');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'przyjęte':
        return <Clock className="h-4 w-4 text-warning-500" />;
      case 'w naprawie':
        return <Wrench className="h-4 w-4 text-primary-500" />;
      case 'gotowe':
        return <CheckCircle className="h-4 w-4 text-success-500" />;
      case 'odebrane':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'anulowane':
        return <XCircle className="h-4 w-4 text-danger-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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

  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = 
      repair.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || repair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Naprawy</h1>
          <p className="text-gray-600">Zarządzaj naprawami urządzeń</p>
        </div>
        <Link
          to="/repairs/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nowa naprawa
        </Link>
      </div>

      {/* Filtry */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj po kodzie, urządzeniu lub kliencie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">Wszystkie statusy</option>
              <option value="przyjęte">Przyjęte</option>
              <option value="w naprawie">W naprawie</option>
              <option value="gotowe">Gotowe</option>
              <option value="odebrane">Odebrane</option>
              <option value="anulowane">Anulowane</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista napraw */}
      <div className="card">
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
                  Cena
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRepairs.map((repair) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repair.price_estimate ? `${repair.price_estimate.toFixed(2)} zł` : 'Brak'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(repair.created_at).toLocaleDateString('pl-PL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/repairs/${repair.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/repairs/${repair.id}/edit`}
                        className="text-warning-600 hover:text-warning-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(repair.id)}
                        className="text-danger-600 hover:text-danger-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRepairs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nie znaleziono napraw</p>
          </div>
        )}
      </div>
    </div>
  );
}; 