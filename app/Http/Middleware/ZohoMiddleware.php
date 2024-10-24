<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ZohoMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if($request->header('source') == 'zoho' && $request->header('x_auth_zoho') == config('services.zoho.x_auth')){
            return $next($request);
        }else{
            dd($request->header('source') , 'zoho' , $request->header('x_auth_zoho') , config('services.zoho.x_auth'));
            return response()->json(['message'=>'Unauthorised','status'=> 401 ,'success'=>false],401);
        }
        return $next($request);
    }
}
