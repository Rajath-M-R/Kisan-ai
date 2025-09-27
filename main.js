// Smart Crop Advisory - Main JavaScript Functions

// Global variables
let currentUser = null;
let weatherData = null;
let cropData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadWeatherData();
    highlightActiveNavItem();
});

// Initialize application
function initializeApp() {
    console.log('Smart Crop Advisory System Initialized');
    
    // Load user data from localStorage if available
    const userData = localStorage.getItem('cropAdvisoryUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUserInterface();
    }
    
    // Initialize tooltips and other UI components
    initializeTooltips();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmission);
    });
    
    // Button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
}

// Handle form submissions
function handleFormSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formType = form.getAttribute('data-form-type');
    
    switch (formType) {
        case 'crop-selection':
            handleCropSelection(formData);
            break;
        case 'contact':
            handleContactForm(formData);
            break;
        case 'user-profile':
            handleUserProfile(formData);
            break;
        default:
            console.log('Form submitted:', Object.fromEntries(formData));
    }
}

// Handle button clicks
function handleButtonClick(event) {
    const button = event.target;
    const action = button.getAttribute('data-action');
    
    switch (action) {
        case 'get-started':
            window.location.href = 'crop-selection.html';
            break;
        case 'view-dashboard':
            window.location.href = 'dashboard.html';
            break;
        case 'get-advisory':
            generateAdvisory();
            break;
        case 'refresh-weather':
            loadWeatherData();
            break;
        default:
            console.log('Button clicked:', action);
    }
}

// Crop selection handler
function handleCropSelection(formData) {
    const cropData = {
        cropType: formData.get('cropType'),
        location: formData.get('location'),
        soilType: formData.get('soilType'),
        farmSize: formData.get('farmSize'),
        experience: formData.get('experience'),
        budget: formData.get('budget')
    };
    
    // Store crop data
    localStorage.setItem('selectedCropData', JSON.stringify(cropData));
    
    // Show loading state
    showLoading('Analyzing your crop selection...');
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        window.location.href = 'advisory.html';
    }, 2000);
}

// Generate advisory
function generateAdvisory() {
    const cropData = JSON.parse(localStorage.getItem('selectedCropData') || '{}');
    
    if (!cropData.cropType) {
        showAlert('Please select a crop first!', 'warning');
        return;
    }
    
    showLoading('Generating personalized advisory...');
    
    // Simulate API call to generate advisory
    setTimeout(() => {
        const advisory = generateMockAdvisory(cropData);
        displayAdvisory(advisory);
        hideLoading();
    }, 3000);
}

// Generate mock advisory data
function generateMockAdvisory(cropData) {
    const advisories = {
        wheat: {
            title: 'Wheat Cultivation Advisory',
            season: 'Rabi Season (October - April)',
            recommendations: [
                'Prepare field with proper plowing and leveling',
                'Use certified seeds at 100-125 kg per hectare',
                'Apply NPK fertilizer as per soil test recommendations',
                'Ensure proper irrigation at critical growth stages',
                'Monitor for pests like aphids and stem borer'
            ],
            expectedYield: '40-45 quintals per hectare',
            estimatedCost: '₹25,000 - ₹30,000 per hectare',
            marketPrice: '₹2,100 - ₹2,300 per quintal'
        },
        rice: {
            title: 'Rice Cultivation Advisory',
            season: 'Kharif Season (June - November)',
            recommendations: [
                'Prepare nursery beds 21 days before transplanting',
                'Maintain 2-3 cm water level in field',
                'Apply organic manure before final plowing',
                'Transplant 21-25 day old seedlings',
                'Monitor for blast and brown spot diseases'
            ],
            expectedYield: '50-60 quintals per hectare',
            estimatedCost: '₹35,000 - ₹40,000 per hectare',
            marketPrice: '₹1,900 - ₹2,100 per quintal'
        },
        cotton: {
            title: 'Cotton Cultivation Advisory',
            season: 'Kharif Season (May - December)',
            recommendations: [
                'Select Bt cotton varieties for better pest resistance',
                'Maintain 90cm x 45cm spacing between plants',
                'Apply balanced fertilization with micronutrients',
                'Regular monitoring for pink bollworm and whitefly',
                'Ensure proper drainage to prevent waterlogging'
            ],
            expectedYield: '15-20 quintals per hectare',
            estimatedCost: '₹45,000 - ₹55,000 per hectare',
            marketPrice: '₹5,500 - ₹6,200 per quintal'
        }
    };
    
    return advisories[cropData.cropType] || advisories.wheat;
}

// Display advisory
function displayAdvisory(advisory) {
    const advisoryContainer = document.getElementById('advisory-content');
    if (!advisoryContainer) return;
    
    advisoryContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">${advisory.title}</h2>
                <p><strong>Season:</strong> ${advisory.season}</p>
            </div>
            
            <div class="grid grid-2">
                <div>
                    <h3>Cultivation Recommendations</h3>
                    <ul>
                        ${advisory.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                
                <div>
                    <h3>Economic Analysis</h3>
                    <div class="alert alert-info">
                        <p><strong>Expected Yield:</strong> ${advisory.expectedYield}</p>
                        <p><strong>Estimated Cost:</strong> ${advisory.estimatedCost}</p>
                        <p><strong>Market Price:</strong> ${advisory.marketPrice}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Weather data functions
function loadWeatherData() {
    // Mock weather data - in real app, this would fetch from weather API
    weatherData = {
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
        humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
        rainfall: Math.floor(Math.random() * 50), // 0-50mm
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)]
    };
    
    updateWeatherWidget();
}

function updateWeatherWidget() {
    const weatherWidget = document.querySelector('.weather-widget');
    if (!weatherWidget || !weatherData) return;
    
    weatherWidget.innerHTML = `
        <h3>Current Weather</h3>
        <div class="weather-temp">${weatherData.temperature}°C</div>
        <p>${weatherData.condition}</p>
        <div class="weather-details">
            <p>Humidity: ${weatherData.humidity}%</p>
            <p>Wind: ${weatherData.windSpeed} km/h</p>
            <p>Rainfall: ${weatherData.rainfall}mm</p>
        </div>
    `;
}

// User interface functions
function updateUserInterface() {
    if (!currentUser) return;
    
    const userElements = document.querySelectorAll('[data-user-info]');
    userElements.forEach(element => {
        const infoType = element.getAttribute('data-user-info');
        if (currentUser[infoType]) {
            element.textContent = currentUser[infoType];
        }
    });
}

// Utility functions
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="close-alert" onclick="this.parentElement.remove()">×</button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.maxWidth = '400px';
    document.body.appendChild(container);
    return container;
}

function showLoading(message = 'Loading...') {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.7); display: flex; justify-content: center; 
                    align-items: center; z-index: 10000; color: white; font-size: 1.2rem;">
            <div style="text-align: center;">
                <div style="border: 4px solid #f3f3f3; border-top: 4px solid #4CAF50; 
                           border-radius: 50%; width: 50px; height: 50px; 
                           animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                ${message}
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

function highlightActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const element = event.target;
    const tooltipText = element.getAttribute('data-tooltip');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    element._tooltip = tooltip;
}

function hideTooltip(event) {
    const element = event.target;
    if (element._tooltip) {
        element._tooltip.remove();
        element._tooltip = null;
    }
}

// Export functions for use in other scripts
window.CropAdvisory = {
    showAlert,
    showLoading,
    hideLoading,
    loadWeatherData,
    generateAdvisory,
    handleCropSelection
};
