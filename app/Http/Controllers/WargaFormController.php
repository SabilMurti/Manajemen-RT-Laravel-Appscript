<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\WargaService;

class WargaFormController extends Controller
{
    public function __construct(protected WargaService $wargaService) {}

    /** Tampilkan form atau pesan pending */
    public function form()
    {
        $user = Auth::user();
        // Jika sudah approved, redirect ke dashboard warga
        if ($user->status === \App\Models\User::STATUS_APPROVED) {
            return redirect()->route('dashboard');
        }

        // Cek jika data di spreadsheet sudah ada (misal via service)
        $dataWarga = $this->wargaService->getWargaById($user->id ?? '');

        // dd($dataWarga);
        // Render Inertia page, terus pass data jika ada
        return Inertia::render('warga/form', [
            'data' => $dataWarga,
            'status' => $user->status,
            'role' => $user->role,
            'name' => $user->name,
        ]);

    }

    /** Simpan data ke spreadsheet via service & set status waiting */
    public function submit(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return redirect()->route('login')->with('error', 'Anda harus login terlebih dahulu.');
    }

    // Validasi input form
    $validated = $request->validate([
        'nama'      => 'required|string',
        'nik'       => 'required|string',
        'no_rumah'  => 'required|string',
        'no_hp'     => 'required|string',
    ]);

    // Kirim data ke Apps Script via service
    $res = $this->wargaService->addWarga($validated + [
        'user_id' => $user->id,
        'email'   => $user->email,
    ]);

    // Cek error dari response service dengan aman
    if (!empty($res['error'])) {
        $errorMessage = is_string($res['error']) ? $res['error'] : json_encode($res['error']);
        return back()->with('error', $errorMessage);
    }

    // Update status dan role user di Laravel
    $updated = $user->update([
        'role'   => 'warga',
        'status' => \App\Models\User::STATUS_WAITING,
    ]);

    if (!$updated) {
        return back()->with('error', 'Gagal memperbarui data user. Silakan coba lagi.');
    }

    // Redirect dengan pesan sukses
    return redirect()->route('warga.form')
                     ->with('success', 'Data diri berhasil dikirim. Silakan tunggu approval Ketua RT.');
}

}
