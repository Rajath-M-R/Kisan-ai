// Kisan AI - Main JavaScript File

// Language data
const translations = {
    en: {
        // Navigation
        home: "Home",
        dashboard: "Dashboard", 
        cropSelection: "Crop Selection",
        advisory: "Advisory",
        help: "Help",
        
        // Landing Page
        heroTitle: "Kisan AI",
        heroSubtitle: "Get AI-powered farming recommendations for better yields and profits",
        getStarted: "Get Started",
        learnMore: "Learn More",
        
        // Features
        weatherTitle: "Weather Insights",
        weatherDesc: "Real-time weather data and forecasts for your farm",
        cropTitle: "Crop Recommendations", 
        cropDesc: "AI-powered suggestions based on your soil and climate",
        marketTitle: "Market Prices",
        marketDesc: "Latest market trends and pricing information",
        
        // Dashboard
        welcomeBack: "Welcome Back, Farmer!",
        todayWeather: "Today's Weather",
        cropAdvisory: "Crop Advisory",
        alerts: "Alerts & Notifications",
        temperature: "Temperature",
        humidity: "Humidity",
        rainfall: "Rainfall",
        
        // Crop Selection
        selectCrop: "Select Your Crop",
        soilType: "Soil Type",
        season: "Season",
        waterAvailability: "Water Availability",
        getRecommendations: "Get Recommendations",
        
        // Soil Types
        clayey: "Clayey",
        loamy: "Loamy", 
        sandy: "Sandy",
        blackSoil: "Black Soil",
        
        // Seasons
        kharif: "Kharif (Monsoon)",
        rabi: "Rabi (Winter)",
        zaid: "Zaid (Summer)",
        
        // Water Availability
        abundant: "Abundant",
        moderate: "Moderate",
        scarce: "Scarce",
        
        // Advisory
        seedSuggestions: "Seed Suggestions",
        fertilizerSchedule: "Fertilizer Schedule",
        pestAlerts: "Pest Alerts",
        marketTrends: "Market Price Trends",
        
        // Help
        faqTitle: "Frequently Asked Questions",
        chatbotTitle: "Chat Support",
        contactUs: "Contact Us"
    },
    hi: {
        // Navigation
        home: "होम",
        dashboard: "डैशबोर्ड",
        cropSelection: "फसल चयन", 
        advisory: "सलाह",
        help: "सहायता",
        
        // Landing Page
        heroTitle: "किसान AI",
        heroSubtitle: "बेहतर उपज और मुनाफे के लिए AI-संचालित कृषि सिफारिशें प्राप्त करें",
        getStarted: "शुरू करें",
        learnMore: "और जानें",
        
        // Features
        weatherTitle: "मौसम की जानकारी",
        weatherDesc: "आपके खेत के लिए वास्तविक समय मौसम डेटा और पूर्वानुमान",
        cropTitle: "फसल की सिफारिशें",
        cropDesc: "आपकी मिट्टी और जलवायु के आधार पर AI-संचालित सुझाव",
        marketTitle: "बाजार की कीमतें",
        marketDesc: "नवीनतम बाजार रुझान और मूल्य निर्धारण की जानकारी",
        
        // Dashboard
        welcomeBack: "वापस स्वागत है, किसान जी!",
        todayWeather: "आज का मौसम",
        cropAdvisory: "फसल सलाह",
        alerts: "अलर्ट और सूचनाएं",
        temperature: "तापमान",
        humidity: "आर्द्रता", 
        rainfall: "वर्षा",
        
        // Crop Selection
        selectCrop: "अपनी फसल चुनें",
        soilType: "मिट्टी का प्रकार",
        season: "मौसम",
        waterAvailability: "पानी की उपलब्धता",
        getRecommendations: "सिफारिशें प्राप्त करें",
        
        // Soil Types
        clayey: "चिकनी मिट्टी",
        loamy: "दोमट मिट्टी",
        sandy: "बलुई मिट्टी", 
        blackSoil: "काली मिट्टी",
        
        // Seasons
        kharif: "खरीफ (मानसून)",
        rabi: "रबी (सर्दी)",
        zaid: "जायद (गर्मी)",
        
        // Water Availability
        abundant: "प्रचुर",
        moderate: "मध्यम",
        scarce: "कम",
        
        // Advisory
        seedSuggestions: "बीज सुझाव",
        fertilizerSchedule: "उर्वरक अनुसूची",
        pestAlerts: "कीट अलर्ट",
        marketTrends: "बाजार मूल्य रुझान",
        
        // Help
        faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
        chatbotTitle: "चैट सहायता",
        contactUs: "संपर्क करें"
    },
    kn: {
        // Navigation
        home: "ಮನೆ",
        dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        cropSelection: "ಬೆಳೆ ಆಯ್ಕೆ",
        advisory: "ಸಲಹೆ",
        help: "ಸಹಾಯ",
        
        // Landing Page
        heroTitle: "ಕಿಸಾನ್ AI",
        heroSubtitle: "ಉತ್ತಮ ಇಳುವರಿ ಮತ್ತು ಲಾಭಕ್ಕಾಗಿ AI-ಚಾಲಿತ ಕೃಷಿ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ",
        getStarted: "ಪ್ರಾರಂಭಿಸಿ",
        learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
        
        // Features
        weatherTitle: "ಹವಾಮಾನ ಮಾಹಿತಿ",
        weatherDesc: "ನಿಮ್ಮ ಫಾರ್ಮ್‌ಗಾಗಿ ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ಡೇಟಾ ಮತ್ತು ಮುನ್ನೋಟಗಳು",
        cropTitle: "ಬೆಳೆ ಶಿಫಾರಸುಗಳು",
        cropDesc: "ನಿಮ್ಮ ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನವನ್ನು ಆಧರಿಸಿದ AI-ಚಾಲಿತ ಸಲಹೆಗಳು",
        marketTitle: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
        marketDesc: "ಇತ್ತೀಚಿನ ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳು ಮತ್ತು ಬೆಲೆ ಮಾಹಿತಿ",
        
        // Dashboard
        welcomeBack: "ಮರಳಿ ಸ್ವಾಗತ, ರೈತರೇ!",
        todayWeather: "ಇಂದಿನ ಹವಾಮಾನ",
        cropAdvisory: "ಬೆಳೆ ಸಲಹೆ",
        alerts: "ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸೂಚನೆಗಳು",
        temperature: "ತಾಪಮಾನ",
        humidity: "ಆರ್ದ್ರತೆ",
        rainfall: "ಮಳೆ",
        
        // Crop Selection
        selectCrop: "ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        soilType: "ಮಣ್ಣಿನ ಪ್ರಕಾರ",
        season: "ಋತು",
        waterAvailability: "ನೀರಿನ ಲಭ್ಯತೆ",
        getRecommendations: "ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ",
        
        // Soil Types
        clayey: "ಜೇಡಿಮಣ್ಣು",
        loamy: "ಮಿಶ್ರ ಮಣ್ಣು",
        sandy: "ಮರಳು ಮಣ್ಣು",
        blackSoil: "ಕಪ್ಪು ಮಣ್ಣು",
        
        // Seasons
        kharif: "ಖರೀಫ್ (ಮಾನ್ಸೂನ್)",
        rabi: "ರಬಿ (ಚಳಿಗಾಲ)",
        zaid: "ಜಾಯಿದ್ (ಬೇಸಿಗೆ)",
        
        // Water Availability
        abundant: "ಸಮೃದ್ಧ",
        moderate: "ಮಧ್ಯಮ",
        scarce: "ಕೊರತೆ",
        
        // Advisory
        seedSuggestions: "ಬೀಜ ಸಲಹೆಗಳು",
        fertilizerSchedule: "ಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ",
        pestAlerts: "ಕೀಟ ಎಚ್ಚರಿಕೆಗಳು",
        marketTrends: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಪ್ರವೃತ್ತಿಗಳು",
        
        // Help
        faqTitle: "ಆಗಾಗ್ಗೆ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
        chatbotTitle: "ಚಾಟ್ ಬೆಂಬಲ",
        contactUs: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ"
    }
};

