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
                    <div className="cutefish-loading-overlay">
                        <div className="cutefish-spinner">
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="cutefish-page-header">
                    <div className="page-title-container">
                        <div className="page-icon">
                            <i className="bi bi-people-fill"></i>
                        </div>
                        <div>
                            <h1 className="page-title">Manajemen Warga</h1>
                            <p className="page-subtitle">Kelola peran dan status warga</p>
                        </div>
                    </div>
                    {/* <div className="page-actions">
                        <button className="cutefish-btn cutefish-btn-primary">
                            <i className="bi bi-plus-circle"></i>
                            Tambah Warga
                        </button>
                    </div> */}
                </div>

                {/* Stats Cards */}
                <div className="cutefish-stats-grid">
                    <div className="cutefish-stat-card">
                        <div className="stat-icon bg-primary">
                            <i className="bi bi-people"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">{wargaList.length}</div>
                            <div className="stat-label">Total Warga</div>
                        </div>
                    </div>
                    <div className="cutefish-stat-card">
                        <div className="stat-icon bg-success">
                            <i className="bi bi-check-circle"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                {wargaList.filter(w => formState[w.user_id]?.status === 'approved').length}
                            </div>
                            <div className="stat-label">Disetujui</div>
                        </div>
                    </div>
                    <div className="cutefish-stat-card">
                        <div className="stat-icon bg-warning">
                            <i className="bi bi-clock"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number">
                                {wargaList.filter(w => formState[w.user_id]?.status === 'waiting').length}
                            </div>
                            <div className="stat-label">Menunggu</div>
                        </div>
                    </div>
                    <div className="cutefish-stat-card">
                        <div className="stat-icon bg-danger">
                            <i className="bi bi-x-circle"></i>
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
                <div className="cutefish-card">
                    <div className="cutefish-card-header">
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

                    <div className="cutefish-table-container">
                        <table className="cutefish-table">
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
                                                <span className="cutefish-badge cutefish-badge-outline">
                                                    {originalRoles[warga.user_id]}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-content">
                                                <div className="role-selector">
                                                    <select
                                                        className="cutefish-select"
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
                                                            className="cutefish-btn cutefish-btn-success cutefish-btn-sm"
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
                                                    <span className={`cutefish-badge status-${formState[warga.user_id]?.status}`}>
                                                        <i className={`bi ${formState[warga.user_id]?.status === 'approved' ? 'bi-check-circle' :
                                                            formState[warga.user_id]?.status === 'rejected' ? 'bi-x-circle' : 'bi-clock'
                                                            }`}></i>
                                                        {formState[warga.user_id]?.status}
                                                    </span>

                                                    <div className="status-actions">
                                                        {(formState[warga.user_id]?.status === 'waiting' || formState[warga.user_id]?.status === 'rejected') && (
                                                            <button
                                                                className="cutefish-btn cutefish-btn-success cutefish-btn-xs"
                                                                onClick={() => handleStatusUpdate(warga.user_id, 'approved')}
                                                                disabled={loading[warga.user_id]}
                                                            >
                                                                <i className="bi bi-check"></i>
                                                            </button>
                                                        )}
                                                        {(formState[warga.user_id]?.status === 'waiting' || formState[warga.user_id]?.status === 'approved') && (
                                                            <button
                                                                className="cutefish-btn cutefish-btn-danger cutefish-btn-xs"
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
                                                        className="cutefish-btn cutefish-btn-outline cutefish-btn-sm"
                                                        title="Edit"
                                                        
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="cutefish-btn cutefish-btn-danger cutefish-btn-sm"
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
                <style>{`
                :root {
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --bg-primary: #fff;
  --bg-secondary: #f8f9fa;
  --accent-color: #0d6efd;
  --border-color: #dee2e6;
}

                /* Loading Overlay */
                .cutefish-loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }

                .dark-mode .cutefish-loading-overlay {
                    background: rgba(26, 26, 26, 0.9);
                }

                .cutefish-spinner {
                    position: relative;
                    width: 80px;
                    height: 80px;
                }

                .spinner-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 3px solid transparent;
                    border-top: 3px solid var(--accent-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .spinner-ring:nth-child(2) {
                    width: 60px;
                    height: 60px;
                    top: 10px;
                    left: 10px;
                    animation-delay: -0.3s;
                }

                .spinner-ring:nth-child(3) {
                    width: 40px;
                    height: 40px;
                    top: 20px;
                    left: 20px;
                    animation-delay: -0.6s;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Page Header */
                .cutefish-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding: 0 5px;
                }

                .page-title-container {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .page-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, var(--accent-color), #6610f2);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                }

                .page-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0;
                }

                .page-subtitle {
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin: 5px 0 0 0;
                }

                /* Stats Grid */
                .cutefish-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .cutefish-stat-card {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: all 0.3s ease;
                }

                .cutefish-stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow);
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                }

                .stat-content .stat-number {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-primary);
                    line-height: 1;
                }

                .stat-content .stat-label {
                    font-size: 12px;
                    color: var(--text-secondary);
                    margin-top: 5px;
                }

                /* Card */
                .cutefish-card {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }

                .cutefish-card-header {
                    padding: 20px 25px;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .card-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                }

                .search-box {
                    position: relative;
                    width: 250px;
                }

                .search-box i {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                }

                .search-box input {
                    width: 100%;
                    padding: 8px 12px 8px 35px;
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-size: 14px;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .search-box input:focus {
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(13,110,253,0.1);
                }

                /* Table */
                .cutefish-table-container {
                    overflow-x: auto;
                }

                .cutefish-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .cutefish-table th {
                    background: var(--bg-secondary);
                    padding: 15px 20px;
                    font-weight: 600;
                    color: var(--text-primary);
                    font-size: 14px;
                    text-align: left;
                    border-bottom: 1px solid var(--border-color);
                }

                .cutefish-table td {
                    padding: 0;
                    border-bottom: 1px solid var(--border-color);
                }

                .cutefish-table tr:hover {
                    background: var(--bg-secondary);
                }

                .cutefish-table tr.loading-row {
                    opacity: 0.6;
                }

                .cell-content {
                    padding: 20px;
                }

                /* User Info */
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: var(--accent-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
                }

                .user-name {
                    font-weight: 600;
                    color: var(--text-primary);
                    font-size: 14px;
                }

                .user-meta {
                    font-size: 12px;
                    color: var(--text-secondary);
                }

                .user-id {
                    font-family: monospace;
                    background: var(--bg-secondary);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                    color: var(--text-secondary);
                }

                /* Role Selector */
                .role-selector {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .cutefish-select {
                    padding: 8px 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    font-size: 14px;
                    outline: none;
                    transition: all 0.3s ease;
                    min-width: 120px;
                }

                .cutefish-select:focus {
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(13,110,253,0.1);
                }

                /* Status */
                .status-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .status-actions {
                    display: flex;
                    gap: 5px;
                }

                /* Badges */
                .cutefish-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: capitalize;
                }

                .cutefish-badge-outline {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }

                .cutefish-badge.status-approved {
                    background: #d1e7dd;
                    color: #0f5132;
                }

                .cutefish-badge.status-rejected {
                    background: #f8d7da;
                    color: #721c24;
                }

                .cutefish-badge.status-waiting {
                    background: #fff3cd;
                    color: #664d03;
                }

                .dark-mode .cutefish-badge.status-approved {
                    background: rgba(25, 135, 84, 0.2);
                    color: #75dd99;
                }

                .dark-mode .cutefish-badge.status-rejected {
                    background: rgba(220, 53, 69, 0.2);
                    color: #f19ba5;
                }

                .dark-mode .cutefish-badge.status-waiting {
                    background: rgba(255, 193, 7, 0.2);
                    color: #ffdd57;
                }

                /* Buttons */
                .cutefish-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                }

                .cutefish-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: var(--shadow);
                }

                .cutefish-btn-primary {
                    background: var(--accent-color);
                    color: white;
                }

                .cutefish-btn-success {
                    background: #198754;
                    color: white;
                }

                .cutefish-btn-danger {
                    background: #dc3545;
                    color: white;
                }

                .cutefish-btn-outline {
                    background: transparent;
                    border: 1px solid var(--border-color);
                }

                .cutefish-btn-sm {
                    padding: 8px 16px;
                    font-size: 13px;
                }

                .cutefish-btn-xs {
                    padding: 6px 10px;
                    font-size: 12px;
                    border-radius: 6px;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                /* Page Actions */
                .page-actions {
                    display: flex;
                    gap: 10px;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .cutefish-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .page-title-container {
                        gap: 15px;
                    }

                    .page-icon {
                        width: 50px;
                        height: 50px;
                        font-size: 20px;
                    }

                    .page-title {
                        font-size: 24px;
                    }

                    .cutefish-stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .cutefish-card-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }

                    .search-box {
                        width: 100%;
                    }

                    .cutefish-table th,
                    .cell-content {
                        padding: 10px 15px;
                    }

                    .user-info {
                        gap: 8px;
                    }

                    .user-avatar {
                        width: 32px;
                        height: 32px;
                        font-size: 14px;
                    }
                }
            `}</style>
            </Layout>
        </div>

    );
};

export default WargaManagement;