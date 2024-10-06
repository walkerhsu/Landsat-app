import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from get_new_datasets import LandsatGridAnalyzer
import datetime
from get_wrs_path_row import get_wrs_path_row

SERVICE_ACCOUNT_KEY = './earth-engine-SA-key.json'
FIRESTORE_SA_KEY = './firestore-sa.json'

def send_notification(request=None):
    # change start time to 1 hour before the current hour
    # and save as the format of YYYY-MM-DDTHH:MM:SS
    try:
        end_time = datetime.datetime.now()
        start_time = end_time - datetime.timedelta(hours=6)
        start_time = start_time.strftime("%Y-%m-%d")
        end_time = end_time.strftime("%Y-%m-%d")
        cred = credentials.Certificate(FIRESTORE_SA_KEY)
        app = firebase_admin.initialize_app(cred)
        db = firestore.client()
        landsat_grid_analyzer = LandsatGridAnalyzer(SERVICE_ACCOUNT_KEY)
        dataset_list = landsat_grid_analyzer.get_datasetIDs(start_time, end_time)
        users = db.collection('users').get()
        for user in users:
            user_data = user.to_dict()
            email = user_data.get('email')
            locations = user_data.get('locationHistory')
            locations = [{
                "lat": 24.8020,
                "lng": 121.4484,
            }]
            for location in locations:
                path_row = get_wrs_path_row(location['lat'], location['lng'])
                related_dataset_list = []
                for dataset in dataset_list:
                    if dataset['WRS_PATH'] == path_row[0] and dataset['WRS_ROW'] == path_row[1]:
                        related_dataset_list.append(dataset)
                related_dataset_list = ["test1, test2"]
                if len(related_dataset_list) > 0:
                        send_email(email, related_dataset_list)
        return "all emails have been sent to the users' email"
    except Exception as e:
        return f"An error occurred: {e}"

def send_email(email, related_dataset_list):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    import os

    # Gmail SMTP server details
    google_account_email = os.environ.get('google_account_email')
    google_account_password = os.environ.get('google_account_password')
    if not google_account_email or not google_account_password:
        import dotenv
        dotenv.load_dotenv()
        google_account_email = os.environ.get('google_account_email')
        google_account_password = os.environ.get('google_account_password')

    # Create the email message
    message = MIMEMultipart()
    message['From'] = google_account_email
    message['To'] = email
    message['Subject'] = 'New Dataset Available'
    body = f"A new dataset is available for your location: \n"
    for i, dataset in enumerate(related_dataset_list):
        body += f"{i+1}. {dataset}\n"
    body += f"Please check the website to download the dataset."
    message.attach(MIMEText(body, 'plain'))

    # Connect to the Gmail SMTP server and send the email
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(google_account_email, google_account_password)
        server.send_message(message)
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    send_notification()