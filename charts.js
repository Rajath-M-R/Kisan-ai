// Chart.js Integration for Smart Crop Advisory System

// Chart configurations and data
let dashboardCharts = {};

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

// Initialize all charts
function initializeCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Loading from CDN...');
        loadChartJS().then(() => {
            createCharts();
        });
    } else {
        createCharts();
    }
}

// Load Chart.js from CDN if not already loaded
function loadChartJS() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Create all charts
function createCharts() {
    createMarketTrendChart();
    createYieldChart();
    createWeatherChart();
    createFertilizerChart();
}

// Market Price Trend Chart
function createMarketTrendChart(canvasId = 'marketTrendChart', cropData = null) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const wheatPrices = [2000, 2050, 2100, 2080, 2150, 2200];
    const ricePrices = [1800, 1850, 1900, 1920, 1950, 2000];

    dashboardCharts.marketTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Wheat (₹/quintal)',
                data: wheatPrices,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Rice (₹/quintal)',
                data: ricePrices,
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Market Price Trends',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Price (₹/quintal)'
                    }
                }
            }
        }
    });
}

// Yield Comparison Chart
function createYieldChart() {
    const ctx = document.getElementById('yieldChart');
    if (!ctx) return;

    const yieldData = {
        labels: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Soybean'],
        datasets: [{
            label: 'Expected Yield (Quintals/Hectare)',
            data: [42, 55, 18, 650, 65, 25],
            backgroundColor: [
                '#4CAF50',
                '#2196F3',
                '#FF9800',
                '#9C27B0',
                '#F44336',
                '#607D8B'
            ],
            borderColor: '#2E7D32',
            borderWidth: 2
        }, {
            label: 'Average Regional Yield',
            data: [38, 48, 15, 580, 58, 22],
            backgroundColor: 'rgba(158, 158, 158, 0.5)',
            borderColor: '#9E9E9E',
            borderWidth: 2
        }]
    };

    dashboardCharts.yieldChart = new Chart(ctx, {
        type: 'bar',
        data: yieldData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Crop Yield Comparison'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Yield (Quintals/Hectare)'
                    }
                }
            }
        }
    });
}

// Weather Trends Chart
function createWeatherChart() {
    const ctx = document.getElementById('weatherChart');
    if (!ctx) return;

    const weatherData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Temperature (°C)',
            data: [15, 18, 25, 32, 38, 35, 30, 28, 30, 28, 22, 18],
            borderColor: '#FF5722',
            backgroundColor: 'rgba(255, 87, 34, 0.1)',
            yAxisID: 'y'
        }, {
            label: 'Rainfall (mm)',
            data: [10, 15, 20, 25, 40, 150, 200, 180, 120, 60, 25, 15],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            yAxisID: 'y1'
        }]
    };

    dashboardCharts.weatherChart = new Chart(ctx, {
        type: 'line',
        data: weatherData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Annual Weather Trends'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Rainfall (mm)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// Crop Distribution Pie Chart
function createCropDistributionChart() {
    const ctx = document.getElementById('cropDistributionChart');
    if (!ctx) return;

    const distributionData = {
        labels: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Others'],
        datasets: [{
            data: [25, 20, 15, 12, 18, 10],
            backgroundColor: [
                '#4CAF50',
                '#2196F3',
                '#FF9800',
                '#9C27B0',
                '#F44336',
                '#607D8B'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    dashboardCharts.cropDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: distributionData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Regional Crop Distribution (%)'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Profitability Analysis Chart
function createProfitabilityChart() {
    const ctx = document.getElementById('profitabilityChart');
    if (!ctx) return;

    const profitData = {
        labels: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Soybean'],
        datasets: [{
            label: 'Revenue (₹/Hectare)',
            data: [95000, 115000, 110000, 390000, 130000, 52500],
            backgroundColor: 'rgba(76, 175, 80, 0.7)'
        }, {
            label: 'Cost (₹/Hectare)',
            data: [27500, 37500, 50000, 180000, 45000, 30000],
            backgroundColor: 'rgba(244, 67, 54, 0.7)'
        }, {
            label: 'Profit (₹/Hectare)',
            data: [67500, 77500, 60000, 210000, 85000, 22500],
            backgroundColor: 'rgba(33, 150, 243, 0.7)'
        }]
    };

    dashboardCharts.profitabilityChart = new Chart(ctx, {
        type: 'bar',
        data: profitData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Crop Profitability Analysis'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (₹)'
                    }
                }
            }
        }
    });
}

// Seasonal Planting Calendar
function createSeasonalChart() {
    const ctx = document.getElementById('seasonalChart');
    if (!ctx) return;

    const seasonalData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Kharif Crops',
            data: [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
            backgroundColor: 'rgba(76, 175, 80, 0.7)',
            borderColor: '#4CAF50',
            borderWidth: 2,
            fill: true
        }, {
            label: 'Rabi Crops',
            data: [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
            backgroundColor: 'rgba(255, 152, 0, 0.7)',
            borderColor: '#FF9800',
            borderWidth: 2,
            fill: true
        }, {
            label: 'Zaid Crops',
            data: [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(33, 150, 243, 0.7)',
            borderColor: '#2196F3',
            borderWidth: 2,
            fill: true
        }]
    };

    dashboardCharts.seasonalChart = new Chart(ctx, {
        type: 'line',
        data: seasonalData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Seasonal Crop Calendar'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value === 1 ? 'Active' : 'Inactive';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Growing Season'
                    }
                }
            }
        }
    });
}

// Update chart data dynamically
function updateChartData(chartName, newData) {
    if (dashboardCharts[chartName]) {
        dashboardCharts[chartName].data = newData;
        dashboardCharts[chartName].update();
    }
}

// Resize charts on window resize
window.addEventListener('resize', function() {
    Object.keys(dashboardCharts).forEach(chartName => {
        if (dashboardCharts[chartName]) {
            dashboardCharts[chartName].resize();
        }
    });
});

// Export functions for external use
window.ChartManager = {
    updateChartData,
    createYieldChart,
    createWeatherChart,
    createCropDistributionChart,
    createProfitabilityChart,
    createSeasonalChart
};

// Market Price Trend Chart
function createMarketPriceChart() {
    const ctx = document.getElementById('marketPriceChart');
    if (!ctx) return;

    const priceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Wheat (₹/Quintal)',
            data: [2100, 2150, 2200, 2180, 2250, 2300],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4
        }, {
            label: 'Rice (₹/Quintal)',
            data: [1900, 1950, 2000, 1980, 2050, 2100],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4
        }]
    };

    dashboardCharts.marketPriceChart = new Chart(ctx, {
        type: 'line',
        data: priceData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Market Price Trends'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Price (₹/Quintal)'
                    }
                }
            }
        }
    });
}
