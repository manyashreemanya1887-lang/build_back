import os
import sys

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))
from app.ml.material_classifier import classifier

def main():
    test_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts", "test_images")
    print("=== EVALUATION ON TEST SUITE IMAGES ===")
    for f in sorted(os.listdir(test_dir)):
        if f.endswith('.jpg'):
            p = os.path.join(test_dir, f)
            with open(p, 'rb') as fp:
                res = classifier.predict(fp.read())
                alts = ', '.join([f"{a['material']} ({a['confidence']})" for a in res['alternatives']])
                print(f"{f:28} => {res['material']:25} (conf: {res['confidence']}) | Alts: {alts}")

    print("\n=== EVALUATION ON REAL / UPLOADED IMAGES ===")
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", "uploads")
    for f in ['user_red_brick.jpg', 'real_red_brick_1.jpg', '2220e74148cd4873a7d901d49128b353.jpg']:
        p = os.path.join(uploads_dir, f)
        if os.path.exists(p):
            with open(p, 'rb') as fp:
                res = classifier.predict(fp.read())
                print(f"{f:28} => {res['material']:25} (conf: {res['confidence']})")

if __name__ == "__main__":
    main()
