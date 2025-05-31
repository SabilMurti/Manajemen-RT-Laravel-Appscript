import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Layout from '@/layouts/dash/layout';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  AlertCircle,
  X,
  Save
} from 'lucide-react';
import Fuse from 'fuse.js';



interface Pengumuman {
  pengumuman_id: string;
  judul: string;
  isi: string;
  tanggal: string;
  dibuat_oleh: string;
  diperbarui_oleh?: string;
  created_at: string;
  updated_at?: string;
}

interface PageProps {
  pengumuman: Pengumuman[];
  user: {
    name: string;
    email: string;
  };
}

const PengumumanManagement: React.FC = () => {
  const { pengumuman, user } = usePage<PageProps>().props;
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPengumuman, setSelectedPengumuman] = useState<Pengumuman | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);


  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    judul: '',
    isi: '',
    tanggal: ''
  });

  const options = {
    keys: ['judul', 'isi'], // field yang dicari
    threshold: 0.3, // toleransi kemiripan
  };


  const fuse = new Fuse(pengumuman, options);
  const filteredPengumuman = searchQuery ? fuse.search(searchQuery).map(result => result.item) : pengumuman;

  const handleViewDetail = (pengumuman: Pengumuman) => {
    setSelectedPengumuman(pengumuman);
    setShowDetailModal(true);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPengumuman) {
      put(`/admin/pengumuman/${selectedPengumuman.pengumuman_id}`, {
        onSuccess: () => {
          setShowModal(false);
          setSelectedPengumuman(null);
          reset();
        }
      });
    } else {
      post('/admin/pengumuman', {
        onSuccess: () => {
          setShowModal(false);
          reset();
        }
      });
    }
  };

  const handleEdit = (pengumuman: Pengumuman) => {
    setSelectedPengumuman(pengumuman);
    setData({
      judul: pengumuman.judul,
      isi: pengumuman.isi,
      tanggal: pengumuman.tanggal
    });
    setShowModal(true);
  };

  const handleDelete = (pengumuman: Pengumuman) => {
    setSelectedPengumuman(pengumuman);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedPengumuman) {
      destroy(`/admin/pengumuman/${selectedPengumuman.pengumuman_id}`, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedPengumuman(null);
        }
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length > 0) {
      router.post('/admin/pengumuman/bulk-delete', { ids: selectedItems });
      setSelectedItems([]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredPengumuman.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredPengumuman.map(p => p.pengumuman_id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const openAddModal = () => {
    setSelectedPengumuman(null);
    reset();
    setShowModal(true);
  };

  return (
    <Layout title="Manajemen Pengumuman">
      <>
        {showDetailModal && selectedPengumuman && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Detail Pengumuman
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4 text-gray-800">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600">Judul:</h3>
                    <p className="text-base">{selectedPengumuman.judul}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-gray-600">Isi:</h3>
                    <p className="whitespace-pre-line">{selectedPengumuman.isi}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPengumuman.tanggal).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{selectedPengumuman.dibuat_oleh}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengumuman</h1>
              <p className="text-gray-600 mt-1">Kelola pengumuman untuk warga RT</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengumuman</span>
            </button>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari pengumuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                {selectedItems.length} item dipilih
              </span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Terpilih</span>
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredPengumuman.length && filteredPengumuman.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Judul</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Tanggal</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Dibuat Oleh</th>
                  <th className="border border-gray-200 p-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPengumuman.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border border-gray-200 p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                        <span>Tidak ada pengumuman ditemukan</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPengumuman.map((pengumuman) => (
                    <tr key={pengumuman.pengumuman_id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(pengumuman.pengumuman_id)}
                          onChange={() => toggleSelectItem(pengumuman.pengumuman_id)}
                          className="rounded"
                        />
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div>
                          <div className="font-medium text-gray-900">{pengumuman.judul}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {pengumuman.isi.length > 100
                              ? `${pengumuman.isi.substring(0, 100)}...`
                              : pengumuman.isi
                            }
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(pengumuman.tanggal).toLocaleDateString('id-ID')}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{pengumuman.dibuat_oleh}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleViewDetail(pengumuman)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleEdit(pengumuman)}
                            className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pengumuman)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedPengumuman ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Pengumuman *
                    </label>
                    <input
                      type="text"
                      value={data.judul}
                      onChange={(e) => setData('judul', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan judul pengumuman"
                      required
                    />
                    {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Isi Pengumuman *
                    </label>
                    <textarea
                      value={data.isi}
                      onChange={(e) => setData('isi', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="Masukkan isi pengumuman"
                      required
                    />
                    {errors.isi && <p className="text-red-500 text-sm mt-1">{errors.isi}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal *
                    </label>
                    <input
                      type="date"
                      value={data.tanggal}
                      onChange={(e) => setData('tanggal', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{processing ? 'Menyimpan...' : 'Simpan'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedPengumuman && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Konfirmasi Hapus</h3>
                    <p className="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Apakah Anda yakin ingin menghapus pengumuman "<strong>{selectedPengumuman.judul}</strong>"?
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={processing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {processing ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </Layout>
  );
};

export default PengumumanManagement;
