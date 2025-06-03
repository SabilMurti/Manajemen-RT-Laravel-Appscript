<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\KasService;

use App\Services\PengumumanService;

class HomeController extends Controller
{


    public function home(
        KasService $kasService,

        PengumumanService $pengumumanService
    ) {

        $kas = $kasService->getAll();
        $pengumuman = $pengumumanService->getAll(); // ambil data dari Apps Script

        return Inertia::render('home', [
            'kas' => $kas,
            'pengumuman' => $pengumuman,

        ]);
    }
}
