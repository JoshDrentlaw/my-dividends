<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>
    <div id="app" style="height:100vh;">
        @livewire('navigation-menu')

        <main class="py-4">
            @yield('content')
        </main>
        <p class="text-center mt-auto">
            <small><a href="https://iexcloud.io">Data provided by IEX Cloud</a></small> |
            Created by <a href="joshdrentlaw.com">Josh Drentlaw Web Design</a> 2021
        </p>
    </div>

    @yield('components')
</body>
</html>
