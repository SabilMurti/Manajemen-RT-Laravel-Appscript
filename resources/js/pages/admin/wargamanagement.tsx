import React, { useState, FormEvent } from 'react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';

// Import Custom Layout CuteFish
import Layout from '@/layouts/dash/layout';

interface Props {
    wargaList: Array<{ user_id: number; nama: string;[key: string]: any }>;
    userRoles: Record<number, string>;
    userStatuses: Record<number, string>;
    availableRoles: string[];
    availableStatuses: string[];
    [key: string]: any;
}

const WargaManagement: React.FC = () => {
    const { wargaList, userRoles, userStatuses, availableRoles, availableStatuses } = usePage<Props>().props;



    const [formState, setFormState] = useState<Record<number, { role: string; status: string }>>(() => {
        const initial: Record<number, { role: string; status: string }> = {};
        wargaList.forEach(w => {
            initial[w.user_id] = {
                role: userRoles[w.user_id] || availableRoles[0],
                status: userStatuses[w.user_id] || availableStatuses[0],
            };
        });
        return initial;
    });

    const [originalRoles, setOriginalRoles] = useState<Record<number, string>>(() => {
        const original: Record<number, string> = {};
        wargaList.forEach(w => {
            original[w.user_id] = userRoles[w.user_id] || availableRoles[0];
        });
        return original;
    });

    const [loading, setLoading] = useState<Record<number, boolean>>({});
    const [pageLoading, setPageLoading] = useState<boolean>(false);

    const handleChange = (id: number, field: 'role', value: string) => {
        setFormState(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };



    const handleRoleUpdate = (id: number) => {
        setLoading(prev => ({ ...prev, [id]: true }));
        setPageLoading(true);

        Inertia.put(`/admin/warga/${id}`, {
            ...formState[id],
            role: formState[id].role
        }, {
            onFinish: () => {
                setLoading(prev => ({ ...prev, [id]: false }));
                setPageLoading(false);
                setOriginalRoles(prev => ({
                    ...prev,
                    [id]: formState[id].role
                }));
            },
        });
    };

    const handleStatusUpdate = (id: number, status: string) => {
        setFormState(prev => ({
            ...prev,
            [id]: { ...prev[id], status },
        }));

        setLoading(prev => ({ ...prev, [id]: true }));
        setPageLoading(true);

        Inertia.put(`/admin/warga/${id}`, {
            ...formState[id],
            status
        }, {
            onFinish: () => {
                setLoading(prev => ({ ...prev, [id]: false }));
                setPageLoading(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus user ini?')) return;
        setLoading(prev => ({ ...prev, [id]: true }));
        setPageLoading(true);

        Inertia.delete(`/admin/warga/${id}`, {
            onFinish: () => {
                setLoading(prev => ({ ...prev, [id]: false }));
                setPageLoading(false);
            },
        });
    };

    const isRoleChanged = (id: number) => {
        return formState[id]?.role !== originalRoles[id];
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredWargaList = wargaList.filter(warga =>
        warga.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className='pb-5'>
            <Layout title="Manajemen Warga">
                <Head title="Manajemen Warga" />

                {/* Loading Overlay with CuteFish Style */}
                {pageLoading && (
                    <div className="mileina-loading-overlay">
                        <div className="mileina-spinner">
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                        </div>
                    </div>
                )}



                {/* Welcome Section */}
                <div className="welcome-section " >
                    <div className="welcome-content">
                        <h1 className="welcome-title">Manajemen Warga</h1>
                        <p className="welcome-subtitle">Kelola peran dan status warga</p>
                    </div>
                    {/* <div className="welcome-stats">
                        <div className="stat-badge">
                            <i className="bi bi-bell-fill"></i>
                            <span>3 New</span>
                        </div>
                    </div> */}
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card primary">
                        <div className="stat-icon">
                            <i className="bi bi-people-fill"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{wargaList.length}</div>
                            <div className="stat-label">Total Warga</div>

                        </div>
                    </div>

                    <div className="stat-card success">
                        <div className="stat-icon">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                {wargaList.filter(w => formState[w.user_id]?.status === 'approved').length}
                            </div>
                            <div className="stat-label">Disetujui</div>
                        </div>
                    </div>

                    <div className="stat-card warning">
                        <div className="stat-icon">
                            <i className="bi bi-clock-fill"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                {wargaList.filter(w => formState[w.user_id]?.status === 'waiting').length}
                            </div>
                            <div className="stat-label">Menunggu</div>
                        </div>
                    </div>

                    <div className="stat-card danger">
                        <div className="stat-icon">
                            <i className="bi bi-x-circle-fill"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                {wargaList.filter(w => formState[w.user_id]?.status === 'rejected').length}
                            </div>
                            <div className="stat-label">Ditolak</div>
                        </div>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="mileina-card">
                    <div className="mileina-card-header">
                        <h3 className="card-title">Daftar Warga</h3>
                        <div className="card-actions">
                            <div className="search-box">
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    placeholder="Cari warga..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                            </div>
                        </div>
                    </div>

                    <div className="mileina-table-container">
                        <table className="mileina-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nama</th>
                                    <th>Role Saat Ini</th>
                                    <th>Role Baru</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWargaList.map(warga => (
                                    <tr key={warga.user_id} className={loading[warga.user_id] ? 'loading-row' : ''}>
                                        <td>
                                            <div className="cell-content">
                                                <span className="user-id">#{warga.user_id}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-content">
                                                <div className="user-info">
                                                    <div className="user-avatar">
                                                        {warga.nama.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="user-details">
                                                        <div className="user-name">{warga.nama}</div>
                                                        <div className="user-meta">ID: {warga.user_id}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-content">
                                                <span className="mileina-badge mileina-badge-outline">
                                                    {originalRoles[warga.user_id]}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-content">
                                                <div className="role-selector">
                                                    <select
                                                        className="mileina-select"
                                                        value={formState[warga.user_id]?.role}
                                                        onChange={e => handleChange(warga.user_id, 'role', e.target.value)}
                                                        disabled={loading[warga.user_id]}
                                                    >
                                                        {availableRoles.map(role => (
                                                            <option key={role} value={role}>{role}</option>
                                                        ))}
                                                    </select>
                                                    {isRoleChanged(warga.user_id) && (
                                                        <button
                                                            className="mileina-btn mileina-btn-success mileina-btn-sm"
                                                            onClick={() => handleRoleUpdate(warga.user_id)}
                                                            disabled={loading[warga.user_id]}
                                                        >
                                                            <i className="bi bi-check-lg"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-content">
                                                <div className="status-container">
                                                    <span className={`mileina-badge status-${formState[warga.user_id]?.status}`}>
                                                        <i className={`bi ${formState[warga.user_id]?.status === 'approved' ? 'bi-check-circle' :
                                                            formState[warga.user_id]?.status === 'rejected' ? 'bi-x-circle' : 'bi-clock'
                                                            }`}></i>
                                                        {formState[warga.user_id]?.status}
                                                    </span>

                                                    <div className="status-actions">
                                                        {(formState[warga.user_id]?.status === 'waiting' || formState[warga.user_id]?.status === 'rejected') && (
                                                            <button
                                                                className="mileina-btn mileina-btn-success mileina-btn-xs"
                                                                onClick={() => handleStatusUpdate(warga.user_id, 'approved')}
                                                                disabled={loading[warga.user_id]}
                                                            >
                                                                <i className="bi bi-check"></i>
                                                            </button>
                                                        )}
                                                        {(formState[warga.user_id]?.status === 'waiting' || formState[warga.user_id]?.status === 'approved') && (
                                                            <button
                                                                className="mileina-btn mileina-btn-danger mileina-btn-xs"
                                                                onClick={() => handleStatusUpdate(warga.user_id, 'rejected')}
                                                                disabled={loading[warga.user_id]}
                                                            >
                                                                <i className="bi bi-x"></i>
                                                                <span>Keluarkan</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-content">
                                                <div className="action-buttons">
                                                    <button
                                                        className="mileina-btn mileina-btn-outline mileina-btn-sm"
                                                        title="Edit"

                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="mileina-btn mileina-btn-danger mileina-btn-sm"
                                                        onClick={() => handleDelete(warga.user_id)}
                                                        disabled={loading[warga.user_id]}
                                                        title="Delete"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CuteFish Style CSS */}

            </Layout>

        </div>

    );
};

export default WargaManagement;