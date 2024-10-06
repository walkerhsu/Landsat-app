import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('secret/firestore-sa.json')

app = firebase_admin.initialize_app(cred, name="dev")

db = firestore.client()