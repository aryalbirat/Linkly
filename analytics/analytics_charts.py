import requests
import matplotlib.pyplot as plt
from datetime import datetime

# Replace with your actual admin JWT token
TOKEN = "YOUR_ADMIN_JWT_TOKEN"
API_URL = "http://localhost:8000/api/admin/clicks-over-time"

headers = {"Authorization": f"Bearer {TOKEN}"}
response = requests.get(API_URL, headers=headers)
data = response.json()

dates = [datetime.strptime(item['_id'], "%Y-%m-%d") for item in data]
clicks = [item['clicks'] for item in data]

plt.figure(figsize=(10, 5))
plt.plot(dates, clicks, marker='o')
plt.title("Clicks vs Time")
plt.xlabel("Date")
plt.ylabel("Total Clicks")
plt.grid(True)
plt.tight_layout()
plt.savefig("clicks_vs_time.png")
plt.show()
