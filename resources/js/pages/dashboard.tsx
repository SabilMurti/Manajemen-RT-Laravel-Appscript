import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/dash/layout';
import { Line } from 'react-chartjs-2';
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



    const { kas } = usePage().props as any;
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
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1 className="welcome-title">Welcome Back!</h1>
                    <p className="welcome-subtitle">Here's what's happening in your RT today</p>
                </div>
                <div className="welcome-stats">
                    <div className="stat-badge">
                        <i className="bi bi-bell-fill"></i>
                        <span>3 New</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <i className="bi bi-people-fill"></i>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">1,245</h3>
                        <p className="stat-label">Total Warga</p>
                        <span className="stat-change positive">
                            <i className="bi bi-arrow-up"></i>
                            +12 this month
                        </span>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">
                        <i className="bi bi-house-fill"></i>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">425</h3>
                        <p className="stat-label">Total Rumah</p>
                        <span className="stat-change positive">
                            <i className="bi bi-arrow-up"></i>
                            +5 this month
                        </span>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">
                        <i className="bi bi-calendar-event-fill"></i>
                    </div>
                    <div className="stat-content">
                        <h3 className="stat-number">8</h3>
                        <p className="stat-label">Events Bulan Ini</p>
                        <span className="stat-change neutral">
                            <i className="bi bi-calendar"></i>
                            3 upcoming
                        </span>
                    </div>
                </div>

                <div className="stat-card info">
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
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                <div className="dashboard-card full-width">
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
                {/* Recent Activities */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="bi bi-clock-history"></i>
                            Recent Activities
                        </h3>
                        <button className="card-action">
                            <i className="bi bi-three-dots"></i>
                        </button>
                    </div>
                    <div className="card-content">
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-avatar success">
                                    <i className="bi bi-person-plus"></i>
                                </div>
                                <div className="activity-content">
                                    <p className="activity-text">New resident registered: <strong>John Doe</strong></p>
                                    <span className="activity-time">2 hours ago</span>
                                </div>
                            </div>

                            <div className="activity-item">
                                <div className="activity-avatar warning">
                                    <i className="bi bi-tools"></i>
                                </div>
                                <div className="activity-content">
                                    <p className="activity-text">Maintenance request from Block A</p>
                                    <span className="activity-time">4 hours ago</span>
                                </div>
                            </div>

                            <div className="activity-item">
                                <div className="activity-avatar info">
                                    <i className="bi bi-calendar-plus"></i>
                                </div>
                                <div className="activity-content">
                                    <p className="activity-text">New event scheduled: Community Meeting</p>
                                    <span className="activity-time">1 day ago</span>
                                </div>
                            </div>

                            <div className="activity-item">
                                <div className="activity-avatar primary">
                                    <i className="bi bi-check-circle"></i>
                                </div>
                                <div className="activity-content">
                                    <p className="activity-text">Payment received from Warga ID: 1234</p>
                                    <span className="activity-time">2 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="bi bi-lightning"></i>
                            Quick Actions
                        </h3>
                    </div>
                    <div className="card-content">
                        <div className="quick-actions">
                            <button className="quick-action-btn primary">
                                <i className="bi bi-person-plus"></i>
                                <span>Add Warga</span>
                            </button>

                            <button className="quick-action-btn success">
                                <i className="bi bi-calendar-plus"></i>
                                <span>New Event</span>
                            </button>

                            <button className="quick-action-btn warning">
                                <i className="bi bi-envelope"></i>
                                <span>Send Notice</span>
                            </button>

                            <button className="quick-action-btn info">
                                <i className="bi bi-file-earmark-plus"></i>
                                <span>Generate Report</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Announcements */}
                <div className="dashboard-card full-width">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="bi bi-megaphone"></i>
                            Latest Announcements
                        </h3>
                        <button className="card-action">View All</button>
                    </div>
                    <div className="card-content">
                        <div className="announcements-list">
                            <div className="announcement-item important">
                                <div className="announcement-priority">
                                    <i className="bi bi-exclamation-triangle-fill"></i>
                                </div>
                                <div className="announcement-content">
                                    <h4 className="announcement-title">Water Supply Maintenance</h4>
                                    <p className="announcement-text">Scheduled maintenance on Sunday, 26 May 2025. Water supply will be interrupted from 8 AM to 12 PM.</p>
                                    <span className="announcement-date">Posted 3 hours ago</span>
                                </div>
                            </div>

                            <div className="announcement-item normal">
                                <div className="announcement-priority">
                                    <i className="bi bi-info-circle-fill"></i>
                                </div>
                                <div className="announcement-content">
                                    <h4 className="announcement-title">Monthly Community Meeting</h4>
                                    <p className="announcement-text">Join us for our monthly community meeting on Saturday, 1 June 2025 at 7 PM in the community hall.</p>
                                    <span className="announcement-date">Posted 1 day ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                /* Welcome Section */
                .welcome-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding: 25px;
                    background: linear-gradient(135deg, var(--accent-color), #6610f2);
                    border-radius: 20px;
                    color: white;
                }
                
                .welcome-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                
                .welcome-subtitle {
                    font-size: 16px;
                    opacity: 0.9;
                    margin: 0;
                }
                
                .welcome-stats {
                    display: flex;
                    gap: 15px;
                }
                
                .stat-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                    font-weight: 500;
                }

                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 25px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    box-shadow: var(--shadow);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: var(--card-accent);
                }
                
                .stat-card.primary {
                    --card-accent: #007bff;
                }
                
                .stat-card.success {
                    --card-accent: #28a745;
                }
                
                .stat-card.warning {
                    --card-accent: #ffc107;
                }
                
                .stat-card.info {
                    --card-accent: #17a2b8;
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                }
                
                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    background: var(--card-accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    flex-shrink: 0;
                }
                
                .stat-content {
                    flex: 1;
                }
                
                .stat-number {
                    font-size: 32px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0 0 5px 0;
                }
                
                .stat-label {
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin: 0 0 8px 0;
                }
                
                .stat-change {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .stat-change.positive {
                    color: #28a745;
                }
                
                .stat-change.negative {
                    color: #dc3545;
                }
                
                .stat-change.neutral {
                    color: var(--text-secondary);
                }

                /* Dashboard Grid */
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .dashboard-card {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    box-shadow: var(--shadow);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .dashboard-card:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                }
                
                .dashboard-card.full-width {
                    grid-column: 1 / -1;
                }
                
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 25px;
                    border-bottom: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                }
                
                .card-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                }
                
                .card-action {
                    padding: 8px;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .card-action:hover {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                }
                
                .card-content {
                    padding: 25px;
                }

                /* Activity List */
                .activity-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .activity-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                }
                
                .activity-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                    flex-shrink: 0;
                }
                
                .activity-avatar.success {
                    background: #28a745;
                }
                
                .activity-avatar.warning {
                    background: #ffc107;
                }
                
                .activity-avatar.info {
                    background: #17a2b8;
                }
                
                .activity-avatar.primary {
                    background: #007bff;
                }
                
                .activity-content {
                    flex: 1;
                }
                
                .activity-text {
                    color: var(--text-primary);
                    margin: 0 0 5px 0;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .activity-time {
                    color: var(--text-secondary);
                    font-size: 12px;
                }

                /* Quick Actions */
                .quick-actions {
                    display: grid;
                    gap: 15px;
                }
                
                .quick-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px 20px;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    font-weight: 500;
                    position: relative;
                    overflow: hidden;
                }
                
                .quick-action-btn::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 4px;
                    height: 100%;
                    background: var(--btn-accent);
                    transform: scaleY(0);
                    transition: transform 0.3s ease;
                }
                
                .quick-action-btn:hover::before {
                    transform: scaleY(1);
                }
                
                .quick-action-btn.primary {
                    --btn-accent: #007bff;
                }
                
                .quick-action-btn.success {
                    --btn-accent: #28a745;
                }
                
                .quick-action-btn.warning {
                    --btn-accent: #ffc107;
                }
                
                .quick-action-btn.info {
                    --btn-accent: #17a2b8;
                }
                
                .quick-action-btn:hover {
                    background: var(--bg-primary);
                    border-color: var(--btn-accent);
                    color: var(--btn-accent);
                    transform: translateX(5px);
                }
                
                .quick-action-btn i {
                    font-size: 18px;
                }

                /* Announcements */
                .announcements-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .announcement-item {
                    display: flex;
                    gap: 15px;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                }
                
                .announcement-item.important {
                    border-color: #ffc107;
                    background: rgba(255, 193, 7, 0.1);
                }
                
                .announcement-priority {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .announcement-item.important .announcement-priority {
                    background: #ffc107;
                    color: white;
                }
                
                .announcement-item.normal .announcement-priority {
                    background: #17a2b8;
                    color: white;
                }
                
                .announcement-content {
                    flex: 1;
                }
                
                .announcement-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0 0 8px 0;
                }
                
                .announcement-text {
                    color: var(--text-secondary);
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0 0 8px 0;
                }
                
                .announcement-date {
                    color: var(--text-secondary);
                    font-size: 12px;
                    font-weight: 500;
                }

                /* Responsive Design */
                @media (max-width: 968px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    }
                    
                    .welcome-section {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                }
                
                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .stat-card {
                        padding: 20px;
                    }
                    
                    .stat-number {
                        font-size: 24px;
                    }
                    
                    .card-content {
                        padding: 20px;
                    }
                    
                    .welcome-title {
                        font-size: 24px;
                    }
                }
            `}</style>
        </AdminLayout>
    );
}