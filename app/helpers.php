<?php

if (!function_exists('encrypt_data')) {
    /**
     * Encrypt data using AES-256-CBC encryption
     *
     * @param string $data
     * @param string $secret_key
     * @return string
     */
    function encrypt_data($data, $secret_key)
    {
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $encrypted_data = openssl_encrypt($data, 'aes-256-cbc', $secret_key, 0, $iv);
        return base64_encode($encrypted_data) . '::' . base64_encode($iv);
    }
}

if (!function_exists('decrypt_data')) {
    /**
     * Decrypt data using AES-256-CBC decryption
     *
     * @param string $encrypted_data_with_iv
     * @param string $secret_key
     * @return string
     */
    function decrypt_data($encrypted_data_with_iv, $secret_key)
    {
        list($encrypted_data, $iv) = explode('::', urldecode($encrypted_data_with_iv));
        $encrypted_data = base64_decode($encrypted_data);
        $iv = base64_decode($iv);
        return openssl_decrypt($encrypted_data, 'aes-256-cbc', $secret_key, 0, $iv);
    }
}
