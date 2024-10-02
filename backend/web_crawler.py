from datetime import datetime, timedelta

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains

from utils import get_wrs_path_row


class LandsatSceneRetriever:
    WEBPAGE_BASE = "https://landsatlook.usgs.gov/stac-browser/collection02/level-1/standard/oli-tirs"

    def __init__(self, *args, **kwargs):
        self.latitude = 0.0
        self.longitude = 0.0
        self.startdate = None
        self.enddate = None
        self.period = timedelta(days=16) # 16 days to re-visit the same location
        self.path = None
        self.row = None
        self.driver = None
        self.scenes = []
        self.url = ""
        self.related_scenes = []
        self.scene_downloader = SceneDownloader()

    def check_date_valid(self):
        """
        Check if the startdate and enddate are valid.
        """
        assert self.startdate.year == self.enddate.year, "startdate and enddate must be in the same year"
        assert self.startdate.year >= 2013, "startdate must be in 2013 or later"
        assert self.enddate.year <= 2024, "enddate must be in 2024 or earlier"
        return self.startdate.year, self.enddate.year

    def setup_driver(self):
        """
        Set up the Selenium WebDriver instance.
        """
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        self.driver = webdriver.Chrome(options=chrome_options)

    def show_all_scenes(self):
        """
        Show all scenes on the page using Selenium.
        """
        dropdown_icon = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, "i.v-icon.notranslate.mdi.mdi-menu-down")
            )
        )
        ActionChains(self.driver).move_to_element(dropdown_icon).click().perform()

        all_option = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    "//div[contains(@class, 'v-list-item__title') and text()='All']",
                )
            )
        )
        all_option.click()

        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "tbody"))
        )

    def retrieve_scene_list(self):
        """
        Retrieve the scene list from the page.
        """
        table = self.driver.find_element(By.TAG_NAME, "tbody")
        rows = table.find_elements(By.TAG_NAME, "tr")
        for row in rows:
            columns = row.find_elements(By.TAG_NAME, "td")
            text = columns[0].text
            self.scenes.append(text)
        print("Found", len(self.scenes), "scenes")
        for scene in self.scenes:
            print(scene)
        return self.scenes

    def get_related_scenes(self):
        """
        Get the related scenes from the scene list.
        """
        for scene in self.scenes:
            acquisition_date = datetime.strptime(scene.split("_")[3], "%Y%m%d")
            if (self.startdate - acquisition_date <= self.period and self.startdate - acquisition_date >= timedelta(days=0)) or (self.enddate - acquisition_date <= self.period and self.enddate - acquisition_date >= timedelta(days=0)):
                self.related_scenes.append(scene)
        print("Found", len(self.related_scenes), "related scenes")
        for scene in self.related_scenes:
            print(scene)
        return self.related_scenes
        
    def get_scene_list(self):
        """
        Main function to get the scene list for the given latitude, longitude, and date range.
        """
        # Get WRS path and row
        path_row = get_wrs_path_row(self.latitude, self.longitude)
        self.path, self.row = f"{path_row[0]:03d}", f"{path_row[1]:03d}"

        # Validate the start and end dates
        start_year, end_year = self.check_date_valid()

        # Construct the URL
        self.url = f"{self.WEBPAGE_BASE}/{start_year}/{self.path}/{self.row}"
        print(f"URL: {self.url}")

        # Set up the WebDriver
        self.setup_driver()

        try:
            self.driver.get(self.url)
            self.show_all_scenes()
            # Extract the scene list
            self.retrieve_scene_list()

        except Exception as e:
            print(f"An error occurred: {e}")

        return self.scenes

    def navigate_to_scene_details(self, scene):
        """
        Click on a specific scene and navigate to its details page.
        """
        try:
            self.show_all_scenes()
            # Wait for the scene element to be clickable
            scene_element = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, f"//td[contains(text(), '{scene}')]"))
            )
            # Click on the scene
            scene_element.click()
            # Wait for the new page to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "vue2leaflet-map"))  # Adjust this selector based on the actual page structure
            )
            
            # Get the current URL (scene details page URL)
            scene_url = self.driver.current_url
            
            # Here you can add code to extract information from the scene details page
            self.scene_downloader.download_scene_data(self.driver, scene_url)

            # Go back to the previous page
            self.driver.back()
            
            # Wait for the scene list to be visible again
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "tbody"))
            )
            return scene_url
        except Exception as e:
            print(f"Error navigating to scene details for {scene}: {str(e)}")
            return None

    def process_related_scenes(self):
        """
        Process each related scene by navigating to its details page.
        """
        scene_urls = []
        for scene in self.related_scenes:
            url = self.navigate_to_scene_details(scene)
            if url:
                scene_urls.append(url)
        return scene_urls

    def run(self, latitude, longitude, startdate, enddate):
        """
        Main function to get the related scene list and process each scene.
        """
        self.latitude = latitude
        self.longitude = longitude
        self.startdate = startdate
        self.enddate = enddate
        
        self.get_scene_list()
        self.get_related_scenes()
        scene_urls = self.process_related_scenes()
        
        print(f"Processed {len(scene_urls)} scene detail pages:")
        for url in scene_urls:
            print(url)
        
        return scene_urls
    
