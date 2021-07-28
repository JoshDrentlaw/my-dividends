<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use App\Models\User;
use App\Models\Account;
use App\Models\Position;
use App\Models\Dividend;
use Exception;

class PositionsController extends Controller
{
    public function storeUserPositions(Request $request)
    {
        $acct = $request->post('account');
        $user = User::find(Auth::user()->id);
        $account = Account::find($acct['id']);
        foreach ($request->post('positions') as $symbol => $s) {
            $position = $account->positions()->create([
                'symbol' => $symbol,
                'price' => $s['price']
            ]);

            if (isset($s['upcoming-dividends'][0])) {
                foreach ($s['upcoming-dividends'] as $div) {
                    $position->dividends()->create([
                        'dividend_amount' => $div['amount'],
                        'declare_date' => $div['declaredDate'],
                        'ex_date' => $div['exDate'],
                        'payment_date' => $div['paymentDate'],
                        'frequency' => $div['frequency']
                    ]);
                }
            }

            if (isset($s['news'][0])) {
                foreach ($s['news'] as $article) {
                    $position->articles()->create([
                        'url' => $article['url'],
                        'source' => $article['source'],
                        'headline' => $article['headline'],
                        'summary' => $article['summary'],
                        'image' => $article['image'],
                        'has_paywall' => $article['hasPaywall'],
                        'published_at' => date('Y-m-d H:i:s', $article['datetime'] / 1000)
                    ]);
                }
            }
        }

        return $account->positions()->with(['dividends', 'articles'])->get();
    }

    public function uploadSpreadsheets(Request $request)
    {
        $user = User::find(Auth::user()->id);
        $source = $request->post('source');
        $fileName = $source . '.csv';
        $path = $user->name . '/uploads/' . $source;
        $request->file('spreadsheet')->storeAs($path, $fileName);
        $contents = Storage::readStream($path . '/' . $fileName);
        $data = collect([]);
        $headers = fgetcsv($contents);

        while (!feof($contents)) {
            $line = fgetcsv($contents);

            if (isset($line[0]) && isset($line[1]) && isset($line[2]) && $line[2] !== 'Pending Activity') {
                $data->push(array_combine($headers, $line));
            }
        }
        Storage::delete($fileName);

        $accountName = false;
        $newSymbols = [];
        foreach ($data as $row) {
            if ($row['Description'] === 'FIDELITY GOVERNMENT MONEY MARKET') continue;
            if ($accountName !== $row['Account Name']) {
                $accountName = $row['Account Name'];

                $account = Account::where('user_id', $user->id)->where('account_name', $accountName)->get();
                if ($account->isEmpty()) {
                    $account = $user->accounts()->create([
                        'account_name' => $accountName,
                        'account_location' => $source
                    ]);
                }
            }
            $symbol = $row['Symbol'];
            $position = $account->positions()->firstWhere('symbol', $symbol);
            if (!$position) {
                $shares = 0;
                $newSymbols[] = $symbol;
                if ($row['Quantity']) {
                    $shares = $row['Quantity'];
                }
                $account->positions()->create([
                    'symbol' => $symbol,
                    'shares' => $shares
                ]);
            }
        }

        return [
            'accounts' => $user->accounts()->with(['positions'])->get()
        ];
    }
}