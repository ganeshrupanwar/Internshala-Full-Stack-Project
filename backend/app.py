from flask import Flask, jsonify, send_from_directory
import os
import json

app = Flask(__name__, static_folder='../frontend', static_url_path='')

# Path to JSON file
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'listings.json')

# API route to serve listings
@app.route('/api/listings')
def get_listings():
    with open(DATA_PATH, 'r') as f:
        data = json.load(f)
    return jsonify(data)

# Optional: serve frontend files from Flask
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
