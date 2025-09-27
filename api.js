/**
 * Kisan AI - Frontend API Integration
 * ===================================
 * 
 * This module handles communication between the frontend and Flask backend API.
 * It provides functions to make crop predictions and handle API responses.
 */

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3
};

// API Endpoints
const ENDPOINTS = {
    HEALTH: '/health',
    PREDICT: '/predict',
    MODEL_INFO: '/model-info'
};

/**
 * Make HTTP request with error handling and retry logic
 */
async function makeRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: API_CONFIG.TIMEOUT
    };

    const requestOptions = { ...defaultOptions, ...options };
    
    for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout);
            
            const response = await fetch(url, {
                ...requestOptions,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return { success: true, data };
            
        } catch (error) {
            console.warn(`API request attempt ${attempt} failed:`, error.message);
            
            if (attempt === API_CONFIG.RETRY_ATTEMPTS) {
                return {
                    success: false,
                    error: error.message,
                    isNetworkError: error.name === 'AbortError' || error.name === 'TypeError'
                };
            }
            
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
}

/**
 * Check if the backend API is available
 */
async function checkAPIHealth() {
    console.log('🔍 Checking API health...');
    
    const result = await makeRequest(`${API_CONFIG.BASE_URL}${ENDPOINTS.HEALTH}`);
    
    if (result.success) {
        console.log('✅ API is healthy:', result.data);
        return {
            isHealthy: true,
            modelLoaded: result.data.model_loaded,
            message: result.data.message
        };
    } else {
        console.error('❌ API health check failed:', result.error);
        return {
            isHealthy: false,
            error: result.error,
            isNetworkError: result.isNetworkError
        };
    }
}

/**
 * Get model information from the backend
 */
async function getModelInfo() {
    console.log('📊 Fetching model information...');
    
    const result = await makeRequest(`${API_CONFIG.BASE_URL}${ENDPOINTS.MODEL_INFO}`);
    
    if (result.success) {
        console.log('✅ Model info retrieved:', result.data);
        return {
            success: true,
            modelInfo: result.data
        };
    } else {
        console.error('❌ Failed to get model info:', result.error);
        return {
            success: false,
            error: result.error
        };
    }
}

/**
 * Make crop prediction using the ML model
 */
async function predictCrop(farmData) {
    console.log('🔮 Making crop prediction...', farmData);
    
    // Validate input data
    const validationResult = validatePredictionInput(farmData);
    if (!validationResult.isValid) {
        return {
            success: false,
            error: validationResult.error,
            isValidationError: true
        };
    }
    
    const result = await makeRequest(`${API_CONFIG.BASE_URL}${ENDPOINTS.PREDICT}`, {
        method: 'POST',
        body: JSON.stringify(farmData)
    });
    
    if (result.success) {
        console.log('✅ Prediction successful:', result.data);
        return {
            success: true,
            prediction: result.data.prediction,
            inputParameters: result.data.input_parameters,
            timestamp: result.data.timestamp
        };
    } else {
        console.error('❌ Prediction failed:', result.error);
        return {
            success: false,
            error: result.error,
            isNetworkError: result.isNetworkError
        };
    }
}

/**
 * Validate prediction input data
 */
function validatePredictionInput(data) {
    const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'soil_type', 'season'];
    const numericFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
    const validSoilTypes = ['Loamy', 'Sandy', 'Clayey', 'Black', 'Red'];
    const validSeasons = ['Kharif', 'Rabi', 'Zaid', 'Whole Year'];
    
    // Check required fields
    for (const field of requiredFields) {
        if (!(field in data) || data[field] === null || data[field] === undefined || data[field] === '') {
            return {
                isValid: false,
                error: `Missing required field: ${field}`
            };
        }
    }
    
    // Validate numeric fields
    for (const field of numericFields) {
        const value = parseFloat(data[field]);
        if (isNaN(value) || value < 0) {
            return {
                isValid: false,
                error: `${field} must be a non-negative number`
            };
        }
    }
    
    // Validate categorical fields
    if (!validSoilTypes.includes(data.soil_type)) {
        return {
            isValid: false,
            error: `Invalid soil_type. Must be one of: ${validSoilTypes.join(', ')}`
        };
    }
    
    if (!validSeasons.includes(data.season)) {
        return {
            isValid: false,
            error: `Invalid season. Must be one of: ${validSeasons.join(', ')}`
        };
    }
    
    return { isValid: true };
}

