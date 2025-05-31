import React from 'react';
import { usePage } from '@inertiajs/react';
import HomeLayout from '../layouts/home/home-layout';

interface Pengumuman {
  id?: string;
  judul: string;
  isi: string;
  tanggal: string;
}

const Home: React.FC = () => {
  const pengumuman = (usePage().props as any).pengumuman as Pengumuman[] || [];

  return (
    <HomeLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Pengumuman Terbaru</h1>
        <ul className="space-y-4">
          {pengumuman.map((item) => (
            <li key={item.id} className="bg-white p-4 rounded shadow border">
              <h3 className="text-lg font-bold">{item.judul}</h3>
              <p className="text-sm text-gray-500">{item.tanggal}</p>
              <p className="mt-2">{item.isi}</p>
            </li>
          ))}
        </ul>
      </div>

    </HomeLayout>


  );
};

export default Home;
