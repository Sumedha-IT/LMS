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
<<<<<<< HEAD
        dd($request->header('source') == 'zoho' , $request->header('x_auth') , config('services.zoho.x_auth'));
        
=======
        dd($request->header('source') == 'zoho' , $request->header('x_auth') == config('services.zoho.x_auth'),$request->header('source'),$request->header('x_auth') );

>>>>>>> 82e943fe1f4b3c19ddcd5470c7a9ae6c1e066d9f
        if($request->header('source') == 'zoho' && $request->header('x_auth') == config('services.zoho.x_auth')){
            return $next($request);
        }else{

            return response()->json(['message'=>'Unauthorised','status'=> 401 ,'success'=>false],401);
        }

        return $next($request);
    }
}
