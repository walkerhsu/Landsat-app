export const formatLocationId = (lat: number, lng: number) => {
  // Rounds lat/lng to 5 decimal places
  return `${lat} + ${lng}`;
};

export const parseLocationId = (locationId: string): { lat: number; lng: number } => {
    const [lat, lng] = locationId.split(' + ').map(Number); // Split the string and convert to numbers
    return { lat, lng };
  };
  
