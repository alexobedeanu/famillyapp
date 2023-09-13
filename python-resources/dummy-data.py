import requests
import datetime
import random

base_url = "http://localhost:8080/api/v1/expenses"

# Tokenul JWT și cookie-ul JSESSIONID
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbeyJhdXRob3JpdHkiOiJBRE1JTiJ9XSwic3ViIjoiYWRtaW4xIiwiaWF0IjoxNjkzNzcyMDIyLCJleHAiOjE2OTM3NzU2MjJ9.rFUNLFnq3dR0onRSCaDDelW4J1lcnFw4E0xq0TNtmDQ",
    "Content-Type": "application/json",
    "Cookie": "JSESSIONID=317AEB5C5586F5281CF28DA33151A5EC"
}

# Informațiile comune pentru toate cheltuielile
data = {
    "userId": 2,
    "category_id": 1,
    "familyId": 1
}

# Generarea cheltuielilor pentru fiecare zi a lunii martie
start_date = datetime.date(2023, 8, 1)
end_date = datetime.date(2023, 8, 31)
delta = datetime.timedelta(days=1)

current_date = start_date
while current_date <= end_date:
    amount = round(random.uniform(10, 10000), 2)
    description = f"Cheltuială pentru {current_date.isoformat()}"

    data["amount"] = amount
    data["description"] = description
    data["date"] = current_date.isoformat()

    response = requests.post(base_url, json=data, headers=headers)
    if response.status_code == 200:
        print(f"Cheltuială creată cu succes pentru data: {current_date.isoformat()}")
    else:
        print(f"Eroare la crearea cheltuielii pentru data: {current_date.isoformat()}")
        print(response.text)

    current_date += delta
