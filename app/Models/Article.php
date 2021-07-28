<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'symbol',
        'url',
        'source',
        'headline',
        'summary',
        'image',
        'has_paywall',
        'published_at'
    ];

    public function position()
    {
        return $this->belongsTo(Position::class, 'symbol', 'symbol');
    }
}