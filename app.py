"""
Kisan AI - Flask Backend
========================

This Flask application provides machine learning-based crop recommendations
based on soil and weather parameters for farmers.

Author: Kisan AI Team
Date: 2024
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import os
import logging
import traceback

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend integration
CORS(app, origins=["http://localhost:8000", "http://127.0.0.1:8000", "*"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for model and preprocessors
model = None
scaler = None
label_encoders = {}
feature_columns = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'soil_type', 'season']
target_crops = ['Rice', 'Maize', 'Chickpea', 'Kidneybeans', 'Pigeonpeas', 'Mothbeans', 
                'Mungbean', 'Blackgram', 'Lentil', 'Pomegranate', 'Banana', 'Mango', 
                'Grapes', 'Watermelon', 'Muskmelon', 'Apple', 'Orange', 'Papaya', 
                'Coconut', 'Cotton', 'Jute', 'Coffee']

def create_sample_dataset():
    """
    Create a sample crop recommendation dataset for training
    This simulates the Kaggle Crop Recommendation Dataset
    """
    logger.info("Creating sample crop recommendation dataset...")
    
    np.random.seed(42)
    n_samples = 2200
    
    # Define crop-specific parameter ranges (based on agricultural knowledge)
    crop_params = {
        'Rice': {'N': (80, 120), 'P': (40, 60), 'K': (40, 60), 'temp': (20, 35), 'humidity': (80, 95), 'ph': (5.5, 7.0), 'rainfall': (150, 300)},
        'Maize': {'N': (80, 120), 'P': (40, 60), 'K': (20, 40), 'temp': (18, 27), 'humidity': (55, 75), 'ph': (6.0, 7.5), 'rainfall': (60, 110)},
        'Chickpea': {'N': (40, 70), 'P': (60, 85), 'K': (80, 120), 'temp': (17, 24), 'humidity': (10, 40), 'ph': (6.0, 7.5), 'rainfall': (30, 65)},
        'Kidneybeans': {'N': (20, 40), 'P': (60, 80), 'K': (20, 40), 'temp': (15, 25), 'humidity': (18, 30), 'ph': (5.5, 7.0), 'rainfall': (60, 90)},
        'Cotton': {'N': (110, 150), 'P': (40, 60), 'K': (40, 60), 'temp': (21, 30), 'humidity': (75, 85), 'ph': (5.8, 8.0), 'rainfall': (50, 100)},
        'Wheat': {'N': (50, 80), 'P': (40, 60), 'K': (40, 60), 'temp': (12, 25), 'humidity': (55, 70), 'ph': (6.0, 7.5), 'rainfall': (45, 65)},
        'Coconut': {'N': (20, 40), 'P': (10, 25), 'K': (20, 40), 'temp': (27, 35), 'humidity': (70, 80), 'ph': (5.2, 8.0), 'rainfall': (150, 250)},
        'Papaya': {'N': (50, 100), 'P': (25, 50), 'K': (50, 100), 'temp': (25, 30), 'humidity': (60, 70), 'ph': (6.0, 6.5), 'rainfall': (100, 200)},
        'Orange': {'N': (20, 40), 'P': (10, 25), 'K': (10, 20), 'temp': (15, 27), 'humidity': (50, 70), 'ph': (6.0, 7.5), 'rainfall': (100, 120)},
        'Apple': {'N': (20, 40), 'P': (125, 150), 'K': (200, 250), 'temp': (21, 24), 'humidity': (90, 95), 'ph': (5.5, 7.0), 'rainfall': (100, 180)}
    }
    
    soil_types = ['Loamy', 'Sandy', 'Clayey', 'Black', 'Red']
    seasons = ['Kharif', 'Rabi', 'Zaid', 'Whole Year']
    
    data = []
    
    for crop, params in crop_params.items():
        # Generate samples for each crop
        samples_per_crop = n_samples // len(crop_params)
        
        for _ in range(samples_per_crop):
            sample = {
                'N': np.random.uniform(params['N'][0], params['N'][1]),
                'P': np.random.uniform(params['P'][0], params['P'][1]),
                'K': np.random.uniform(params['K'][0], params['K'][1]),
                'temperature': np.random.uniform(params['temp'][0], params['temp'][1]),
                'humidity': np.random.uniform(params['humidity'][0], params['humidity'][1]),
                'ph': np.random.uniform(params['ph'][0], params['ph'][1]),
                'rainfall': np.random.uniform(params['rainfall'][0], params['rainfall'][1]),
                'soil_type': np.random.choice(soil_types),
                'season': np.random.choice(seasons),
                'label': crop
            }
            data.append(sample)
    
    df = pd.DataFrame(data)
    
    # Save dataset for future use
    os.makedirs('model', exist_ok=True)
    df.to_csv('model/crop_dataset.csv', index=False)
    logger.info(f"Dataset created with {len(df)} samples and saved to model/crop_dataset.csv")
    
    return df

def train_and_save_model():
    """
    Train the crop recommendation model and save it along with preprocessors
    """
    logger.info("Training crop recommendation model...")
    
    # Create or load dataset
    dataset_path = 'model/crop_dataset.csv'
    if os.path.exists(dataset_path):
        df = pd.read_csv(dataset_path)
        logger.info(f"Loaded existing dataset with {len(df)} samples")
    else:
        df = create_sample_dataset()
    
    # Prepare features and target
    X = df[feature_columns[:-1] + ['soil_type', 'season']].copy()  # All features except label
    y = df['label'].copy()
    
    # Encode categorical variables
    global label_encoders
    categorical_features = ['soil_type', 'season']
    
    for feature in categorical_features:
        le = LabelEncoder()
        X[feature] = le.fit_transform(X[feature])
        label_encoders[feature] = le
    
    # Scale numerical features
    global scaler
    numerical_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    scaler = StandardScaler()
    X[numerical_features] = scaler.fit_transform(X[numerical_features])
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Train Random Forest model
    global model
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    logger.info(f"Model trained with accuracy: {accuracy:.4f}")
    logger.info("Classification Report:")
    logger.info(f"\n{classification_report(y_test, y_pred)}")
    
    # Save model and preprocessors
    os.makedirs('model', exist_ok=True)
    joblib.dump(model, 'model/crop_model.pkl')
    joblib.dump(scaler, 'model/scaler.pkl')
    joblib.dump(label_encoders, 'model/label_encoders.pkl')
    
    logger.info("Model and preprocessors saved successfully!")
    
    return model, scaler, label_encoders

def load_model():
    """
    Load the trained model and preprocessors
    """
    global model, scaler, label_encoders
    
    try:
        model_path = 'model/crop_model.pkl'
        scaler_path = 'model/scaler.pkl'
        encoders_path = 'model/label_encoders.pkl'
        
        if all(os.path.exists(path) for path in [model_path, scaler_path, encoders_path]):
            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)
            label_encoders = joblib.load(encoders_path)
            logger.info("Model and preprocessors loaded successfully!")
            return True
        else:
            logger.info("Model files not found. Training new model...")
            train_and_save_model()
            return True
            
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        logger.info("Training new model...")
        train_and_save_model()
        return True

def preprocess_input(input_data):
    """
    Preprocess input data for model prediction
    
    Args:
        input_data (dict): Raw input data from API request
        
    Returns:
        np.array: Preprocessed data ready for model prediction
    """
    try:
        # Create DataFrame from input
        df = pd.DataFrame([input_data])
        
        # Ensure all required columns are present
        required_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'soil_type', 'season']
        for feature in required_features:
            if feature not in df.columns:
                raise ValueError(f"Missing required feature: {feature}")
        
        # Encode categorical variables
        for feature in ['soil_type', 'season']:
            if feature in label_encoders:
                try:
                    df[feature] = label_encoders[feature].transform(df[feature])
                except ValueError as e:
                    # Handle unseen categories
                    logger.warning(f"Unseen category in {feature}: {df[feature].iloc[0]}")
                    # Use the most common category (first one) as fallback
                    df[feature] = 0
        
        # Scale numerical features
        numerical_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        df[numerical_features] = scaler.transform(df[numerical_features])
        
        return df[required_features].values
        
    except Exception as e:
        logger.error(f"Error in preprocessing: {str(e)}")
        raise

def predict_crop(input_data):
    """
    Predict the best crop based on input parameters
    
    Args:
        input_data (dict): Input parameters
        
    Returns:
        dict: Prediction results with crop and confidence
    """
    try:
        # Preprocess input
        processed_data = preprocess_input(input_data)
        
        # Make prediction
        prediction = model.predict(processed_data)[0]
        
        # Get prediction probabilities for confidence score
        probabilities = model.predict_proba(processed_data)[0]
        confidence = float(np.max(probabilities))
        
        # Get top 3 recommendations
        top_indices = np.argsort(probabilities)[-3:][::-1]
        top_crops = []
        
        for idx in top_indices:
            crop_name = model.classes_[idx]
            prob = float(probabilities[idx])
            top_crops.append({
                'crop': crop_name,
                'confidence': round(prob * 100, 2)
            })
        
        return {
            'predicted_crop': prediction,
            'confidence': round(confidence * 100, 2),
            'top_recommendations': top_crops
        }
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        raise

# API Routes

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify if the server is running
    """
    return jsonify({
        'status': 'healthy',
        'message': 'Kisan AI API is running',
        'model_loaded': model is not None,
        'timestamp': pd.Timestamp.now().isoformat()
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint for crop recommendation
    
    Expected JSON input:
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
    """
    try:
        # Validate request
        if not request.is_json:
            return jsonify({
                'error': 'Request must be JSON',
                'status': 'error'
            }), 400
        
        input_data = request.get_json()
        
        # Validate required fields
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'soil_type', 'season']
        missing_fields = [field for field in required_fields if field not in input_data]
        
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {missing_fields}',
                'status': 'error'
            }), 400
        
        # Validate data types and ranges
        numeric_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        for field in numeric_fields:
            try:
                input_data[field] = float(input_data[field])
                if input_data[field] < 0:
                    return jsonify({
                        'error': f'{field} must be non-negative',
                        'status': 'error'
                    }), 400
            except (ValueError, TypeError):
                return jsonify({
                    'error': f'{field} must be a valid number',
                    'status': 'error'
                }), 400
        
        # Validate categorical fields
        valid_soil_types = ['Loamy', 'Sandy', 'Clayey', 'Black', 'Red']
        valid_seasons = ['Kharif', 'Rabi', 'Zaid', 'Whole Year']
        
        if input_data['soil_type'] not in valid_soil_types:
            return jsonify({
                'error': f'Invalid soil_type. Must be one of: {valid_soil_types}',
                'status': 'error'
            }), 400
        
        if input_data['season'] not in valid_seasons:
            return jsonify({
                'error': f'Invalid season. Must be one of: {valid_seasons}',
                'status': 'error'
            }), 400
        
        # Make prediction
        result = predict_crop(input_data)
        
        return jsonify({
            'status': 'success',
            'input_parameters': input_data,
            'prediction': result,
            'timestamp': pd.Timestamp.now().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Error in /predict endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        
        return jsonify({
            'error': 'Internal server error during prediction',
            'status': 'error',
            'details': str(e)
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """
    Get information about the loaded model
    """
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded',
                'status': 'error'
            }), 500
        
        return jsonify({
            'status': 'success',
            'model_type': type(model).__name__,
            'features': feature_columns,
            'supported_crops': list(model.classes_),
            'supported_soil_types': ['Loamy', 'Sandy', 'Clayey', 'Black', 'Red'],
            'supported_seasons': ['Kharif', 'Rabi', 'Zaid', 'Whole Year'],
            'model_loaded': True
        }), 200
        
    except Exception as e:
        logger.error(f"Error in /model-info endpoint: {str(e)}")
        return jsonify({
            'error': 'Error retrieving model information',
            'status': 'error'
        }), 500

# Initialize the application
if __name__ == '__main__':
    logger.info("Starting Kisan AI Flask Application...")
    
    # Load or train model
    load_model()
    
    logger.info("Flask app initialized successfully!")
    logger.info("Available endpoints:")
    logger.info("  GET  /health - Health check")
    logger.info("  POST /predict - Crop prediction")
    logger.info("  GET  /model-info - Model information")
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
