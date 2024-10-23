<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

class AddHeader
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {       
        $cookieValue = Cookie::get('user_info');
        dd($cookieValue);
        $cookieValue = json_decode(decrypt_data($cookieValue, config('services.app.secret')),true);
        if(empty($cookieValue) || ($request->header('User-Agent') != $cookieValue['user_agent'] && $request->ip() != $cookieValue['ip_address']) ){
            auth()->logout();
            session()->flush();
            return redirect('/administrator/login')
                ->with('message', 'Your session has expired because you logged in from another device.');
        }
        $request->headers->set('Authorization', $cookieValue['token']);
        return $next($request);
    }
}
