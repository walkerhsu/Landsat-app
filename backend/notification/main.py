from get_landsat_location import next_landsat_time, update_latest_landsat_location
from get_new_datasets import LandsatGridAnalyzer
import datetime
from transform import Latlng2WRS2
from firebase import FIREBASE_DB

SERVICE_ACCOUNT_KEY = './earth-engine-SA-key.json'

def send_notification(request=None):
    # change start time to 1 hour before the current hour
    # and save as the format of YYYY-MM-DDTHH:MM:SS
    try:
        end_time = datetime.datetime.now()
        start_time = end_time - datetime.timedelta(hours=24)
        start_time = start_time.strftime("%Y-%m-%d")
        end_time = end_time.strftime("%Y-%m-%d")
        landsat_grid_analyzer = LandsatGridAnalyzer(SERVICE_ACCOUNT_KEY)
        dataset_list = landsat_grid_analyzer.get_datasetIDs(start_time, end_time)
        # print(dataset_list)
        users = FIREBASE_DB.collection('users').get()
        latest_data = None
        for user in users:
            user_data = user.to_dict()
            email = user_data.get('email')
            locations = user_data.get('locationHistory')
            # locations = [{
            #     "lat": 24.8020,
            #     "lng": 121.4484,
            # }]
            for location in locations:
                path_row = Latlng2WRS2(location['latlng']['lat'], location['latlng']['lng'])
                related_dataset_list = []
                # check if the dataset is located in the user's location history
                for dataset in dataset_list.copy():
                    # print(dataset['acquisition_date'], dataset['acquisition_time'])
                    combined_time = dataset['acquisition_date'] + " " + dataset['acquisition_time']
                    # turn to timestamp
                    timestamp = datetime.datetime.strptime(combined_time, "%Y-%m-%d %H:%M:%S").timestamp()
                    # print(dataset['acquisition_time'], datetime.datetime.now(tz=datetime.timezone.utc).timestamp())
                    # return
                    if not latest_data or timestamp > latest_data:
                        latest_data = timestamp
                        update_latest_landsat_location(dataset['WRS_PATH'], dataset['WRS_ROW'], timestamp, dataset['landsat_id'])
                    if dataset['WRS_PATH'] == path_row[0] and dataset['WRS_ROW'] == path_row[1]:
                        related_dataset_list.append(dataset)
                # related_dataset_list = ["test1, test2"]
                # check if the nearest landsat time is within 1 hour
                # nearest_landsat_time is in seconds since 1970-01-01
                nearest_landsats = []
                nearest_landsat_times, landsat_ids = next_landsat_time(location['latlng']['lat'], location['latlng']['lng'])
                # print(nearest_landsat_times, landsat_ids)
                for nearest_landsat_time, landsat_id in zip(nearest_landsat_times, landsat_ids):
                    delta_time = nearest_landsat_time - datetime.datetime.now(tz=datetime.timezone.utc).timestamp()
                    if delta_time < 3000:
                        # turn the delta_time to minutes
                        delta_time = min(1, delta_time / 60)
                        nearest_landsats.append({
                            'time': f"{delta_time:.2f} minute(s)",
                            'landsat_id': landsat_id
                        })
                
                if len(nearest_landsats) > 0 or len(related_dataset_list) > 0:
                    send_email(email, nearest_landsats, related_dataset_list)

                
        return "all emails have been sent to the users' email"
    except Exception as e:
        # raise e
        # print(e)
        return f"An error occurred: {e}"

def send_email(email, nearest_landsats, related_dataset_list):
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
    message['Subject'] = 'NEW Dataset Available or Landsat will pass your location SOON'
    body = ""
    if len(nearest_landsats) > 0:
        body += "Notice! Landsat will pass your location SOON! Get ready to capture your images!\n"
        body += "************************************\n"
        for nearest_landsat in nearest_landsats:
            body += f"Landsat {nearest_landsat['landsat_id']} will pass your location within {nearest_landsat['time']} \n"
        body += "************************************\n"
    if len(related_dataset_list) > 0:
        body += "Notice! A new dataset is available for your location! Please visit out website to download the dataset! Below are the datasets that are available:\n"
        body += "------------------------------------\n"
        for i, dataset in enumerate(related_dataset_list):
            body += f"{i+1}. {dataset['id']}, acquired at {dataset['acquisition_date']} {dataset['acquisition_time']} UTC\n"
        body += "------------------------------------\n"
    body += "Earth Pixel Web Page: https://nasa-landsat-app-194107554494.asia-east1.run.app/\n"
    body += "GitHub: https://github.com/walkerhsu/Landsat-app\nPlease like and star out Github!"

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