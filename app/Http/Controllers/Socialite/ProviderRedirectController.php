<?php

namespace App\Http\Controllers\Socialite;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class ProviderRedirectController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $provider)
    {
        if (!in_array($provider, ['github', 'google'])) {
            return redirect()->route('login')->withErrors([
                'provider' => 'Invalid provider specified.'
            ]);
        }

        try{

            return Socialite::driver('google')->redirect();
        }catch (\Exception $e) {
            return redirect()->route('login')->withErrors([
                'provider' => 'Error occurred while redirecting to provider.'
            ]);

        }
        
    }
}
