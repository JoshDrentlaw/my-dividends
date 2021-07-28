<?php

namespace App\Console;

use App\Models\Article;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

use Illuminate\Support\Facades\Http;

use App\Models\User;
use App\Models\Position;

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
        // UPDATE SYMBOL PRICES
        $schedule->call(function () {
            $positions = Position::all();
            $getPositions = $positions->unique('symbol');
            $symbols = join(',', $getPositions->pluck('symbol')->all());
            $data = Http::get(env('IEX_CLOUD_API_URL') . 'stock/market/batch', [
                'types' => 'price',
                'symbols' => $symbols,
                'token' => env('IEX_CLOUD_API_KEY')
            ]);
            foreach ($data->json() as $symbol => $s) {
                Position::where('symbol', $symbol)
                    ->update([
                        'price' => $s['price']
                    ]);
            }
        })->weekdays()
            ->timezone('America/New_York')
            ->everyFourHours()
            ->between('9:00', '16:00');

        // UPDATE NEWS ARTICLES
        $schedule->call(function () {
            $positions = Position::all();
            $getPositions = $positions->unique('symbol');
            $symbols = join(',', $getPositions->pluck('symbol')->all());
            $data = Http::get(env('IEX_CLOUD_API_URL') . 'stock/market/batch', [
                'types' => 'news',
                'symbols' => $symbols,
                'token' => env('IEX_CLOUD_API_KEY')
            ]);
            foreach ($data->json() as $symbol => $s) {
                if (isset($s['news'][0])) {
                    Article::where('symbol', $symbol)->delete();
                    foreach ($s['news'] as $article) {
                        Article::create([
                            'symbol' => $symbol,
                            'url' => $article['url'],
                            'source' => $article['source'],
                            'headline' => $article['headline'],
                            'summary' => $article['summary'],
                            'image' => $article['image'],
                            'has_paywall' => $article['hasPaywall'],
                            'published_at' => $article['datetime']
                        ]);
                    }
                }
            }
        })->weekdays()
            ->timezone('America/New_York')
            ->hourly()
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