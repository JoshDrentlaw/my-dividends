<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dividend extends Model
{
    use HasFactory;

    protected $fillable = [
        'dividend_amount',
        'declare_date',
        'payment_date',
        'frequency'
    ];

    public function ticker()
    {
        return $this->belongsTo(Ticker::class);
    }
}