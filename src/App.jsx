import { useEffect, useState } from 'react'
import './App.css'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { DateTime } from "luxon";
import Card from 'react-bootstrap/Card'
import IPIcon from './assets/IP.jpg';


export default function App() {
  // dotenv.config();
  const [ip, setIp] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [flag, setFlag] = useState('')
  const now = DateTime.now();

  function IpLocation() {
    const map = useMap();
    console.log('mapcenter:', map.getCenter());
    return null;
  }
  
  function Map() {
    return (
      <MapContainer className='map-container' center={[lat, lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <IpLocation />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]} />
      </MapContainer>
    )
  }

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Fetch location data from ipify
        const locationInfo = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${import.meta.env.VITE_API_KEY_IPIFY}`
        );
        const data = await locationInfo.json();
        setIp(data.ip);
        setCity(data.location.city);
        setCountry(data.location.country);
        setPostalCode(data.location.postalCode);
        setLat(data.location.lat);
        setLng(data.location.lng);
        
        // Fetch flag data from Rest Countries API
        const countryInfo = await fetch(`https://restcountries.com/v3.1/name/${data.location.country}`);
        const countryData = await countryInfo.json();
        const flagURL = countryData[0].flags.svg;
        setFlag(flagURL);
        // Log the country associated with the flag URL
        console.log('Country:', data.location.country);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLocation();
  }, []);



  return (
    <Card className='container'>
      <Card.Img className='ip-icon' variant="top" src={IPIcon} />
      <Card.Body>
        <Card.Title className='title'>IP Address Tracker</Card.Title>
          <Map lat={lat} lng={lng}/>
        <Card.Text className='card-text'>
          <div className='ip-address'>Your IP Address is: {ip}</div>
          <div>
            <span>{city}, {country} {postalCode}</span>
            <img src={flag} className='flag' alt='flag' />
          </div>
          <div>{lat}, {lng}</div>  
          <div>{DateTime.now().toLocaleString(DateTime.DATE_MED)} | {now.toFormat('hh:mm:ss')} {now.zoneName}</div>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}


