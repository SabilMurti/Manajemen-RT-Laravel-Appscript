<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserApprovedOrPending
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // Jika belum login, biarkan route guest
        if (! $user) {
            return $next($request);
        }

        // Jika status waiting (pending)
        if ($user->status === \App\Models\User::STATUS_WAITING) {
            // Jika sedang mengakses form data diri, lanjut
            if ($request->routeIs('warga.form') || $request->routeIs('warga.submit')) {
                return $next($request);
            }
            // Selain itu, redirect ke form dengan pesan pending
            return redirect()->route('warga.form')
                ->with('info', 'Profil Anda masih pending. Harap lengkapi/formulir data diri dan tunggu approval Ketua RT.');
        }

        // Jika sudah approved, user bisa akses semua route biasa
        return $next($request);
    }
}
