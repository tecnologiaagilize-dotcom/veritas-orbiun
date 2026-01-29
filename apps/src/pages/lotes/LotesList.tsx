import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Plus, Search, Filter, Loader2, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Batch {
  id: string;
  batch_id: string;
  waste_type: string;
  quantity_kg: number;
  status: string;
  collection_date: string;
}

export const LotesList = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBatches(data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch => 
    batch.batch_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.waste_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Gestão de Lotes" 
        description="Gerencie e rastreie os lotes de resíduos desde a coleta até o processamento."
      >
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" />
          Novo Lote
        </button>
      </PageHeader>

      <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID ou tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900">
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-8 w-8 text-green-600" />
            </div>
          ) : batches.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <Package className="h-12 w-12 mb-4 text-gray-300" />
              <p>Nenhum lote encontrado.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 font-medium">ID do Lote</th>
                  <th className="px-6 py-3 font-medium">Tipo de Resíduo</th>
                  <th className="px-6 py-3 font-medium">Quantidade</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Data Coleta</th>
                  <th className="px-6 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredBatches.map((batch) => (
                  <tr key={batch.id} className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{batch.batch_id}</td>
                    <td className="px-6 py-4">{batch.waste_type}</td>
                    <td className="px-6 py-4">{batch.quantity_kg} kg</td>
                    <td className="px-6 py-4">
                      <span className={inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                         + ''}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(batch.collection_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-green-600 hover:text-green-700 font-medium">Ver Detalhes</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
