export const GOOGLE_API_KEY = "AIzaSyCSypOznNZ_lY7djECM7QQkJhvxyAQkA04";

export const URL = "https://www.sreeragu.com/realestate/api/";
//export const URL = "https://www.mypropertyqr.com/develop/api/";

export async function getAddress(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch address!');
    }
    const data = await response.json();
    const address = data.results[0].formatted_address;
    return address;
}