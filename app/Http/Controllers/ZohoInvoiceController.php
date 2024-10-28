<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ZohoService;
use Illuminate\Http\Request;

class ZohoInvoiceController extends Controller
{
    public function refreshZoho($zohoCrmId,ZohoService $zs){
        $user = User::where('zoho_crm_id',$zohoCrmId)->first();
        if(empty($user))
            return response()->json(['message' => 'Zoho id is not synced', 'status' => 404, 'success' => false], 404);
        $result = $zs->refreshStudentPaymentDetails($user);
        return response()->json($result,$result['status']);
    }
}