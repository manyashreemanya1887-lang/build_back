import os
import sys
import requests

def main():
    test_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts", "test_images")
    api_url = "http://127.0.0.1:8000/api/ml/predict-material"
    print("=== TESTING LIVE HTTP ENDPOINT /api/ml/predict-material ===")
    for f in sorted(os.listdir(test_dir)):
        if f.endswith('.jpg'):
            p = os.path.join(test_dir, f)
            with open(p, 'rb') as fp:
                resp = requests.post(api_url, files={"file": (f, fp, "image/jpeg")})
                if resp.status_code == 200:
                    data = resp.json()
                    print(f"{f:28} => {data['material']:25} (conf: {data['confidence']}) [STATUS: {resp.status_code}]")
                else:
                    print(f"{f:28} => FAILED HTTP {resp.status_code}: {resp.text}")

if __name__ == "__main__":
    main()
