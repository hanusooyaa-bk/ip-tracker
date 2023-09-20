import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [current, setCurrent] = useState('');

  const [external, setExternal] = useState('');




  const [vpn, setVpn] = useState(null);


  const ct = require('countries-and-timezones');


  const url = 'https://api.ipgeolocation.io/timezone?apiKey=0db8f5fe0d5a4f2db04e86b993f7d0aa';



  const ipinfo = async () => {

    const request = await fetch("https://ipinfo.io/json?token=ec61ae602f34a3");
    // const request = await fetch("https://ipinfo.io/json?token=0a44b396fc504c")
    const jsonResponse = await request.json()
    setVpn(jsonResponse)
    console.log(jsonResponse)


  }

  const timezone = async (url) => {
    try {

      const response = await axios.get(url)
      const data = await (response.data)
      setVpn(data)
      console.log(data)

    }
    catch (error) {
      console.log("Error:"+error)
    }
  }


  const servers = {
    iceServers: [


      {
        urls: ['stun:stun.l.google.com:19302'],
      },

    ],
    iceCandidatePoolSize: 10,
  };


  function determineIps() {
    const pc = new RTCPeerConnection(servers);
    pc.createDataChannel("");
    pc.createOffer().then(offer => pc.setLocalDescription(offer))
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) {
        console.log("all done")
        pc.close();
        return;
      }
      let split = ice.candidate.candidate.split(" ");
      if (split[7] === "host") {
        console.log(`Local Ip: ${split[4]}`);
        setCurrent(split[4])
      } else {
        console.log(`External Ip  ${split[4]}`);
        setExternal(split[4])
      }
    };
  }


  function getStartup(data, systemTimezone) {


    if (data === systemTimezone) {
      return true
    } else {

      return false


    }

  }


  const machine = Intl.DateTimeFormat().resolvedOptions().timeZone

  const timeZoness = ct.getCountryForTimezone(machine)







  useEffect(() => {


    setInterval(() => {
      determineIps();
      timezone(url);
      ipinfo();
    }, 5000);

    return () => {


      determineIps();
      timezone(url);
      ipinfo();


    };



  }, [])

  return (
    <div className="App">

      <img className='hg' src='https://vpnapi.io/assets/img/map.svg' alt="img" />

      <h1 className='hs'>TEAM BUGZ</h1>

      {vpn && <div>
        {vpn.ip === external ? getStartup(vpn.country, timeZoness.id) ? <div>
          <h1>VPN         -  NO VPN DETECTED </h1>
          <h1>ORIGINAL IP  - {external}</h1>
          <h1>LOCATION    - {vpn.company.name} {vpn.city} </h1>
          <h1>REGION      - {vpn.region}</h1>
          <h1>TIMEZONE    - {vpn.timezone}</h1>
          {vpn.privacy.tor ? <h1>TOR USED</h1> : false}
        </div> :
          <div>
            <h1>VPN         -  VPN DETECTED</h1>
            <h1>VPN IP      - {vpn.ip}</h1>
            <h1>ORIGINAL IP - {external}</h1>
            <h1>VPN LOCATION    - {vpn.company.name} {vpn.city}</h1>
            <h1>REGION      - {vpn.region}</h1>
            <h1>TIMEZONE    - {vpn.timezone}</h1>
            {vpn.privacy.tor ? <h1>TOR USED</h1> : false}
          </div>
          : <div>
            <h1>VPN         -  VPN DETECTED</h1>
            <h1>VPN IP      - {vpn.ip}</h1>
            <h1>ORIGINAL IP - {external}</h1>
            <h1>VPN LOCATION    - {vpn.company.name} {vpn.city}</h1>
            <h1>REGION      - {vpn.region}</h1>
            <h1>TIMEZONE    - {vpn.timezone}</h1>
            {vpn.privacy.tor ? <h1>TOR USED</h1> : false}
          </div>
        }
      </div>}
    </div>
  );
}

export default App;
