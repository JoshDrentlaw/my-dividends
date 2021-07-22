<nav x-data="{ open: false }" class="navbar navbar-expand-lg navbar-light bg-light">
    <!-- Primary Navigation Menu -->
    <div class="container-fluid">
        <a href="{{ route('dashboard') }}" class="navbar-brand">
            <x-jet-application-mark width="30" height="24" />
        </a>
        <!-- Hamburger -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-content" aria-controls="nav-content" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse pe-5" id="nav-content">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                @auth
                    <!-- Navigation Links -->
                    <li class="nav-item">
                        <x-jet-responsive-nav-link href="{{ route('dashboard') }}" :active="request()->routeIs('dashboard')">
                            {{ __('Dashboard') }}
                        </x-jet-responsive-nav-link>
                    </li>
                    <!-- Teams Dropdown -->
                    @if (Laravel\Jetstream\Jetstream::hasTeamFeatures())
                        <li class="nav-item dropdown">
                            <a href="" class="nav-link dropdown-toggle" id="teams-dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {{ Auth::user()->currentTeam->name }}
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="teams-dropdown">
                                <!-- Team Management -->
                                <li class="dropdown-item">
                                    <a href="#" class="dropdown-item">{{ __('Manage Team') }}</a>
                                </li>

                                <!-- Team Settings -->
                                <x-jet-dropdown-link href="{{ route('teams.show', Auth::user()->currentTeam->id) }}">
                                    {{ __('Team Settings') }}
                                </x-jet-dropdown-link>

                                @can('create', Laravel\Jetstream\Jetstream::newTeamModel())
                                    <x-jet-dropdown-link href="{{ route('teams.create') }}">
                                        {{ __('Create New Team') }}
                                    </x-jet-dropdown-link>
                                @endcan

                                <li class="border-t border-gray-100"></li>

                                <!-- Team Switcher -->
                                <li class="dropdown-item">
                                    {{ __('Switch Teams') }}
                                </li>

                                @foreach (Auth::user()->allTeams() as $team)
                                    <x-jet-switchable-team :team="$team" />
                                @endforeach
                            </ul>
                        </li>
                    @endif

                    <!-- Settings Dropdown -->
                    <li class="nav-item dropdown">
                        @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
                            <a class="nav-link dropdown-toggle" href="#" id="settings-dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img class="navbar-brand" src="{{ Auth::user()->profile_photo_url }}" alt="{{ Auth::user()->name }}" />
                            </a>
                        @else
                            <a type="button" class="nav-link dropdown-toggle" href="#" id="settings-dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {{ Auth::user()->name }}
                            </a>
                        @endif
                        <ul class="dropdown-menu" aria-labelledby="settings-dropdown">
                                <!-- Account Management -->
                            <div class="block px-4 py-2 text-xs text-gray-400">
                                {{ __('Manage Account') }}
                            </div>

                            <x-jet-dropdown-link href="{{ route('profile.show') }}">
                                {{ __('Profile') }}
                            </x-jet-dropdown-link>

                            @if (Laravel\Jetstream\Jetstream::hasApiFeatures())
                                <x-jet-dropdown-link href="{{ route('api-tokens.index') }}">
                                    {{ __('API Tokens') }}
                                </x-jet-dropdown-link>
                            @endif

                            <li><hr class="dropdown-liider"></li>

                            <!-- Authentication -->
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf

                                <x-jet-dropdown-link href="{{ route('logout') }}"
                                            onclick="event.preventDefault();
                                                this.closest('form').submit();">
                                    {{ __('Log Out') }}
                                </x-jet-dropdown-link>
                            </form>
                        </ul>
                    </li>
                @endauth

                @guest
                    <li><a href="/login" class="nav-link">Login</a></li>
                    <li><a href="/register" class="nav-link">Register</a></li>
                @endguest
            </ul>
        </div>
    </div>
</nav>
