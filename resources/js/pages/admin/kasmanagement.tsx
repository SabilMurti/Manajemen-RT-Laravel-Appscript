import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Layout from '@/layouts/dash/layout';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    AlertCircle,
    X,
    Save,
} from 'lucide-react';
import Fuse from 'fuse.js';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

interface Kas {
    id: string;
    tanggal: string;
    tipe: 'pemasukan' | 'pengeluaran';
    nominal: number;
    keterangan: string;
    oleh: string;
}

interface PageProps {
    kas: Kas[];
    user: {
        name: string;
        email: string;
    };
}

const KasManagement: React.FC = () => {
    const { kas, user } = usePage<PageProps>().props;
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedKas, setSelectedKas] = useState<Kas | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const { auth } = usePage().props as any;
    const userName = auth?.warga?.nama ?? '';
    const [showStats, setShowStats] = useState(true);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        tanggal: '',
        tipe: 'pemasukan',
        nominal: 0,
        keterangan: '',
        oleh: userName,
    });

    const options = { keys: ['keterangan', 'oleh'], threshold: 0.3 };
    const fuse = new Fuse(kas, options);
    const filteredKas = searchQuery ? fuse.search(searchQuery).map((r) => r.item) : kas;

    const totalSaldo = filteredKas.reduce((acc, item) => {
        const nominal = Number(item.nominal) || 0;
        return item.tipe === 'pemasukan' ? acc + nominal : acc - nominal;
    }, 0);

    const handleViewDetail = (entry: Kas) => {
        setSelectedKas(entry);
        setShowDetailModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedKas) {
            put(`/admin/kas/${selectedKas.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedKas(null);
                    reset();
                },
            });
        } else {
            post('/admin/kas', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (item: Kas) => {
        setSelectedKas(item);
        setData({
            tanggal: item.tanggal,
            tipe: item.tipe,
            nominal: item.nominal,
            keterangan: item.keterangan,
            oleh: userName,
        });
        setShowModal(true);
    };

    const handleDelete = (item: Kas) => {
        setSelectedKas(item);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedKas) {
            destroy(`/admin/kas/${selectedKas.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedKas(null);
                },
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedItems.length > 0) {
            router.post('/admin/kas/bulk-destroy', { ids: selectedItems });
            setSelectedItems([]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredKas.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredKas.map((k) => k.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const openAddModal = () => {
        setSelectedKas(null);
        reset();
        setShowModal(true);
    };

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const pemasukan = kas
            .filter((k) => k.tipe === 'pemasukan' && new Date(k.tanggal).getMonth() + 1 === month)
            .reduce((sum, k) => sum + Number(k.nominal), 0);
        const pengeluaran = kas
            .filter((k) => k.tipe === 'pengeluaran' && new Date(k.tanggal).getMonth() + 1 === month)
            .reduce((sum, k) => sum + Number(k.nominal), 0);
        return { bulan: month, pemasukan, pengeluaran };
    });

    const chartData = {
        labels: monthlyStats.map((m) =>
            new Date(0, m.bulan - 1).toLocaleString('id-ID', { month: 'short' })
        ),
        datasets: [
            {
                label: 'Pemasukan',
                data: monthlyStats.map((m) => m.pemasukan),
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
            },
            {
                label: 'Pengeluaran',
                data: monthlyStats.map((m) => m.pengeluaran),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
            },
        ],
    };

    return (
        <Layout title="Manajemen Keuangan Kas">
            <>
                {showDetailModal && selectedKas && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Detail Transaksi Kas</h2>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="space-y-4 text-gray-800">
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-600">Tanggal:</h3>
                                        <p className="text-base">
                                            {new Date(selectedKas.tanggal).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-600">Jenis:</h3>
                                        <p className="text-base">{selectedKas.tipe}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-600">Nominal:</h3>
                                        <p className="text-base">Rp{selectedKas.nominal.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-600">Keterangan:</h3>
                                        <p className="text-base">{selectedKas.keterangan}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-600">Oleh:</h3>
                                        <p className="text-base">{selectedKas.oleh}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedItems.length > 0 && (
                    <div className="mileina-alert mileina-alert-info mb-4 flex justify-between items-center">
                        <span>{selectedItems.length} item dipilih</span>
                        <button
                            onClick={handleBulkDelete}
                            className="mileina-btn mileina-btn-danger mileina-btn-sm flex items-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Hapus Terpilih</span>
                        </button>
                    </div>
                )}


             

                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1 className="welcome-title">Manajemen Keuangan Kas</h1>
                        <p className="welcome-subtitle">Catat, lihat, dan kelola transaksi kas RT</p>
                    </div>
                </div>

                <div className="mileina-card pb-5">
                    {/* Header */}
                    <div className="mileina-card-header mb-5">
                        <h3 className="card-title">Daftar Transaksi Kas</h3>
                                            <button
                        onClick={() => setShowStats(prev => !prev)}
                        className="mileina-btn mileina-btn-sm mileina-btn-outline"
                    >
                        {showStats ? 'Sembunyikan Statistik' : 'Tampilkan Statistik'}
                    </button>
                        <button
                            onClick={openAddModal}
                            className="mileina-btn mileina-btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Transaksi</span>
                        </button>
                        <div className="card-actions">
                            <div className="search-box">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Cari transaksi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedItems.length > 0 && (
                        <div className="mileina-alert mileina-alert-info mb-4 flex justify-between items-center">
                            <span>{selectedItems.length} item dipilih</span>
                            <button
                                onClick={handleBulkDelete}
                                className="mileina-btn mileina-btn-danger mileina-btn-sm flex items-center gap-1"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Hapus Terpilih</span>
                            </button>
                        </div>
                    )}

                    {/* Statistik Bulanan */}
            
                    {showStats && (
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Statistik Bulanan</h2>
                            <div className="w-full overflow-x-auto">
                                <Line
                                    data={chartData}
                                    options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
                                />
                            </div>
                            <div className="mt-4 text-sm font-medium text-gray-600">
                                Total Saldo:{' '}
                                <span className={`font-bold ${totalSaldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    Rp{totalSaldo.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}


                    {/* Table */}
                    <div className="mileina-table-container overflow-x-auto">
                        <table className="mileina-table shadow mb-3">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === filteredKas.length && filteredKas.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th>Tanggal</th>
                                    <th>Jenis</th>
                                    <th>Nominal</th>
                                    <th>Keterangan</th>
                                    <th>ID</th>
                                    <th>Oleh</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredKas.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-gray-500">
                                            <div className="flex flex-col items-center space-y-2">
                                                <AlertCircle className="text-2xl text-gray-400" />
                                                <span>Tidak ada data kas ditemukan</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredKas.map((k) => (
                                        <tr key={k.id} className="hover:bg-gray-50">
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(k.id)}
                                                    onChange={() => toggleSelectItem(k.id)}
                                                />
                                            </th>
                                            <td>
                                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                                    {new Date(k.tanggal).toLocaleDateString('id-ID')}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-600">
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs rounded-full ${k.tipe === 'pemasukan'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        {k.tipe}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-600">Rp{k.nominal.toLocaleString()}</div>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-600">{k.keterangan}</div>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-600">{k.id}</div>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-600">{k.oleh}</div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleViewDetail(k)}
                                                        className="mileina-btn mileina-btn-outline mileina-btn-sm"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(k)}
                                                        className="mileina-btn mileina-btn-warning mileina-btn-sm"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(k)}
                                                        className="mileina-btn mileina-btn-danger mileina-btn-sm"
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
                                        {selectedKas ? 'Edit Transaksi Kas' : 'Tambah Transaksi Kas'}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                                        <input
                                            type="date"
                                            value={data.tanggal}
                                            onChange={(e) => setData('tanggal', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis *</label>
                                        <select
                                            value={data.tipe}
                                            onChange={(e) => setData('tipe', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="pemasukan">Pemasukan</option>
                                            <option value="pengeluaran">Pengeluaran</option>
                                        </select>
                                        {errors.tipe && <p className="text-red-500 text-sm mt-1">{errors.tipe}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nominal (Rp) *
                                        </label>
                                        <input
                                            type="number"
                                            value={data.nominal}
                                            onChange={(e) => setData('nominal', parseInt(e.target.value, 10))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.nominal && <p className="text-red-500 text-sm mt-1">{errors.nominal}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                        <textarea
                                            value={data.keterangan}
                                            onChange={(e) => setData('keterangan', e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                        />
                                        {errors.keterangan && (
                                            <p className="text-red-500 text-sm mt-1">{errors.keterangan}</p>
                                        )}
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
                {showDeleteModal && selectedKas && (
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
                                    Yakin ingin menghapus transaksi kas pada tanggal{' '}
                                    <strong>{new Date(selectedKas.tanggal).toLocaleDateString('id-ID')}</strong> dengan
                                    nominal <strong>Rp{selectedKas.nominal.toLocaleString()}</strong>?
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

export default KasManagement;
