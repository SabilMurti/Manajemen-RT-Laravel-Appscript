<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Services\WargaService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class WargaController extends Controller
{
    public function __construct(
        protected WargaService $wargaService
    ) {}

    public function show()
    {
        $user = Auth::user();
        $warga = $this->wargaService->getWargaById($user->id);

        return response()->json(['warga' => $warga]);
    }

    public function index()
    {
        $allWarga = $this->wargaService->allWarga();

        $roles = User::pluck('role', 'id')->toArray();
        $statuses = User::pluck('status', 'id')->toArray();

        return Inertia::render('admin/wargamanagement', [
            'wargaList' => $allWarga,
            'userRoles' => $roles,
            'userStatuses' => $statuses,
            'availableRoles' => User::ROLES,
            'availableStatuses' => User::STATUSES,
        ]);
    }

    public function update(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $data = $request->only(['role', 'status']);

        if (isset($data['role'])) {
            if (!in_array($data['role'], User::ROLES)) {
                return back()->withErrors(['role' => 'Role tidak valid.']);
            }
        }

        if (isset($data['status'])) {
            if (!in_array($data['status'], User::STATUSES)) {
                return back()->withErrors(['status' => 'Status tidak valid.']);
            }
        }

        $user->update($data);

        return back()->with('success', 'Data warga berhasil diperbarui.');
    }


    public function destroy($userId)
    {
        $user = User::findOrFail($userId);
        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}
