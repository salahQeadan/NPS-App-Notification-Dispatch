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
          vapidKey: "BI4QhL1rkwZqDufE82fiT2ZT2FJOmatw22vUeR7RbU7dkg20BuyNeot-9t8cq0rJpG7L_WO27LN9AKn3yYvlQwc",
        });
        console.log("Token Gen", token);
        // Send this token to the server (database)
      } else if (permission === "denied") {
        alert("You denied the notification");
      }
    } catch (error) {
      console.error("An error occurred while retrieving token. ", error);
    }
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