/**
 * Convert form data to API format
 */
function formatFormDataForAPI(formData) {
    return {
        N: parseFloat(formData.nitrogen || formData.N || 0),
        P: parseFloat(formData.phosphorus || formData.P || 0),
        K: parseFloat(formData.potassium || formData.K || 0),
        temperature: parseFloat(formData.temperature || 25),
        humidity: parseFloat(formData.humidity || 70),
        ph: parseFloat(formData.ph || 6.5),
        rainfall: parseFloat(formData.rainfall || 100),
        soil_type: formData.soil_type || formData.soilType || 'Loamy',
        season: formData.season || 'Kharif'
    };
}

/**
 * Display prediction results in the UI
 */
function displayPredictionResults(prediction, containerId = 'prediction-results') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Prediction results container not found');
        return;
    }
    
    const { predicted_crop, confidence, top_recommendations } = prediction;
    
    const html = `
        <div class="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <div class="text-center mb-6">
                <div class="text-6xl mb-4">🌾</div>
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Crop Recommendation</h2>
                <p class="text-gray-600">Based on your farm conditions</p>
            </div>
            
            <div class="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <div class="text-center">
                    <h3 class="text-2xl font-bold text-farm-green mb-2">Recommended Crop</h3>
                    <div class="text-4xl font-bold text-farm-green mb-2">${predicted_crop}</div>
                    <div class="text-lg text-gray-600">Confidence: ${confidence}%</div>
                </div>
            </div>
            
            ${top_recommendations && top_recommendations.length > 1 ? `
                <div class="mb-6">
                    <h4 class="text-xl font-bold text-gray-800 mb-4">Alternative Recommendations</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${top_recommendations.slice(1, 4).map(rec => `
                            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                <div class="text-lg font-semibold text-gray-800">${rec.crop}</div>
                                <div class="text-sm text-gray-600">${rec.confidence}% confidence</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="text-center">
                <a href="advisory.html" class="bg-farm-green text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-farm-dark transition-colors">
                    Get Detailed Advisory
                </a>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Display error message in the UI
 */
function displayError(error, containerId = 'prediction-results') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Error container not found');
        return;
    }
    
    const html = `
        <div class="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <div class="text-center">
                <div class="text-6xl mb-4">⚠️</div>
                <h2 class="text-2xl font-bold text-red-600 mb-4">Prediction Error</h2>
                <p class="text-gray-600 mb-6">${error}</p>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
                    Close
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * Initialize API connection and check health
 */
async function initializeAPI() {
    console.log('🚀 Initializing API connection...');
    
    const healthCheck = await checkAPIHealth();
    
    if (healthCheck.isHealthy) {
        console.log('✅ API initialized successfully');
        
        // Store API status globally
        window.CropAdvisoryAPI = {
            isAvailable: true,
            modelLoaded: healthCheck.modelLoaded,
            predictCrop,
            checkAPIHealth,
            getModelInfo
        };
        
        return true;
    } else {
        console.warn('⚠️ API not available:', healthCheck.error);
        
        // Store API status globally
        window.CropAdvisoryAPI = {
            isAvailable: false,
            error: healthCheck.error,
            isNetworkError: healthCheck.isNetworkError
        };
        
        return false;
    }
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.CropAdvisoryAPI = {
        predictCrop,
        checkAPIHealth,
        getModelInfo,
        formatFormDataForAPI,
        displayPredictionResults,
        displayError,
        initializeAPI
    };
}

// Auto-initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeAPI);
}
