<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\WargaService;
use App\Services\PengumumanService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class PengumumanController extends Controller
{
    public function __construct(
        protected WargaService $wargaService,
        protected PengumumanService $pengumumanService
    ) {}

    /**
     * Halaman utama untuk menampilkan pengumuman (untuk user biasa)
     */
    public function home(): Response
    {
        $pengumuman = $this->pengumumanService->getAll();

        return Inertia::render('home', [
            'pengumuman' => $pengumuman,
            'user' => Auth::user()
        ]);
    }

    /**
     * Halaman management pengumuman untuk admin
     */
    public function index(): Response
    {
        $pengumuman = $this->pengumumanService->getAll();
        // dd($pengumuman);
        //    dd($pengumuman);
        return Inertia::render('admin/pengumumanmanagement', [
            'pengumuman' => $pengumuman,
            'user' => Auth::user()
        ]);
    }

    /**
     * Alias untuk index method
     */
    public function management(): Response
    {
        return $this->index();
    }

    /**
     * Show detail pengumuman
     */
    public function show(string $id): Response
    {
        $pengumuman = $this->pengumumanService->getById($id);

        if (empty($pengumuman)) {
            abort(404, 'Pengumuman tidak ditemukan');
        }

        return Inertia::render('admin/pengumuman-detail', [
            'pengumuman' => $pengumuman,
            'user' => Auth::user()
        ]);
    }

    /**
     * Simpan pengumuman baru
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $this->validatePengumumanData($request);

            // Add metadata
            $warga = app(WargaService::class)->getWargaById(Auth::id());
            $validated['dibuat_oleh'] = $warga['nama'] ?? Auth::user()->name;
            $validated['pengumuman_id'] = Str::uuid()->toString();
            $validated['created_at'] = now()->toDateTimeString();

            $response = $this->pengumumanService->add($validated);

            if (isset($response['error'])) {
                return $this->redirectWithError($response['error']);
            }

            return redirect()->back()->with('success', 'Pengumuman berhasil ditambahkan');
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            return $this->redirectWithError('Gagal menambahkan pengumuman. Silakan coba lagi.');
        }
    }

    /**
     * Update pengumuman
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        try {
            $validated = $this->validatePengumumanData($request);

            // Add update metadata
            $warga = app(WargaService::class)->getWargaById(Auth::id());
            $validated['diperbarui_oleh'] = $warga['nama'] ?? Auth::user()->name;
            $validated['updated_at'] = now()->toDateTimeString();

            $response = $this->pengumumanService->update($id, $validated);

            if (isset($response['error'])) {
                return $this->redirectWithError($response['error']);
            }

            return redirect()->back()->with('success', 'Pengumuman berhasil diperbarui');
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            return $this->redirectWithError('Gagal memperbarui pengumuman. Silakan coba lagi.');
        }
    }

    /**
     * Hapus pengumuman
     */
    public function destroy(string $id): RedirectResponse
    {
        try {
            if (empty($id)) {
                return $this->redirectWithError('ID pengumuman tidak valid');
            }

            $response = $this->pengumumanService->delete($id);

            if (isset($response['error'])) {
                return $this->redirectWithError($response['error']);
            }

            return redirect()->back()->with('success', 'Pengumuman berhasil dihapus');
        } catch (\Exception $e) {
            return $this->redirectWithError('Gagal menghapus pengumuman. Silakan coba lagi.');
        }
    }

    /**
     * Bulk delete pengumuman
     */
    public function bulkDelete(Request $request): RedirectResponse
    {
        //    dd($request->all());
        try {
            $validated = $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|string'
            ]);

            // dd($validated);

            $success = 0;
            $failed = 0;

            foreach ($validated['ids'] as $id) {
                $response = $this->pengumumanService->delete($id);

                if (isset($response['error'])) {
                    $failed++;
                } else {
                    $success++;
                }
            }

            if ($success > 0 && $failed === 0) {
                return redirect()->back()->with('success', "Berhasil menghapus {$success} pengumuman");
            } elseif ($success > 0 && $failed > 0) {
                return redirect()->back()->with('warning', "Berhasil menghapus {$success} pengumuman, gagal menghapus {$failed} pengumuman");
            } else {
                return $this->redirectWithError('Gagal menghapus semua pengumuman yang dipilih');
            }
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return $this->redirectWithError('Gagal menghapus pengumuman. Silakan coba lagi.');
        }
    }

    /**
     * Validate pengumuman data
     */
    private function validatePengumumanData(Request $request): array
    {
        return $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string|max:5000',
            'tanggal' => 'required|date|after_or_equal:today',
            'prioritas' => 'sometimes|in:rendah,sedang,tinggi',
            'status' => 'sometimes|in:draft,published,archived'
        ], [
            'judul.required' => 'Judul pengumuman harus diisi',
            'judul.max' => 'Judul pengumuman maksimal 255 karakter',
            'isi.required' => 'Isi pengumuman harus diisi',
            'isi.max' => 'Isi pengumuman maksimal 5000 karakter',
            'tanggal.required' => 'Tanggal pengumuman harus diisi',
            'tanggal.date' => 'Format tanggal tidak valid',
            'tanggal.after_or_equal' => 'Tanggal pengumuman tidak boleh kurang dari hari ini',

        ]);
    }

    /**
     * Redirect with error message
     */
    private function redirectWithError(string $message): RedirectResponse
    {
        return redirect()->back()->with('error', $message);
    }
}
