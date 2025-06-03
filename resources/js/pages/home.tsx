import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import HomeLayout from '../layouts/home/home-layout';
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

interface Pengumuman {
  id?: string;
  judul: string;
  isi: string;
  tanggal: string;
}

const Home: React.FC = () => {
  const pengumuman = (usePage().props as any).pengumuman as Pengumuman[] || [];

  const { kas } = usePage().props as any;
  const [searchQuery, setSearchQuery] = useState('');


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

  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  // Urutkan berdasarkan tanggal terbaru
  const sortedPengumuman = [...pengumuman].sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
  );

  const totalPages = Math.ceil(sortedPengumuman.length / ITEMS_PER_PAGE);

  const paginatedPengumuman = sortedPengumuman.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <HomeLayout>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-8">
                <h1 className="text-2xl font-semibold mb-4">Pengumuman Terbaru</h1>
              </div>

            </div>

          </div>
          <div className="col-lg-8">
            <div className="p-6">
              <ul className="space-y-4">
                {paginatedPengumuman.map((item) => (
                  <li key={item.id} className="bg-white p-4 rounded shadow border">
                    <h3 className="text-lg font-bold">{item.judul}</h3>
                    <p className="text-sm text-gray-500">{item.tanggal}</p>
                    <p className="mt-2">{item.isi}</p>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              <div className="flex justify-center mt-6 space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="stat-card mb-4 bg-success text-white p-6 mt-5">
              <div className="stat-icon">
                <i className="bi bi-calendar-event-fill"></i>
              </div>
              <div className="stat-content ">
                <h3 className="stat-number  text-white">Rp. {totalSaldo.toLocaleString()}</h3>

                <p className="stat-label  text-white">Total Kas</p>

              </div>
            </div>
            <div className="card">

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
          </div>
        </div>
      </div>


    </HomeLayout>


  );
};

export default Home;
