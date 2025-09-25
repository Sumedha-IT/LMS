<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Program Fees Configuration
    |--------------------------------------------------------------------------
    |
    | These fees are used to calculate installment amounts for different programs.
    | You can change these values in the .env file without touching the code.
    |
    */

    'fees' => [
        'RISE' => env('PROGRAM_FEE_RISE', 126000),
        'STEP' => env('PROGRAM_FEE_STEP', 99000),
        'PAP' => env('PROGRAM_FEE_PAP', 0),
        'CEP/STEP' => env('PROGRAM_FEE_CEP_STEP', 99000),
        'CD - 50/50' => env('PROGRAM_FEE_CD_50_50', 0),
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Values
    |--------------------------------------------------------------------------
    |
    | Default fees if environment variables are not set
    |
    */
    'defaults' => [
        'RISE' => 126000,
        'STEP' => 99000,
        'PAP' => 0,
        'CEP/STEP' => 99000,
        'CD - 50/50' => 0,
    ],
];
