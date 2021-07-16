<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Models\Ticker;
use App\Models\Dividend;

class TickersController extends Controller
{
    public function storeUserTickers(Request $request)
    {
        $tickers = [];
        foreach ($request->post('tickers') as $symbol => $s) {
            $ticker = Ticker::create([
                'user_id' => Auth::user()->id,
                'symbol' => $symbol,
                'price' => $s['price']
            ]);

            if (isset($s['upcoming-dividends'][0])) {
                foreach ($s['upcoming-dividends'] as $div) {
                    $ticker->dividends()->create([
                        'dividend_amount' => $div['amount'],
                        'declare_date' => $div['declaredDate'],
                        'payment_date' => $div['paymentDate'],
                        'frequency' => $div['frequency']
                    ]);
                }
            }
            $tickers[] = $ticker->load(['dividends']);
        }

        return $tickers;
    }
}