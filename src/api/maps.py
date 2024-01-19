import os
import googlemaps
from datetime import datetime
import requests
import json

PLACES_API_KEY = os.getenv("PLACES_API_KEY")
gmaps = googlemaps.Client(key=PLACES_API_KEY)

# # Geocoding an address
# geocode_result = gmaps.geocode('1600 Amphitheatre Parkway, Mountain View, CA')

# # Look up an address with reverse geocoding
# reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))

# # Request directions via public transit
# now = datetime.now()
# directions_result = gmaps.directions("Sydney Town Hall",
#                                      "Parramatta, NSW",
#                                      mode="transit",
#                                      departure_time=now)

# # Validate an address with address validation
# addressvalidation_result =  gmaps.addressvalidation(['1600 Amphitheatre Pk'], 
#                                                     regionCode='US',
#                                                     locality='Mountain View', 
#                                                     enableUspsCass=True)



# def test_places_find(self):
#         url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
#         responses.add(
#             responses.GET,
#             url,
#             body='{"status": "OK", "candidates": []}',
#             status=200,
#             content_type="application/json",
#         )



url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.392163,-3.6978677&radius=500&types=pharmacy&key=xxxxxx&key=AIzaSyBoZAOd9jMhstspURn7_-f1XXhe0wS-hG8"

payload = {}
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)