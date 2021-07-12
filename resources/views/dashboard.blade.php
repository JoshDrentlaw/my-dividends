@extends('layouts.app')

@section('content')
    <div id="dashboard" class="py-4" tickers="{{ $tickers }}"></div>
@endsection

@section('components')
    <script src="{{ asset('js/Dashboard.js') }}"></script>
@endsection
