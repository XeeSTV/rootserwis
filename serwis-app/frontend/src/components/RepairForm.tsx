import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { Repair, CreateRepairRequest, UpdateRepairRequest } from '../types';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft } from 'lucide-react';

interface RepairFormData {
  client_name: string;
  client_company: string;
  client_email: string;
  client_phone: string;
  device: string;
  description: string;
  price_estimate: string;
  status: string;
}

export const RepairForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [repair, setRepair] = useState<Repair | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RepairFormData>();

  useEffect(() => {
    if (id && id !== 'new') {
      fetchRepair();
    }
  }, [id]);

  const fetchRepair = async () => {
    try {
      const data = await apiService.getRepair(parseInt(id!));
      setRepair(data);
      setValue('client_name', data.client?.name || '');
      setValue('client_company', data.client?.company || '');
      setValue('client_email', data.client?.email || '');
      setValue('client_phone', data.client?.phone || '');
      setValue('device', data.device);
      setValue('description', data.description || '');
      setValue('price_estimate', data.price_estimate?.toString() || '');
      setValue('status', data.status);
    } catch (error) {
      toast.error('Błąd podczas ładowania naprawy');
      navigate('/repairs');
    }
  };

  const onSubmit = async (data: RepairFormData) => {
    setLoading(true);
    try {
      if (id && id !== 'new') {
        // Edycja naprawy
        const updateData: UpdateRepairRequest = {
          status: data.status,
          price_estimate: data.price_estimate ? parseFloat(data.price_estimate) : undefined,
          description: data.description || undefined,
        };
        await apiService.updateRepair(parseInt(id), updateData);
        toast.success('Naprawa została zaktualizowana');
      } else {
        // Nowa naprawa
        const createData: CreateRepairRequest = {
          client_name: data.client_name,
          client_company: data.client_company || undefined,
          client_email: data.client_email || undefined,
          client_phone: data.client_phone || undefined,
          device: data.device,
          description: data.description || undefined,
          price_estimate: data.price_estimate ? parseFloat(data.price_estimate) : undefined,
        };
        await apiService.createRepair(createData);
        toast.success('Naprawa została utworzona');
      }
      navigate('/repairs');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Błąd podczas zapisywania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/repairs')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id && id !== 'new' ? 'Edytuj naprawę' : 'Nowa naprawa'}
          </h1>
          <p className="text-gray-600">
            {id && id !== 'new' ? 'Zaktualizuj dane naprawy' : 'Dodaj nową naprawę do systemu'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Dane klienta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imię i nazwisko *
              </label>
              <input
                {...register('client_name', { required: 'Imię i nazwisko jest wymagane' })}
                className="input mt-1"
                placeholder="Jan Kowalski"
                disabled={!!id && id !== 'new'}
              />
              {errors.client_name && (
                <p className="mt-1 text-sm text-danger-600">{errors.client_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Firma
              </label>
              <input
                {...register('client_company')}
                className="input mt-1"
                placeholder="Nazwa firmy"
                disabled={!!id && id !== 'new'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register('client_email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Nieprawidłowy adres email',
                  },
                })}
                type="email"
                className="input mt-1"
                placeholder="jan@example.com"
                disabled={!!id && id !== 'new'}
              />
              {errors.client_email && (
                <p className="mt-1 text-sm text-danger-600">{errors.client_email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                {...register('client_phone')}
                className="input mt-1"
                placeholder="+48 123 456 789"
                disabled={!!id && id !== 'new'}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Dane urządzenia</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Urządzenie *
              </label>
              <input
                {...register('device', { required: 'Nazwa urządzenia jest wymagana' })}
                className="input mt-1"
                placeholder="iPhone 12, Laptop Dell Inspiron, etc."
              />
              {errors.device && (
                <p className="mt-1 text-sm text-danger-600">{errors.device.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Opis problemu
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="input mt-1"
                placeholder="Szczegółowy opis problemu z urządzeniem..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Szacunkowa cena (zł)
                </label>
                <input
                  {...register('price_estimate', {
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Nieprawidłowa cena',
                    },
                  })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="input mt-1"
                  placeholder="0.00"
                />
                {errors.price_estimate && (
                  <p className="mt-1 text-sm text-danger-600">{errors.price_estimate.message}</p>
                )}
              </div>

              {id && id !== 'new' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select {...register('status')} className="input mt-1">
                    <option value="przyjęte">Przyjęte</option>
                    <option value="w naprawie">W naprawie</option>
                    <option value="gotowe">Gotowe</option>
                    <option value="odebrane">Odebrane</option>
                    <option value="anulowane">Anulowane</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/repairs')}
            className="btn-secondary"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {id && id !== 'new' ? 'Zapisz zmiany' : 'Utwórz naprawę'}
          </button>
        </div>
      </form>
    </div>
  );
}; 