<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;

class PengumumanService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.rt_proxy.url');
        $this->apiKey = config('services.rt_proxy.key');
        $this->timeout = config('services.rt_proxy.timeout', 30);
    }

    /**
     * Get all pengumuman
     */
    public function getAll(): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->get($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'pengumuman',
                ]);

            if ($response->successful()) {
                return $response->json() ?? [];
            }

            Log::warning('PengumumanService::getAll failed', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [];
        } catch (RequestException $e) {
            Log::error('PengumumanService::getAll HTTP error', [
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            return [];
        } catch (\Throwable $e) {
            Log::error('PengumumanService::getAll unexpected error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }

    /**
     * Add new pengumuman
     */
    public function add(array $data): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'addPengumuman',
                    'data' => $data,
                ]);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Pengumuman berhasil ditambahkan', ['data' => $data]);
                return $result ?? ['success' => true];
            }

            Log::error('Failed to add pengumuman', [
                'status' => $response->status(),
                'response' => $response->body(),
                'data' => $data
            ]);

            return [
                'error' => 'Gagal menambahkan pengumuman.',
                'details' => $response->json()['message'] ?? 'Server error'
            ];

        } catch (RequestException $e) {
            Log::error('PengumumanService::add HTTP error', [
                'message' => $e->getMessage(),
                'data' => $data
            ]);
            return ['error' => 'Koneksi ke server gagal. Silakan coba lagi.'];
        } catch (\Throwable $e) {
            Log::error('PengumumanService::add unexpected error', [
                'message' => $e->getMessage(),
                'data' => $data
            ]);
            return ['error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'];
        }
    }

    /**
     * Update pengumuman
     */
    public function update(string $id, array $data): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'updatePengumuman',
                    'id' => $id,
                    'data' => $data,
                ]);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Pengumuman berhasil diperbarui', ['id' => $id, 'data' => $data]);
                return $result ?? ['success' => true];
            }

            Log::error('Failed to update pengumuman', [
                'id' => $id,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [
                'error' => 'Gagal memperbarui pengumuman.',
                'details' => $response->json()['message'] ?? 'Server error'
            ];

        } catch (RequestException $e) {
            Log::error('PengumumanService::update HTTP error', [
                'message' => $e->getMessage(),
                'id' => $id
            ]);
            return ['error' => 'Koneksi ke server gagal. Silakan coba lagi.'];
        } catch (\Throwable $e) {
            Log::error('PengumumanService::update unexpected error', [
                'message' => $e->getMessage(),
                'id' => $id
            ]);
            return ['error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'];
        }
    }

    /**
     * Delete pengumuman
     */
    public function delete(string $id): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'deletePengumuman',
                    'id' => $id,
                ]);
            
                

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Pengumuman berhasil dihapus', ['id' => $id]);
                return $result ?? ['success' => true];
            }

            Log::error('Failed to delete pengumuman', [
                'id' => $id,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [
                'error' => 'Gagal menghapus pengumuman.',
                'details' => $response->json()['message'] ?? 'Server error'
            ];

        } catch (RequestException $e) {
            Log::error('PengumumanService::delete HTTP error', [
                'message' => $e->getMessage(),
                'id' => $id
            ]);
            return ['error' => 'Koneksi ke server gagal. Silakan coba lagi.'];
        } catch (\Throwable $e) {
            Log::error('PengumumanService::delete unexpected error', [
                'message' => $e->getMessage(),
                'id' => $id
            ]);
            return ['error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'];
        }
    }

    /**
     * Get pengumuman by ID
     */
    public function getById(string $id): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->get($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'getPengumumanById',
                    'id' => $id,
                ]);

            if ($response->successful()) {
                return $response->json() ?? [];
            }

            Log::warning('PengumumanService::getById failed', [
                'id' => $id,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [];
        } catch (\Throwable $e) {
            Log::error('PengumumanService::getById error', [
                'message' => $e->getMessage(),
                'id' => $id
            ]);
            return [];
        }
    }
}