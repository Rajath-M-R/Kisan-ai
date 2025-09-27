# Smart Crop Advisory System - Backend API

## Overview

This Flask-based backend provides machine learning-powered crop recommendations based on soil and weather parameters. The system uses a Random Forest classifier trained on agricultural data to suggest the most suitable crops for farmers.

## Features

- **Machine Learning Model**: Random Forest classifier for crop prediction
- **RESTful API**: Clean endpoints for crop prediction and health checks
- **Data Preprocessing**: Automatic scaling and encoding of input features
- **Error Handling**: Comprehensive validation and error responses
- **CORS Support**: Frontend integration ready
- **Logging**: Detailed logging for debugging and monitoring

## API Endpoints

### 1. Health Check
```
GET /health
```
Returns server status and model information.

**Response:**
```json
{
    "status": "healthy",
    "message": "Smart Crop Advisory API is running",
    "model_loaded": true,
    "timestamp": "2024-01-01T12:00:00"
}
```

### 2. Crop Prediction
```
POST /predict
```
Predicts the best crop based on input parameters.

**Request Body:**
```json
{
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.87,
    "humidity": 82.00,
    "ph": 6.50,
    "rainfall": 202.93,
    "soil_type": "Loamy",
    "season": "Kharif"
}
```

**Response:**
```json
{
    "status": "success",
    "input_parameters": {...},
    "prediction": {
        "predicted_crop": "Rice",
        "confidence": 85.6,
        "top_recommendations": [
            {"crop": "Rice", "confidence": 85.6},
            {"crop": "Maize", "confidence": 12.3},
            {"crop": "Cotton", "confidence": 2.1}
        ]
    },
    "timestamp": "2024-01-01T12:00:00"
}
```

### 3. Model Information
```
GET /model-info
```
Returns information about the loaded model and supported parameters.

## Input Parameters

| Parameter | Type | Description | Valid Values |
|-----------|------|-------------|--------------|
| N | Float | Nitrogen content in soil (kg/ha) | 0-200 |
| P | Float | Phosphorus content in soil (kg/ha) | 0-150 |
| K | Float | Potassium content in soil (kg/ha) | 0-250 |
| temperature | Float | Average temperature (°C) | 0-50 |
| humidity | Float | Relative humidity (%) | 0-100 |
| ph | Float | Soil pH value | 0-14 |
| rainfall | Float | Annual rainfall (mm) | 0-500 |
| soil_type | String | Type of soil | Loamy, Sandy, Clayey, Black, Red |
| season | String | Growing season | Kharif, Rabi, Zaid, Whole Year |

## Supported Crops

The model can predict the following crops:
- Rice, Maize, Chickpea, Kidneybeans, Pigeonpeas
- Mothbeans, Mungbean, Blackgram, Lentil
- Pomegranate, Banana, Mango, Grapes
- Watermelon, Muskmelon, Apple, Orange, Papaya
- Coconut, Cotton, Jute, Coffee

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Installation Steps

1. **Clone the repository:**
```bash
cd smart-crop-advisory/backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the application:**
```bash
python app.py
```

The server will start on `http://localhost:5000`

### Docker Setup (Optional)

```bash
# Build Docker image
docker build -t crop-advisory-backend .

# Run container
docker run -p 5000:5000 crop-advisory-backend
```

## Model Training

The application automatically creates and trains a machine learning model on first run:

1. **Dataset Creation**: Generates synthetic agricultural data based on real-world crop parameters
2. **Preprocessing**: Encodes categorical variables and scales numerical features
3. **Training**: Uses Random Forest classifier with optimized hyperparameters
4. **Validation**: Evaluates model performance and saves metrics
5. **Persistence**: Saves trained model and preprocessors for future use

## File Structure

```
backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── model/                # Model storage directory
│   ├── crop_model.pkl    # Trained model
│   ├── scaler.pkl        # Feature scaler
│   ├── label_encoders.pkl # Categorical encoders
│   └── crop_dataset.csv  # Training dataset
└── tests/                # Unit tests (optional)
```

## Testing the API

### Using curl:
```bash
# Health check
curl -X GET http://localhost:5000/health

# Crop prediction
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.87,
    "humidity": 82.00,
    "ph": 6.50,
    "rainfall": 202.93,
    "soil_type": "Loamy",
    "season": "Kharif"
  }'
```

### Using Python requests:
```python
import requests
import json

# Prediction request
data = {
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.87,
    "humidity": 82.00,
    "ph": 6.50,
    "rainfall": 202.93,
    "soil_type": "Loamy",
    "season": "Kharif"
}

response = requests.post('http://localhost:5000/predict', json=data)
result = response.json()
print(json.dumps(result, indent=2))
```

## Error Handling

The API provides detailed error messages for common issues:

- **400 Bad Request**: Invalid input data or missing fields
- **500 Internal Server Error**: Server-side processing errors

Example error response:
```json
{
    "error": "Missing required fields: ['N', 'P']",
    "status": "error"
}
```

## Performance

- **Model Accuracy**: ~85-90% on test data
- **Prediction Time**: <100ms per request
- **Memory Usage**: ~50MB for model and dependencies
- **Concurrent Requests**: Supports multiple simultaneous predictions

## Production Deployment

### Using Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables:
```bash
export FLASK_ENV=production
export FLASK_DEBUG=False
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For technical support or questions:
- Email: support@smartcropadvisory.com
- GitHub Issues: [Create an issue](https://github.com/smartcropadvisory/issues)

---

**Made with ❤️ for Indian Farmers**
