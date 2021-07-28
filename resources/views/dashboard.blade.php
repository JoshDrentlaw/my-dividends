@extends('layouts.app')

@section('content')
    <div id="dashboard" class="py-4"></div>
@endsection

@section('components')
    <script>
        const iex_url = '{{ env('IEX_CLOUD_API_URL') }}';
        const iex_key = '{{ env('IEX_CLOUD_API_KEY') }}';

        const userAccounts = @json($accounts)
    </script>
    <script src="{{ asset('js/Dashboard.js') }}"></script>
@endsection
