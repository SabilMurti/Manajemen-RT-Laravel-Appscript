<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WargaController;
use App\Http\Controllers\Socialite\ProviderCallbackController;
use App\Http\Controllers\Socialite\ProviderRedirectController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\KasController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::middleware(['auth', 'role_status:admin_rt,approved'])->prefix('admin')->name('admin.')->group(function () {
    // Halaman management kas
    Route::get('kas', [KasController::class, 'index'])->name('kas.management');

    // Tambah data kas
    Route::post('kas', [KasController::class, 'store'])->name('kas.store');

    // Update data kas
    Route::put('kas/{id}', [KasController::class, 'update'])->name('kas.update');

    // Hapus data kas
    Route::delete('kas/{id}', [KasController::class, 'destroy'])->name('kas.destroy');

    // Bulk delete kas
    Route::post('kas/bulk-destroy', [KasController::class, 'bulkDestroy'])->name('kas.bulkDestroy');
});



Route::get('/auth/{provider}/redirect', ProviderRedirectController::class)->name('auth.redirect')->middleware('guest');
Route::get('/auth/{provider}/callback', ProviderCallbackController::class)->name('auth.callback');

// Route::middleware(['auth'])->group(function () {
//     Route::get('/warga', [WargaController::class, 'show'])->name('warga.show');
// });

use App\Http\Controllers\WargaFormController;
use App\Http\Controllers\HomeController;

// middleware: auth + approved_or_pending
Route::middleware(['auth', \App\Http\Middleware\EnsureUserApprovedOrPending::class])->group(function () {


    Route::get('/home', [HomeController::class, 'home'])->name('home');


    Route::middleware('role_status:admin_rt,approved')->group(function () {
        Route::get('/admin/pengumumanmanagement', [PengumumanController::class, 'management'])->name('pengumuman.management');
    });
    // form pengisian data diri
    Route::get('/wargai',   [WargaFormController::class, 'submit'])
        ->name('warga.form');
    Route::get('/warga/form',   [WargaFormController::class, 'form'])
        ->name('warga.form');
    Route::post('/warga/form',  [WargaFormController::class, 'submit'])
        ->name('warga.submit');

    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');


        Route::get('/dashboard', [DashboardController::class, 'index'])->name('index');
    // halaman data diri warga (approved only)
    // Route::get('/warga', [WargaController::class,'show'])
    //      ->name('warga.show')
    //      ->middleware('role_status:warga,approved');
});

Route::middleware(['auth', 'role_status:admin_rt,approved'])->prefix('admin')->name('admin.')->group(function () {
    // Daftar semua warga
    Route::get('warga', [WargaController::class, 'index'])->name('warga.index');

    // Form edit role & status
    Route::get('warga/{user}/edit', [WargaController::class, 'edit'])->name('warga.edit');

    // Simpan perubahan role/status
    Route::put('warga/{user}/', [WargaController::class, 'update'])->name('warga.update');
     Route::delete('warga/{id}', [WargaController::class, 'destroy'])->name('warga.destroy');
});

// Route untuk halaman management dan CRUD pengumuman
Route::middleware(['auth', 'role_status:admin_rt,approved'])->prefix('admin')->name('admin.')->group(function () {
    // Halaman management pengumuman
    Route::get('pengumuman', [PengumumanController::class, 'index'])->name('pengumuman.management');

    // Tambah pengumuman
    Route::post('pengumuman', [PengumumanController::class, 'store'])->name('pengumuman.store');

    // Update pengumuman
    Route::put('pengumuman/{id}', [PengumumanController::class, 'update'])->name('pengumuman.update');

    // Delete pengumuman
    Route::delete('pengumuman/{id}', [PengumumanController::class, 'destroy'])->name('pengumuman.destroy');

    Route::post('pengumuman/bulk-delete', [PengumumanController::class, 'bulkDelete'])->name('pengumuman.bulkDelete');
});






require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
