<?php

use App\Http\Controllers\AccountsController;
use App\Http\Controllers\PositionsController;

use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Psy\Util\Str;
use Illuminate\Support\Facades\App;

use App\Models\User;
use App\Models\Position;
use App\Models\Article;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();
Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
});

Route::get('/auth/google/callback', function () {
    $user = Socialite::driver('google')->user();

    $user = User::firstOrCreate([
        'email' => $user->getEmail()
    ], [
        'name' => $user->getName(),
        'password' => Hash::make(random_int(24, 24))
    ]);

    Auth::login($user, true);

    return redirect('/dashboard');
});

Route::get('/auth/facebook/redirect', function () {
    return Socialite::driver('facebook')->redirect();
});

Route::get('/auth/facebook/callback', function () {
    $user = Socialite::driver('facebook')->user();

    $user = User::firstOrCreate([
        'email' => $user->getEmail()
    ], [
        'name' => $user->getName(),
        'password' => Hash::make(random_int(24, 24))
    ]);

    Auth::login($user, true);

    return redirect('/dashboard');
});

Route::get('/auth/twitter/redirect', function () {
    return Socialite::driver('twitter')->redirect();
});

Route::get('/auth/twitter/callback', function () {
    $user = Socialite::driver('twitter')->user();

    $user = User::firstOrCreate([
        'email' => $user->getEmail()
    ], [
        'name' => $user->getName(),
        'password' => Hash::make(random_int(24, 24))
    ]);

    Auth::login($user, true);

    return redirect('/dashboard');
});

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    $user = User::find(Auth::user()->id);
    $accounts = $user->accounts()->with(['positions', 'positions.articles', 'positions.dividends'])->get();

    return view('dashboard', compact('accounts'));
})->name('dashboard');

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::post('/accounts/create_account', [AccountsController::class, 'createAccount']);

    Route::post('/positions/store_user_positions', [PositionsController::class, 'storeUserPositions']);
    Route::post('/positions/upload_spreadsheets', [PositionsController::class, 'uploadSpreadsheets']);
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');