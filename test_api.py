"""
Test script for Smart Crop Advisory API
=======================================

This script tests the Flask API endpoints to ensure they work correctly.
Run this after starting the Flask server.

Usage: python test_api.py
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:5000"

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🔍 Testing Health Endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed!")
            print(f"   Status: {data.get('status')}")
            print(f"   Model loaded: {data.get('model_loaded')}")
            return True
        else:
            print(f"❌ Health check failed with status: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {str(e)}")
        return False

def test_model_info_endpoint():
    """Test the model info endpoint"""
    print("\n🔍 Testing Model Info Endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/model-info", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Model info retrieved successfully!")
            print(f"   Model type: {data['prediction'].get('model_type', 'N/A')}")
            print(f"   Supported crops: {len(data['prediction'].get('supported_crops', []))}")
            return True
        else:
            print(f"❌ Model info failed with status: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Model info failed: {str(e)}")
        return False

def test_prediction_endpoint():
    """Test the crop prediction endpoint"""
    print("\n🔍 Testing Prediction Endpoint...")
    
    # Test data for different scenarios
    test_cases = [
        {
            "name": "Rice-favorable conditions",
            "data": {
                "N": 90,
                "P": 42,
                "K": 43,
                "temperature": 25.5,
                "humidity": 85.0,
                "ph": 6.2,
                "rainfall": 200.0,
                "soil_type": "Loamy",
                "season": "Kharif"
            }
        },
        {
            "name": "Wheat-favorable conditions",
            "data": {
                "N": 65,
                "P": 50,
                "K": 50,
                "temperature": 18.0,
                "humidity": 60.0,
                "ph": 6.8,
                "rainfall": 55.0,
                "soil_type": "Loamy",
                "season": "Rabi"
            }
        },
        {
            "name": "Cotton-favorable conditions",
            "data": {
                "N": 130,
                "P": 50,
                "K": 50,
                "temperature": 26.0,
                "humidity": 80.0,
                "ph": 7.0,
                "rainfall": 75.0,
                "soil_type": "Black",
                "season": "Kharif"
            }
        }
    ]
    
    success_count = 0
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n   Test {i}: {test_case['name']}")
        
        try:
            response = requests.post(
                f"{BASE_URL}/predict",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                prediction = data.get('prediction', {})
                
                print(f"   ✅ Prediction successful!")
                print(f"      Predicted crop: {prediction.get('predicted_crop')}")
                print(f"      Confidence: {prediction.get('confidence')}%")
                
                # Show top 3 recommendations
                top_recs = prediction.get('top_recommendations', [])
                if top_recs:
                    print("      Top recommendations:")
                    for rec in top_recs[:3]:
                        print(f"        - {rec['crop']}: {rec['confidence']}%")
                
                success_count += 1
                
            else:
                print(f"   ❌ Prediction failed with status: {response.status_code}")
                print(f"      Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Prediction failed: {str(e)}")
    
    print(f"\n📊 Prediction tests: {success_count}/{len(test_cases)} passed")
    return success_count == len(test_cases)

def test_error_handling():
    """Test API error handling"""
    print("\n🔍 Testing Error Handling...")
    
    error_test_cases = [
        {
            "name": "Missing required fields",
            "data": {"N": 90, "P": 42},  # Missing other required fields
            "expected_status": 400
        },
        {
            "name": "Invalid soil type",
            "data": {
                "N": 90, "P": 42, "K": 43, "temperature": 25.5,
                "humidity": 85.0, "ph": 6.2, "rainfall": 200.0,
                "soil_type": "InvalidSoil", "season": "Kharif"
            },
            "expected_status": 400
        },
        {
            "name": "Invalid season",
            "data": {
                "N": 90, "P": 42, "K": 43, "temperature": 25.5,
                "humidity": 85.0, "ph": 6.2, "rainfall": 200.0,
                "soil_type": "Loamy", "season": "InvalidSeason"
            },
            "expected_status": 400
        },
        {
            "name": "Negative values",
            "data": {
                "N": -10, "P": 42, "K": 43, "temperature": 25.5,
                "humidity": 85.0, "ph": 6.2, "rainfall": 200.0,
                "soil_type": "Loamy", "season": "Kharif"
            },
            "expected_status": 400
        }
    ]
    
    success_count = 0
    
    for i, test_case in enumerate(error_test_cases, 1):
        print(f"\n   Error Test {i}: {test_case['name']}")
        
        try:
            response = requests.post(
                f"{BASE_URL}/predict",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == test_case['expected_status']:
                print(f"   ✅ Error handling correct!")
                print(f"      Status: {response.status_code}")
                
                data = response.json()
                if 'error' in data:
                    print(f"      Error message: {data['error']}")
                
                success_count += 1
            else:
                print(f"   ❌ Expected status {test_case['expected_status']}, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Error test failed: {str(e)}")
    
    print(f"\n📊 Error handling tests: {success_count}/{len(error_test_cases)} passed")
    return success_count == len(error_test_cases)

def main():
    """Run all API tests"""
    print("🚀 Smart Crop Advisory API Test Suite")
    print("=" * 50)
    
    # Wait a moment for server to be ready
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    # Run tests
    tests_passed = 0
    total_tests = 4
    
    if test_health_endpoint():
        tests_passed += 1
    
    if test_model_info_endpoint():
        tests_passed += 1
        
    if test_prediction_endpoint():
        tests_passed += 1
        
    if test_error_handling():
        tests_passed += 1
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    print(f"Tests passed: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! API is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the server logs.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
