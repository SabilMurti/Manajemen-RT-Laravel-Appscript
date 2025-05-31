<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\KasService;
use App\Services\WargaService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class KasController extends Controller
{
    public function __construct(
        protected WargaService $wargaService,
        protected KasService $kasService
    ) {}

    /**
     * Halaman utama kas untuk user biasa
     */
    public function home(): Response
    {
        $kas = $this->kasService->getAll();

        return Inertia::render('home', [
            'kas' => $kas,
            'user' => Auth::user()
        ]);
    }

    /**
     * Halaman manajemen kas untuk admin
     */
    public function index(): Response
    {
        $kas = $this->kasService->getAll();

        return Inertia::render('admin/kasmanagement', [
            'kas' => $kas,
            'user' => Auth::user()
        ]);
    }

    public function management(): Response
    {
        return $this->index();
    }

    /**
     * Detail kas
     */
    public function show(string $id): Response
    {
        $kas = $this->kasService->getById($id);

        if (empty($kas)) {
            abort(404, 'Data kas tidak ditemukan');
        }

        return Inertia::render('admin/kas-detail', [
            'kas' => $kas,
            'user' => Auth::user()
        ]);
    }

    /**
     * Tambah kas baru
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $this->validateKasData($request);

            $validated['id'] = Str::uuid()->toString();
            $validated['tanggal'] = $validated['tanggal'] ?? now()->toDateString();

            $warga = app(WargaService::class)->getWargaById(Auth::id());
            $validated['oleh'] = $warga['nama'] ?? Auth::user()->name;

            $response = $this->kasService->add($validated);

            if (isset($response['error'])) {
                return $this->redirectWithError($response['error']);
            }

            return redirect()->back()->with('success', 'Data kas berhasil ditambahkan');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return $this->redirectWithError('Gagal menambahkan data kas. Silakan coba lagi.');
        }
    }

    /**
     * Update data kas
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        try {
            $validated = $this->validateKasData($request);

            $warga = app(WargaService::class)->getWargaById(Auth::id());
            $validated['oleh'] = $warga['nama'] ?? Auth::user()->name;

            $response = $this->kasService->update($id, $validated);

            if (isset($response['error'])) {
                return $this->redirectWithError($response['error']);
            }

            return redirect()->back()->with('success', 'Data kas berhasil diperbarui');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return $this->redirectWithError('Gagal memperbarui data kas. Silakan coba lagi.');
        }
    }

    /**
     * Hapus data kas
     */
    public function destroy(string $id): RedirectResponse
    {
        try {
            if (empty($id)) {
                return $this->redirectWithError('ID tidak valid');
            }

            $response = $this->kasService->delete($id);

            if (isset($response['error'])) {
                return $this->redirectWithError($response['error']);
            }

            return redirect()->back()->with('success', 'Data kas berhasil dihapus');
        } catch (\Exception $e) {
            return $this->redirectWithError('Gagal menghapus data kas. Silakan coba lagi.');
        }
    }

    /**
     * Hapus banyak data kas
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|string'
            ]);

            $success = 0;
            $failed = 0;

            foreach ($validated['ids'] as $id) {
                $response = $this->kasService->delete($id);
                if (isset($response['error'])) {
                    $failed++;
                } else {
                    $success++;
                }
            }

            if ($success > 0 && $failed === 0) {
                return redirect()->back()->with('success', "Berhasil menghapus {$success} data kas");
            } elseif ($success > 0 && $failed > 0) {
                return redirect()->back()->with('warning', "Berhasil menghapus {$success}, gagal {$failed}");
            } else {
                return $this->redirectWithError('Semua penghapusan data kas gagal');
            }
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return $this->redirectWithError('Gagal menghapus data kas. Silakan coba lagi.');
        }
    }

    /**
     * Validasi input data kas
     */
    private function validateKasData(Request $request): array
    {
        return $request->validate([
            'tanggal' => 'required|date',
            'tipe' => 'required|in:pemasukan,pengeluaran',
            'nominal' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string|max:1000',
        ], [
            'tanggal.required' => 'Tanggal wajib diisi',
            'tipe.required' => 'Tipe kas wajib diisi',
            'nominal.required' => 'Nominal wajib diisi',
            'nominal.numeric' => 'Nominal harus berupa angka',
        ]);
    }

    /**
     * Helper redirect error
     */
    private function redirectWithError(string $message): RedirectResponse
    {
        return redirect()->back()->with('error', $message);
    }
}
