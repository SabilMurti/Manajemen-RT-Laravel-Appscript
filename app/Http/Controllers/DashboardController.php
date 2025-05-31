<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\KasService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index(KasService $kasService)
{
    $kas = $kasService->getAll(); // ambil data dari Apps Script

    return Inertia::render('dashboard', [
        'kas' => $kas,
    ]);
}
}
