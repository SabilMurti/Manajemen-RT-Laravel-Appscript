// File: layouts/admin-layout.tsx
import React, { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

// Tipe untuk props
interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

// Tipe untuk user
interface User {
    name: string;
    id: number;
    avatar?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin Dashboard' }) => {
    const { auth } = usePage().props as any;
    const user = auth?.user as User;

    const userName = auth?.warga?.nama;



    // Mendapatkan inisial dari nama user untuk avatar
    const getUserInitials = (userName: string) => {
        return userName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Navigation items for admin   
    const navigationItems = [
        { href: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard', active: window.location.pathname === '/admin/dashboard' },
        { href: '/admin/warga', icon: 'bi-people-fill', label: 'Warga', active: window.location.pathname.includes('/admin/warga') },
        { href: '/admin/pengumuman', icon: 'bi-megaphone-fill', label: 'Pengumuman', active: window.location.pathname.includes('/admin/pengumuman') },
        { href: '/admin/kas', icon: 'bi-cash-stack', label: 'Kas', active: window.location.pathname.includes('/admin/kas') },

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

            <div className="d-flex flex-column min-vh-100 bg-light">
                {/* Top Navigation Bar */}
                <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
                    <div className="container-fluid px-4">
                        {/* Brand */}
                        <Link href="/admin/dashboard" className="navbar-brand d-flex align-items-center me-auto">
                            <div className="bg-primary rounded-3 p-2 me-3">
                                <i className="bi bi-shield-fill-check text-white fs-5"></i>
                            </div>
                            <span className="fw-bold fs-4 text-primary">RT Admin</span>
                        </Link>

                        {/* Mobile toggle */}
                        <div className="d-flex ms-auto">

                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="rounded-circle" style={{ width: '32px', height: '32px' }} />
                                ) : (
                                    <span className="text-white fw-bold small">{user?.name ? getUserInitials(user.name) : 'A'}</span>
                                )}
                            </div>
                            <span className="fw-semibold d-inline text-uppercase fw-bold mt-1">{userName}</span>
                        </div>




                        {/* Right side */}
                        <div className="" id="navbarNav">
                            <ul className="navbar-nav align-items-center">
                                {/* Notifications */}
                                <div className="nav-item dropdown">


                                    {/* <i className="bi bi-chevron-down ms-2"></i> */}

                                    <ul className="dropdown-menu dropdown-menu-end">
                                        {/* <li><Link className="dropdown-item" href="/admin/profile"><i className="bi bi-person me-2"></i>Profile</Link></li>
                                        <li><Link className="dropdown-item" href="/admin/settings"><i className="bi bi-gear me-2"></i>Pengaturan</Link></li> */}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <Link href="/logout" method="post" as="button" className="dropdown-item text-danger">
                                                <i className="bi bi-box-arrow-right me-2"></i>Logout
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                {/* User Menu */}


                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="container-fluid flex-grow-1">
                    <div className="row h-100">
                        {/* Sidebar */}
                        <div className="col-lg-2 col-md-3 bg-white shadow-sm p-0 d-none d-md-block">
                            <div className="p-3">
                                <h6 className="text-muted text-uppercase fw-bold small mb-3">Menu Utama</h6>
                                <nav className="nav flex-column">
                                    {navigationItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className={`nav-link rounded-3 mb-1 d-flex align-items-center ${item.active
                                                ? 'bg-primary text-white fw-semibold'
                                                : 'text-dark hover-bg-light'
                                                }`}
                                        >
                                            <i className={`${item.icon} me-3`}></i>
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </nav>

                                <hr className="my-4" />

                                <Link href="/logout" method="post" as="button" className="dropdown-item text-danger">
                                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                                </Link>

                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="col-lg-10 col-md-9 col-12">
                            <div className="p-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation for Mobile */}
                <nav className="navbar fixed-bottom bg-white border-top d-md-none">
                    <div className="container-fluid">
                        <div className="d-flex justify-content-around w-100">
                            {navigationItems.slice(0, 5).map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={`btn btn-sm d-flex flex-column align-items-center ${item.active ? 'text-primary fw-bold' : 'text-muted'
                                        }`}
                                >
                                    <i className={`${item.icon} fs-5`}></i>
                                    <small className="mt-1">{item.label.split(' ')[0]}</small>
                                </Link>
                            ))}
                            <Link href="/logout" method="post" as="button" className="btn btn-sm d-flex flex-column align-items-center">
                                <i className="bi bi-box-arrow-right fs-5"></i>
                                <small className="mt-1">Log-out</small>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Bootstrap JS Bundle */}
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
                defer
            ></script>

            {/* Custom CSS untuk styling tambahan */}
            <style>{`
                .hover-bg-light:hover {
                    background-color: #f8f9fa !important;
                }
                
                .nav-link {
                    transition: all 0.2s ease;
                }
                
                .nav-link:hover {
                    transform: translateX(5px);
                }
                
                .navbar-brand:hover {
                    transform: scale(1.02);
                    transition: transform 0.2s ease;
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
            `}</style>
        </>
    );
};

export default AdminLayout;
