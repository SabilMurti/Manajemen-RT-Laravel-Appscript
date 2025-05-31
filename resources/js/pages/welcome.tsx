import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {UserMenuContent} from '../components/user-menu-content';
import "../../css/welcome.css"


export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"></link>

            </Head>

            <div className="welcome-screen">
                <div className="row justify-content-center align-items-center h-100">
                    <div
                        className="col-12 col-md-6 text-center position-absolute welcome-image"

                    />
                    
                    <div className="col-12 col-md-8 text-center welcome-content">
                        <h1 className="welcome-text-large mb-5">
                            MY RT
                        </h1>
                        <h2 className="welcome-text-small">
                            aplikasi inovatif yang dirancang untuk mempermudah komunikasi dan pengelolaan keuangan RT. Warga dapat dengan mudah mengakses informasi penting, seperti jadwal kegiatan, pengumuman, dan laporan keuangan, sementara panitia RT memiliki fitur untuk mengelola catatan keuangan. Dengan fitur yang intuitif dan sistem yang terintegrasi, My RT membantu menciptakan lingkungan yang lebih tertata, transparan, dan harmonis bagi seluruh warga.
                        </h2>
                        {auth.user ? (
                            <a href={route('dashboard')} className="welcome-link">Dashboard</a>
                        ) : (
                            <a href={route('auth.redirect', 'google')} className="welcome-link">Login With <i className="bi bi-google"></i></a>
                        )}  

                     
                    </div>
                    <div className="corner">
                        <img 
                            src="https://i.postimg.cc/QMmn7DCk/1ccf6836142f55e313d997ec4187fb6b-removebg-preview.png" 
                            alt="corner" 
                            className="corner-image-left" 
                        />
                        <img 
                            src="https://i.postimg.cc/QMmn7DCk/1ccf6836142f55e313d997ec4187fb6b-removebg-preview.png" 
                            alt="corner" 
                            className="corner-image-right" 
                        />
                        <img 
                            src="https://i.postimg.cc/QMmn7DCk/1ccf6836142f55e313d997ec4187fb6b-removebg-preview.png" 
                            alt="corner" 
                            className="corner-image-left-2" 
                        />
                        <img 
                            src="https://i.postimg.cc/QMmn7DCk/1ccf6836142f55e313d997ec4187fb6b-removebg-preview.png" 
                            alt="corner" 
                            className="corner-image-right-2" 
                        />
                        <img 
                            src="https://i.postimg.cc/QMmn7DCk/1ccf6836142f55e313d997ec4187fb6b-removebg-preview.png" 
                            alt="corner" 
                            className="corner-image-bottom" 
                        />
                    </div>

                  
                </div>
            </div>


            {/* <Link
                href={route('login')}
                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
            >
                Log in
            </Link>
            <Link
                href={route('register')}
                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
            >
                Register
            </Link> */}
        </>
    );
}
