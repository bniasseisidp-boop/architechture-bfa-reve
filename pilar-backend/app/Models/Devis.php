<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Devis extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name', 'email', 'phone', 'project_type', 'budget',
        'message', 'status', 'admin_reply', 'replied_at'
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];
}
