<?php

use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Psy\Util\Str;
use App\Models\User;

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

    // $user->token
});

Route::get('/auth/twitter/redirect', function () {
    return Socialite::driver('twitter')->redirect();
});

Route::get('/auth/twitter/callback', function () {
    $user = Socialite::driver('twitter')->user();

    // $user->token
});

/* Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard'); */