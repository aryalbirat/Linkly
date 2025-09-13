import requests
import matplotlib.pyplot as plt
from datetime import datetime
import sys
import json

# Replace with your actual admin JWT tokens
TOKEN = "YOUR_ADMIN_JWT_TOKEN"
API_URL = "http://localhost:8000/api/admin/clicks-over-time"

def generate_analytics_chart():
    try:
        headers = {"Authorization": f"Bearer {TOKEN}"}
        response = requests.get(API_URL, headers=headers)
        
        # Check if the request was successful
        if response.status_code != 200:
            print(f"Error: API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
        data = response.json()
        
        if not data:
            print("No data returned from API")
            return False
            
        dates = [datetime.strptime(item['_id'], "%Y-%m-%d") for item in data]
        clicks = [item['clicks'] for item in data]

        plt.figure(figsize=(10, 5))
        plt.plot(dates, clicks, marker='o', color='#3b82f6')
        plt.title("URL Clicks Over Time")
        plt.xlabel("Date")
        plt.ylabel("Total Clicks")
        plt.grid(True, linestyle='--', alpha=0.7)
        plt.tight_layout()
        plt.savefig("clicks_vs_time.png")
        print("Chart saved as clicks_vs_time.png")
        plt.show()
        return True
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API server. Make sure it's running.")
        return False
    except json.JSONDecodeError:
        print("Error: Could not parse API response as JSON")
        print(f"Response: {response.text}")
        return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Generating URL analytics chart...")
    if not generate_analytics_chart():
        print("Failed to generate analytics chart.")
        sys.exit(1)
