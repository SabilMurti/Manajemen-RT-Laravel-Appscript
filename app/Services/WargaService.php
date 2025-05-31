<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class WargaService
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.rt_proxy.key');
        $this->baseUrl = config('services.rt_proxy.url'); // Tanpa apiKey jika pakai OAuth
    }

    public function allWarga(): array
    {
        try {
            $url = $this->baseUrl . '?' . http_build_query([
                'api_key' => $this->apiKey,
                'action'  => 'allWarga',      // pastikan Apps Script routing-nya
            ]);

            $response = Http::get($url);
            if ($response->successful()) {
                return $response->json();
            }
            Log::error('WargaService::allWarga failed', ['body' => $response->body()]);
        } catch (\Throwable $e) {
            Log::error('WargaService::allWarga exception', ['msg' => $e->getMessage()]);
        }
        return [];
    }

    /** Update role & status di Laravel DB */
    public function updateUserRoleStatus(int $userId, string $role, string $status): void
    {
        $user = \App\Models\User::findOrFail($userId);
        $user->update(['role' => $role, 'status' => $status]);
    }
    public function getWargaById(string $userId): ?array
    {

        $url = $this->baseUrl . '?' . http_build_query([
            'api_key' => $this->apiKey,
            'action' => 'warga',
            'user_id' => $userId,
        ]);


        $response = Http::get($url);
        // dd($response->body());

        $data = $response->json();

        return $data;
    }


    public function addWarga(array $data): array
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl, [
                'api_key' => $this->apiKey,
                'action'  => 'addWarga',
                'data'    => $data,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Failed to add warga', ['response' => $response->body()]);
            return ['error' => 'Gagal menambahkan data warga.'];
        } catch (\Throwable $e) {
            Log::error('Exception saat addWarga', ['message' => $e->getMessage()]);
            return ['error' => 'Terjadi kesalahan saat menghubungi server.'];
        }
    }
}
