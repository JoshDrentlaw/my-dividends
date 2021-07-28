<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\Account;
use App\Models\Position;

class AccountsController extends Controller
{
    public function createAccount(Request $request)
    {
        $verified = $request->validate([
            'account_name' => 'required'
        ]);
        $user = User::find(Auth::user()->id);
        $account = $user->accounts()->create([
            'account_name' => $verified['account_name'],
            'account_location' => $request->post('account_location')
        ]);

        return $user->accounts()->with(['positions'])->get();
    }
}