// Current language
let currentLanguage = localStorage.getItem('language') || 'en';

// Language switcher functionality
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageContent();
    updateLanguageSelector();
}

// Update page content based on current language
function updatePageContent() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}

// Update language selector
function updateLanguageSelector() {
    const selectors = document.querySelectorAll('.language-selector select');
    selectors.forEach(selector => {
        selector.value = currentLanguage;
    });
}

// Weather API placeholder
async function fetchWeatherData() {
    // Simulate API call with dummy data
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
                humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
                rainfall: Math.floor(Math.random() * 50), // 0-50mm
                condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
                forecast: [
                    { day: 'Today', temp: 28, condition: 'Sunny' },
                    { day: 'Tomorrow', temp: 26, condition: 'Cloudy' },
                    { day: 'Day 3', temp: 24, condition: 'Rainy' }
                ]
            });
        }, 1000);
    });
}

// Crop recommendation logic
function getCropRecommendations(soilType, season, waterAvailability) {
    const recommendations = {
        'clayey-kharif-abundant': ['Rice', 'Sugarcane', 'Cotton'],
        'clayey-kharif-moderate': ['Rice', 'Maize', 'Soybean'],
        'clayey-kharif-scarce': ['Sorghum', 'Pearl Millet', 'Castor'],
        'clayey-rabi-abundant': ['Wheat', 'Barley', 'Mustard'],
        'clayey-rabi-moderate': ['Wheat', 'Chickpea', 'Lentil'],
        'clayey-rabi-scarce': ['Barley', 'Gram', 'Mustard'],
        'loamy-kharif-abundant': ['Rice', 'Maize', 'Cotton'],
        'loamy-kharif-moderate': ['Maize', 'Soybean', 'Groundnut'],
        'loamy-kharif-scarce': ['Sorghum', 'Pearl Millet', 'Sesame'],
        'loamy-rabi-abundant': ['Wheat', 'Potato', 'Sugarcane'],
        'loamy-rabi-moderate': ['Wheat', 'Barley', 'Pea'],
        'loamy-rabi-scarce': ['Barley', 'Mustard', 'Gram'],
        'sandy-kharif-abundant': ['Rice', 'Groundnut', 'Watermelon'],
        'sandy-kharif-moderate': ['Groundnut', 'Sesame', 'Green Gram'],
        'sandy-kharif-scarce': ['Pearl Millet', 'Cluster Bean', 'Castor'],
        'sandy-rabi-abundant': ['Potato', 'Onion', 'Carrot'],
        'sandy-rabi-moderate': ['Mustard', 'Cumin', 'Fenugreek'],
        'sandy-rabi-scarce': ['Barley', 'Gram', 'Lentil'],
        'blackSoil-kharif-abundant': ['Cotton', 'Sugarcane', 'Soybean'],
        'blackSoil-kharif-moderate': ['Cotton', 'Soybean', 'Sorghum'],
        'blackSoil-kharif-scarce': ['Sorghum', 'Pearl Millet', 'Sunflower'],
        'blackSoil-rabi-abundant': ['Wheat', 'Chickpea', 'Safflower'],
        'blackSoil-rabi-moderate': ['Wheat', 'Chickpea', 'Lentil'],
        'blackSoil-rabi-scarce': ['Sorghum', 'Safflower', 'Sunflower']
    };
    
    const key = `${soilType}-${season}-${waterAvailability}`;
    return recommendations[key] || ['Wheat', 'Rice', 'Maize'];
}

