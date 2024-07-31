import { useEffect } from "react";
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import logo from "./logo.svg";
import "./App.css";

function App() {
  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });
        console.log("Token Gen", token);
        sendDataToServer(token);
      } else if (permission === "denied") {
        alert("You denied the notification");
      }
    } catch (error) {
      console.error("An error occurred while retrieving token. ", error);
    }
  }

  function sendDataToServer(token) {
    fetch('http://localhost:3000/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
