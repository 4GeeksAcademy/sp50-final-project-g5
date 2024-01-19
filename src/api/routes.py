"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Users
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import os


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body ['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200

@api.route('/maps', methods=['GET'])
def handle_maps():
    # Parámetros necesarios
    types = 'pharmacy'
    # location = "40.392163,-3.6978677"
    large_radius = 100000 # El radio está en metros = 100km
    api_key = os.environ.get('PLACES_API_KEY')
    api_url = os.environ.get('URL_GOOGLE_PLACES')
    # Búsqueda de Farmacias con una localización y radio
    url = f'{api_url}?location={location}&radius={large_radius}&types={types}&key={api_key}'
    response = requests.get(url)
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return {'error': 'Error en la solicitud a la API de Google Places'}, 500