// Market price data (dummy)
function getMarketPrices() {
    return {
        wheat: { current: 2100, trend: 'up', change: '+5%' },
        rice: { current: 1950, trend: 'stable', change: '0%' },
        cotton: { current: 5800, trend: 'down', change: '-3%' },
        soybean: { current: 4200, trend: 'up', change: '+8%' },
        maize: { current: 1800, trend: 'up', change: '+2%' }
    };
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Form validation
function validateForm(formData) {
    const required = ['soilType', 'season', 'waterAvailability'];
    for (let field of required) {
        if (!formData[field]) {
            return { valid: false, message: `Please select ${field}` };
        }
    }
    return { valid: true };
}

// Local storage helpers
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Initialize app
function initializeApp() {
    updatePageContent();
    updateLanguageSelector();
    
    // Add language selector event listeners
    const languageSelectors = document.querySelectorAll('.language-selector select');
    languageSelectors.forEach(selector => {
        selector.addEventListener('change', (e) => {
            switchLanguage(e.target.value);
        });
    });
}

// FAQ accordion functionality
function toggleFAQ(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.faq-icon');
    
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        icon.textContent = '+';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = '−';
    }
}

// Chatbot placeholder
function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('hidden');
        });
    }
    
    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.add('hidden');
        });
    }
    
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendChatMessage);
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'mb-2 text-right';
    userMessage.innerHTML = `<span class="bg-green-500 text-white px-3 py-1 rounded-lg inline-block">${message}</span>`;
    messages.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'mb-2';
        botMessage.innerHTML = `<span class="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg inline-block">Thank you for your question. Our agricultural expert will respond shortly.</span>`;
        messages.appendChild(botMessage);
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    
    messages.scrollTop = messages.scrollHeight;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for global use
window.CropAdvisory = {
    switchLanguage,
    fetchWeatherData,
    getCropRecommendations,
    getMarketPrices,
    showNotification,
    validateForm,
    saveToStorage,
    getFromStorage,
    toggleFAQ,
    initializeChatbot
};
