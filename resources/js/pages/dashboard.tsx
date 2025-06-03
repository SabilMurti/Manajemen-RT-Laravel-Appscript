import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/dash/layout';
import { Line } from 'react-chartjs-2';
import Fuse from 'fuse.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';

import { usePage } from '@inertiajs/react';



export default function Dashboard() {



    const { kas, warga, userRoles, userStatuses, availableRoles, availableStatuses, pengumuman } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');

    const [formState, setFormState] = useState<Record<number, { role: string; status: string }>>(() => {
        const initial: Record<number, { role: string; status: string }> = {};
        warga.forEach(w => {
            initial[w.user_id] = {
                role: userRoles[w.user_id] || availableRoles[0],
                status: userStatuses[w.user_id] || availableStatuses[0],
            };
        });
        return initial;
    });

    const options = { keys: ['keterangan', 'oleh'], threshold: 0.3 };
    const fuse = new Fuse(kas, options);
    const filteredKas = searchQuery ? fuse.search(searchQuery).map((r) => r.item) : kas;

    const totalSaldo = filteredKas.reduce((acc, item) => {
        const nominal = Number(item.nominal) || 0;
        return item.tipe === 'pemasukan' ? acc + nominal : acc - nominal;
    }, 0);


    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        Legend
    );
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const pemasukan = kas
            .filter(k => k.tipe === 'pemasukan' && new Date(k.tanggal).getMonth() + 1 === month)
            .reduce((sum, k) => sum + Number(k.nominal), 0);
        const pengeluaran = kas
            .filter(k => k.tipe === 'pengeluaran' && new Date(k.tanggal).getMonth() + 1 === month)
            .reduce((sum, k) => sum + Number(k.nominal), 0);
        return { bulan: month, pemasukan, pengeluaran };
    });

    const chartData = {
        labels: monthlyStats.map(m => new Date(0, m.bulan - 1).toLocaleString('id-ID', { month: 'short' })),
        datasets: [
            {
                label: 'Pemasukan',
                data: monthlyStats.map(m => m.pemasukan),
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
            },
            {
                label: 'Pengeluaran',
                data: monthlyStats.map(m => m.pengeluaran),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
            },
        ],
    };


    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Welcome Section */}
            <div className="welcome-section" >
                <div className="welcome-content">
                    <h1 className="welcome-title">Welcome Back!</h1>
                    <p className="welcome-subtitle">Here's what's happening in your RT today</p>
                </div>
                {/* <div className="welcome-stats">
                    <div className="stat-badge">
                        <i className="bi bi-bell-fill"></i>
                        <span>3 New</span>
                    </div>
                </div> */}
            </div>



            {/* Quick Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <i className="bi bi-people-fill"></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-number">{warga.length}</div>
                        <div className="stat-label">Approved Warga</div>

                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">
                        <i className="bi bi-clock-fill"></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-number">
                            {warga.filter(w => formState[w.user_id]?.status === 'waiting').length}
                        </div>
                        <div className="stat-label">Pending Warga</div>
                    </div>
                </div>

                <div className="stat-card  bg-success text-white">
                    <div className="stat-icon">
                        <i className="bi bi-calendar-event-fill"></i>
                    </div>
                    <div className="stat-content ">
                        <h3 className="stat-number  text-white">Rp. {totalSaldo.toLocaleString()}</h3>

                        <p className="stat-label  text-white">Total Kas</p>

                    </div>
                </div>

                {/* <div className="stat-card info">
                    <div className="stat-icon">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">12</h3>
                        <p className="stat-label">Pending Issues</p>
                        <span className="stat-change negative">
                            <i className="bi bi-arrow-down"></i>
                            -3 resolved
                        </span>
                    </div>
                </div> */}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                <div className="dashboard-card full-width p-4">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="bi bi-graph-up"></i>
                            Statistik Kas Bulanan
                        </h3>
                    </div>
                    <div className="card-content">
                        <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                    </div>
                </div>


                {/* Announcements */}
                <div className="dashboard-card full-width p-4">
                    <div className="card-header p-2 m-2">
                        <h3 className="card-title">
                            <i className="bi bi-megaphone-fill me-3"></i>
                            Latest Announcements
                        </h3>

                    </div>
                    <div className="card-content">
                        <div className="announcements-list">

                            {pengumuman.slice(0, 3).map((item) => (
                                <div key={item.id} className="announcement-item normal">
                                    <div className="announcement-priority">
                                        <i className="bi bi-info-circle-fill"></i>
                                    </div>
                                    <div className="announcement-content">
                                        <h4 className="announcement-title">{item.judul}</h4>
                                        <p className="announcement-text">{item.isi}</p>
                                        <span className="announcement-date">{item.tanggal}</span>
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Link ke semua pengumuman */}
                        <div className="see-all-announcements" style={{ marginTop: '1rem', textAlign: 'right' }}>


                        <Link href="/admin/pengumuman" className="btn btn-primary">
                            Lihat semua pengumuman →
                        </Link>

                    </div>
                </div>
            </div>
        </div>

            {/* Custom Styles */ }

        </AdminLayout >
    );
}