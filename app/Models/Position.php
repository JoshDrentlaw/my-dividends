<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Account;
use App\Models\Dividend;
use App\Models\Article;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'symbol',
        'user_id',
        'price',
        'shares',
        'percent_of_account'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function dividends()
    {
        return $this->hasMany(Dividend::class);
    }

    public function articles()
    {
        return $this->hasMany(Article::class, 'symbol', 'symbol');
    }
}