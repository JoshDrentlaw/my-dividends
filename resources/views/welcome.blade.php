@extends('layouts.app')

@auth
    @section('content')
        <h1 class="text-center">
            Welcome to Dividend Hodlr
        </h1>
        <div class="text-center">All your dividends in one place, for one low monthly fee.</div>
    @endsection
@endauth

@guest
    @section('content')
        <h1 class="text-center">
            Welcome to Dividend Hodlr
        </h1>
        <div class="text-center mt-5">All your dividends in one place, for one low monthly fee.</div>
    @endsection
@endguest
