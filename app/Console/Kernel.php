<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

use Illuminate\Support\Facades\Http;

use App\Models\User;
use App\Models\Ticker;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $tickers = Ticker::all();
            $getTickers = $tickers->unique('symbol');
            $symbols = join(',', $getTickers->pluck('symbol')->all());
            $data = Http::get(env('IEX_CLOUD_API_URL') . 'stock/market/batch', [
                'types' => 'price,upcoming-dividends',
                'symbols' => $symbols,
                'token' => env('IEX_CLOUD_API_KEY')
            ]);
            foreach ($data->json() as $symbol => $s) {
                Ticker::where('symbol', $symbol)
                    ->update([
                        'price' => $s['price']
                    ]);
            }
        })->weekdays()
            ->timezone('America/New_York')
            ->everyFourHours()
            ->between('9:00', '16:00');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}