class SceneDownloader:
    def __init__(self, *args, **kwargs):
        self.driver = None
        self.downloaded_bands = [
            "blue",
            "green",
            "red",
            "nir08",
            "swir16",
            "swir22",
        ]
        pass

    def download_scene_data(self, driver: webdriver.Chrome, scene_url: str):
        """
        Download scenes from the given scene URLs.
        """
        self.driver = driver
        self.driver.get(scene_url)
        print(f"Navigated to scene page: {scene_url}")
        
        try:
            # Click on the Assets tab
            assets_tab = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//div[@role='tab' and contains(text(), 'Assets')]"))
            )
            assets_tab.click()
            print("Clicked on the Assets tab")
            
            # Find the download link for the blue band
            self.download_bands()
            blue_download_link = self.driver.find_element(By.XPATH, "//a[@title='Download blue']")
            blue_download_url = blue_download_link.get_attribute('href')
            print(f"Blue band download URL: {blue_download_url}")
            
            # Find the second table
            self.retrieve_properties_list()
            print("-" * 100)
            
            # Here you can add code to actually download the blue band file if needed
            # For example:
            # urllib.request.urlretrieve(blue_download_url, "blue_band.tif")
            
        except Exception as e:
            print(f"Error processing scene data: {str(e)}")

    def download_bands(self):
        """
        Download the bands from the given scene URLs.
        """
        for band in self.downloaded_bands:
            download_link = self.driver.find_element(By.XPATH, f"//a[@title='Download {band}']")
            download_url = download_link.get_attribute('href')
            print(f"{band} band download URL: {download_url}")
            # Here you can add code to actually download the band file if needed
            # For example:
            # urllib.request.urlretrieve(download_url, f"{band}_band.tif")


    def retrieve_properties_list(self):
        """
        Retrieve the scene list from the page.
        """
        tables = self.driver.find_elements(By.TAG_NAME, "table")
        # 0 is the bands table, 1 is the properties table
        if len(tables) == 2:
            second_table = tables[1] 
            
            # Find the row with the word "text"
            cloud_cover_row = second_table.find_element(By.XPATH, ".//tr[.//strong[contains(text(), 'eo:cloud_cover')]]")
            
            label = cloud_cover_row.find_element(By.TAG_NAME, "strong").text
            value = cloud_cover_row.text.replace(label, '').strip()
            print(f"{label}: {value}")
        else:
            print("Second table not found")

if __name__ == "__main__":
    # Example usage
    retriever = LandsatSceneRetriever()
    start_date = datetime(2024, 9, 1)
    end_date = datetime(2024, 9, 30)
    scene_urls = retriever.run(
        latitude=24.8020, longitude=121.4484, startdate=start_date, enddate=end_date
    )