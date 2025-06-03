<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;

class KasService
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
     * Get all kas entries
     */
    public function getAll(): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->get($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'kas',
                ]);
            
                // dd($response->body());

            if ($response->successful()) {
                return $response->json() ?? [];
            }

            Log::warning('KasService::getAll failed', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [];
        } catch (RequestException $e) {
            Log::error('KasService::getAll HTTP error', [
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            return [];
        } catch (\Throwable $e) {
            Log::error('KasService::getAll unexpected error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }

    /**
     * Add new kas entry
     */
    public function add(array $data): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'addKas',
                    'data' => $data,
                ]);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Kas berhasil ditambahkan', ['data' => $data]);
                return $result ?? ['success' => true];
            }

            Log::error('Failed to add kas', [
                'status' => $response->status(),
                'response' => $response->body(),
                'data' => $data
            ]);

            return [
                'error' => 'Gagal menambahkan kas.',
                'details' => $response->json()['message'] ?? 'Server error'
            ];

        } catch (RequestException $e) {
            Log::error('KasService::add HTTP error', [
                'message' => $e->getMessage(),
                'data' => $data
            ]);
            return ['error' => 'Koneksi ke server gagal. Silakan coba lagi.'];
        } catch (\Throwable $e) {
            Log::error('KasService::add unexpected error', [
                'message' => $e->getMessage(),
                'data' => $data
            ]);
            return ['error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'];
        }
    }

    /**
     * Update kas entry
     */
    public function update(string $kasId, array $data): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'updateKas',
                    'id' => $kasId,
                    'data' => $data,
                ]);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Kas berhasil diperbarui', ['id' => $kasId, 'data' => $data]);
                return $result ?? ['success' => true];
            }

            Log::error('Failed to update kas', [
                'id' => $kasId,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [
                'error' => 'Gagal memperbarui kas.',
                'details' => $response->json()['message'] ?? 'Server error'
            ];

        } catch (RequestException $e) {
            Log::error('KasService::update HTTP error', [
                'message' => $e->getMessage(),
                'id' => $kasId
            ]);
            return ['error' => 'Koneksi ke server gagal. Silakan coba lagi.'];
        } catch (\Throwable $e) {
            Log::error('KasService::update unexpected error', [
                'message' => $e->getMessage(),
                'id' => $kasId
            ]);
            return ['error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'];
        }
    }

    /**
     * Delete kas entry
     */
    public function delete(string $kasId): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'deleteKas',
                    'id' => $kasId,
                ]);

        

            if ($response->successful()) {
                $result = $response->json();
                Log::info('Kas berhasil dihapus', ['id' => $kasId]);
                return $result ?? ['success' => true];
            }

            Log::error('Failed to delete kas', [
                'id' => $kasId,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [
                'error' => 'Gagal menghapus kas.',
                'details' => $response->json()['message'] ?? 'Server error'
            ];

        } catch (RequestException $e) {
            Log::error('KasService::delete HTTP error', [
                'message' => $e->getMessage(),
                'id' => $kasId
            ]);
            return ['error' => 'Koneksi ke server gagal. Silakan coba lagi.'];
        } catch (\Throwable $e) {
            Log::error('KasService::delete unexpected error', [
                'message' => $e->getMessage(),
                'id' => $kasId
            ]);
            return ['error' => 'Terjadi kesalahan sistem. Silakan coba lagi.'];
        }
    }

    /**
     * Get kas by ID
     */
    public function getById(string $kasId): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->get($this->baseUrl, [
                    'api_key' => $this->apiKey,
                    'action' => 'getKasById',
                    'id' => $kasId,
                ]);

            if ($response->successful()) {
                return $response->json() ?? [];
            }

            Log::warning('KasService::getById failed', [
                'id' => $kasId,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [];
        } catch (\Throwable $e) {
            Log::error('KasService::getById error', [
                'message' => $e->getMessage(),
                'id' => $kasId
            ]);
            return [];
        }
    }
}
