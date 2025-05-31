<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleAndStatusMiddleware
{
    public function handle(Request $request, Closure $next, ...$params)
    {
        $user = Auth::user();

        $role = $params[0] ?? null;
        $status = $params[1] ?? null;

        if (! $user) {
            abort(403, 'Not authenticated');
        }

        if ($role && $user->role !== $role) {
            abort(403, 'Akses ditolak karena role');
        }

        if ($status && $user->status !== $status) {
            abort(403, 'Akses ditolak karena status');
        }

        return $next($request);
    }
}
