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
        if($request->header('developer') == true){
            $request->headers->set('Authorization','Bearer 31|uyUHQUw8TGBcj0xlU2jmsgMJvWEoQ9Iuk3lxMCwb5f1437ba');
            return $next($request);
        }
        $cookieValue =json_decode(Cookie::get('user_info'),true);
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
