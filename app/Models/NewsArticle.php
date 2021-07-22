<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsArticle extends Model
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

    public function ticker()
    {
        return $this->belongsTo(Ticker::class, 'symbol', 'symbol');
    }
}