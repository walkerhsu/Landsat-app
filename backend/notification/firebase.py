import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

FIRESTORE_SA_KEY = "./firestore-sa.json"
cred = credentials.Certificate(FIRESTORE_SA_KEY)
app = firebase_admin.initialize_app(cred)
FIREBASE_DB = firestore.client()
