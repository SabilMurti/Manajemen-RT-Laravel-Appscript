// File: layouts/user-layout.tsx
import React, { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

// Tipe untuk props
interface UserLayoutProps {
    children: ReactNode;
    title?: string;
}

// Tipe untuk user
interface User {
    name: string;
    id: number;
    avatar?: string;
    email?: string;
}

const HomeLayout: React.FC<UserLayoutProps> = ({ children, title = 'RT Warga' }) => {
    const { auth } = usePage().props as any;
    const user = auth?.user as User;

    // Mendapatkan inisial dari nama user untuk avatar
    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Navigation items for regular users
    const navigationItems = [
        { href: '/dashboard', icon: 'bi-house-fill', label: 'Home', active: window.location.pathname === '/dashboard' },
        { href: '/pengumuman', icon: 'bi-megaphone-fill', label: 'Pengumuman', active: window.location.pathname.includes('/pengumuman') },
        { href: '/laporan', icon: 'bi-file-earmark-text-fill', label: 'Laporan', active: window.location.pathname.includes('/laporan') },
        { href: '/pinjam-barang', icon: 'bi-box-seam-fill', label: 'Pinjam Barang', active: window.location.pathname.includes('/pinjam-barang') },
        { href: '/profile', icon: 'bi-person-fill', label: 'Profile', active: window.location.pathname.includes('/profile') },
    ];

    return (
        <>
            <Head title={title} />
            
            {/* Bootstrap 5.3 CSS */}
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                rel="stylesheet"
            />
            
            {/* Bootstrap Icons */}
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
                rel="stylesheet"
            />

            <div className="d-flex flex-column min-vh-100">
                {/* Top Navigation Bar */}
                <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
                    <div className="container">
                        {/* Brand */}
                        <Link href="/" className="navbar-brand d-flex align-items-center text-primary">
                            <div className="bg-primary rounded-3 p-2 px-2 me-3">
                                <i className="bi bi-houses-fill text-white px-2 fs-5"></i>
                            </div>
                            <span className="fw-bold fs-4">My RT</span>
                        </Link>

                        {/* Mobile toggle */}
                        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <i className="bi bi-list text-white fs-3"></i>
                        </button>

                        {/* Navigation Menu */}
                        <div className="colladpse navbar-colldapse" id="navbarNav">
                            <div className="d-flex align-items-center flex-grow-1">
                                {/* Empty center space for clean look */}
                            </div>

                            {/* User Menu */}
                            <ul className="navbar-nav">
                                {/* Notifications */}
                               
                                <li className="nav-item dropdown">
                                    <button className="btn bg-white shadow-sm d-flex align-items-center p-2" data-bs-toggle="dropdown">
                                        <div className="bg-light rounded-circle d-flex shadow-sm align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt="Avatar" className="rounded-circle" style={{width: '32px', height: '32px'}} />
                                            ) : (
                                                <span className="text-primary fw-bold small">{user?.name ? getUserInitials(user.name) : 'U'}</span>
                                            )}
                                        </div>
                                        <span className="fw-semibold d-none d-md-inline">{user?.name || 'User'}</span>
                                        <i className="bi bi-chevron-down ms-2"></i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><h6 className="dropdown-header">{user?.email}</h6></li>
                                        <li><Link className="dropdown-item" href="/profile"><i className="bi bi-person me-2"></i>Profile Saya</Link></li>
                                        <li><Link className="dropdown-item" href="/settings"><i className="bi bi-gear me-2"></i>Pengaturan</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <Link href="/logout" method="post" as="button" className="dropdown-item text-danger">
                                                <i className="bi bi-box-arrow-right me-2"></i>Keluar
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Breadcrumb (optional) */}
                <div className="bg-light border-bottom">
                    <div className="container">
                        <nav aria-label="breadcrumb" className="py-2">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link href="/dashboard" className="text-decoration-none">
                                        <i className="bi bi-house me-1"></i>Home
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">{title}</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-grow-1 bg-light">
                    <div className="container py-4">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                {/* <footer className="bg-dark text-light py-4 mt-auto">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h6 className="fw-bold">RT Portal</h6>
                                <p className="mb-0 text-muted">Portal resmi warga RT untuk kemudahan akses layanan</p>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <div className="d-flex justify-content-md-end gap-3">
                                    <Link href="/about" className="text-muted text-decoration-none">Tentang</Link>
                                    <Link href="/contact" className="text-muted text-decoration-none">Kontak</Link>
                                    <Link href="/help" className="text-muted text-decoration-none">Bantuan</Link>
                                </div>
                                <small className="text-muted mt-2 d-block">© 2024 RT Portal. All rights reserved.</small>
                            </div>
                        </div>
                    </div>
                </footer> */}

                {/* CuteFish Style Dock Navigation */}
                <nav className="dock-navigation">
                    <div className="dock-container">
                        {navigationItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`dock-item ${item.active ? 'active' : ''}`}
                                title={item.label}
                            >
                                <div className="dock-icon">
                                    <i className={`${item.icon}`}></i>
                                </div>
                                <span className="dock-label">{item.label}</span>
                                {item.active && <div className="dock-indicator"></div>}
                            </Link>
                        ))}

                        {/* Dock Separator */}
                        <div className="dock-separator"></div>

                        {/* Quick Actions */}
                        <div className="dropdown dropup">
                            <button className="dock-item" title="Quick Actions" data-bs-toggle="dropdown">
                                <div className="dock-icon">
                                    <i className="bi bi-plus-circle"></i>
                                </div>
                                <span className="dock-label">Quick</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end mb-3">
                                <li><h6 className="dropdown-header">Aksi Cepat</h6></li>
                                <li><Link className="dropdown-item" href="/laporan/create">
                                    <i className="bi bi-file-earmark-plus me-2 text-primary"></i>Buat Laporan
                                </Link></li>
                                <li><Link className="dropdown-item" href="/pinjam-barang/create">
                                    <i className="bi bi-box me-2 text-success"></i>Pinjam Barang
                                </Link></li>
                            </ul>
                        </div>

                        <Link href="/help" className="dock-item" title="Bantuan">
                            <div className="dock-icon">
                                <i className="bi bi-question-circle"></i>
                            </div>
                            <span className="dock-label">Bantuan</span>
                        </Link>
                    </div>
                </nav>


            </div>

            {/* Bootstrap JS Bundle */}
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
                defer
            ></script>

            {/* Custom CSS */}
            <style>{`
                /* Smooth transitions */
                .nav-link, .btn {
                    transition: all 0.2s ease;
                }
                
                .nav-link:hover {
                    transform: translateY(-1px);
                }
                
                .navbar-brand:hover {
                    transform: scale(1.02);
                    transition: transform 0.2s ease;
                }
                
                /* Custom hover effects */
                .btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                
                /* Mobile spacing for dock */
                @media (max-width: 991px) {
                    main {
                        padding-bottom: 100px;
                    }
                }
                
                /* CuteFish Style Dock Navigation */
                .dock-navigation {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                }
                
                .dock-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: rgba(255,255,255,0.95);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 20px;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                
                .dock-item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    background: transparent;
                    color: #6c757d;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    overflow: hidden;
                }
                
                .dock-item:hover {
                    background: rgba(13,110,253,0.1);
                    color: #0d6efd;
                    transform: translateY(-5px) scale(1.1);
                    text-decoration: none;
                }
                
                .dock-item.active {
                    background: #0d6efd;
                    color: white;
                    transform: translateY(-3px);
                }
                
                .dock-icon {
                    font-size: 20px;
                    margin-bottom: 2px;
                }
                
                .dock-label {
                    font-size: 10px;
                    font-weight: 500;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    white-space: nowrap;
                }
                
                .dock-item:hover .dock-label {
                    opacity: 1;
                }
                
                .dock-indicator {
                    position: absolute;
                    bottom: 4px;
                    width: 6px;
                    height: 6px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(255,255,255,0.5);
                }
                
                .dock-separator {
                    width: 1px;
                    height: 40px;
                    background: rgba(108,117,125,0.3);
                    margin: 0 4px;
                }
                
                /* Responsive dock */
                @media (max-width: 768px) {
                    .dock-container {
                        padding: 6px 8px;
                        gap: 4px;
                    }
                    
                    .dock-item {
                        width: 50px;
                        height: 50px;
                    }
                    
                    .dock-icon {
                        font-size: 18px;
                    }
                }
                
                /* Card hover effects */
                .card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                
                .card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
                
                /* Badge pulse animation */
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                .badge {
                    animation: pulse 2s infinite;
                }
            `}</style>
        </>
    );
};

export default HomeLayout;