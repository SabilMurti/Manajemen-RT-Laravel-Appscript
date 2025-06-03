<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Services\KasService;
use App\Services\WargaService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Services\PengumumanService;


class DashboardController extends Controller
{
    public function index(
        KasService $kasService,
        WargaService $wargaService,
        PengumumanService $pengumumanService
    ) {
        $user = Auth::user();
        $warga = $wargaService->allWarga();
        $roles = User::pluck('role', 'id')->toArray();
        $statuses = User::pluck('status', 'id')->toArray();
        $pengumuman = $pengumumanService->getAll(); // ambil data dari Apps Script
        $kas = $kasService->getAll(); // ambil data dari Apps Script

        return Inertia::render('dashboard', [
            'kas' => $kas,
            'warga' => $warga,
            'userRoles' => $roles,
            'userStatuses' => $statuses,
            'availableRoles' => User::ROLES,
            'availableStatuses' => User::STATUSES,
            'pengumuman' => $pengumuman,
        ]);
    }
}
