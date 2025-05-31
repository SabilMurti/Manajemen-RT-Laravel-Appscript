<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    // …

    public const ROLE_PENDING = 'pending';
    public const ROLE_WARGA = 'warga';
    public const ROLE_BENDAHARA = 'bendahara';
    public const ROLE_SEKRETARIS = 'sekretaris';
    public const ROLE_ADMIN_RT = 'admin_rt';

    public const STATUS_WAITING = 'waiting';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    public const ROLES = [
        self::ROLE_PENDING,
        self::ROLE_WARGA,
        self::ROLE_BENDAHARA,
        self::ROLE_SEKRETARIS,
        self::ROLE_ADMIN_RT,
    ];

    public const STATUSES = [
        self::STATUS_WAITING,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
    ];

    // Helper check role
    public function isAdminRt(): bool
    {
        return $this->role === self::ROLE_ADMIN_RT;
    }

    public function isWarga(): bool
    {
        return $this->role === self::ROLE_WARGA;
    }

    // Helper check approved
    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_WAITING;
    }

    protected $fillable = [
        'name',
        'email',
        'role',
        'status',
        'password',
        'provider_id',
        'provider_name',
        'provider_token',
        'provider_refresh_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'provider_token',
        'provider_refresh_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
