<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticker extends Model
{
    use HasFactory;

    protected $fillable = [
        'symbol',
        'user_id',
        'price'
    ];

    public function User()
    {
        return $this->belongsTo(Ticker::class);
    }

    public function dividends()
    {
        return $this->hasMany(Dividend::class);
    }

    public function articles()
    {
        return $this->hasMany(NewsArticle::class, 'symbol', 'symbol');
    }
}