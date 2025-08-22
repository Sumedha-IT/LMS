<x-filament-panels::page>
    @if($showError ?? false)
        <style>
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
            
            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% {
                    transform: translate3d(0,0,0);
                }
                40%, 43% {
                    transform: translate3d(0, -30px, 0);
                }
                70% {
                    transform: translate3d(0, -15px, 0);
                }
                90% {
                    transform: translate3d(0, -4px, 0);
                }
            }
            
            @keyframes shake {
                0%, 100% {
                    transform: translateX(0);
                }
                10%, 30%, 50%, 70%, 90% {
                    transform: translateX(-10px);
                }
                20%, 40%, 60%, 80% {
                    transform: translateX(10px);
                }
            }
            
            .error-container {
                animation: fadeInUp 0.8s ease-out;
            }
            
            .error-icon {
                animation: bounce 2s infinite;
            }
            
            .error-card {
                animation: pulse 2s infinite;
                transition: all 0.3s ease;
            }
            
            .error-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            
            .shake-on-hover:hover {
                animation: shake 0.5s ease-in-out;
            }
        </style>

        <div class="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-gray-50 to-gray-100">
            <div class="error-container max-w-md w-full mx-4">
                <!-- Main Error Card -->
                <div class="error-card bg-white rounded-2xl shadow-2xl p-8 border border-red-200">
                    <!-- Animated Icon -->
                    <div class="text-center mb-6">
                        <div class="error-icon inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                        </div>
                    </div>

                    <!-- Title -->
                    <h2 class="text-2xl font-bold text-gray-800 text-center mb-3">
                        Access Restricted
                    </h2>

                    <!-- Message -->
                    <p class="text-gray-600 text-center mb-6 leading-relaxed">
                        {{ $errorMessage ?? 'You are not eligible for placement center access.' }}
                    </p>

                    <!-- Warning Box -->
                    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-6">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="h-6 w-6 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-yellow-800 font-medium">
                                    Contact Administrator
                                </p>
                                <p class="text-sm text-yellow-700 mt-1">
                                    Please contact your administrator to enable placement center access for your account.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button onclick="window.history.back()" class="shake-on-hover flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                            ← Go Back
                        </button>
                        <button onclick="window.location.reload()" class="shake-on-hover flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                            🔄 Refresh
                        </button>
                    </div>
                </div>

                <!-- Additional Info Card -->
                <div class="mt-6 bg-white rounded-lg shadow-lg p-4 border border-blue-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-blue-800">
                                <strong>Need Help?</strong> Contact your course coordinator or administrator for assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @else
        <div id="hello-react"></div>
        @viteReactRefresh
        @vite('resources/js/index.jsx')
    @endif
</x-filament-panels::page>