// src/App.jsx
import { useState, useEffect } from "react";
import Wheel from "./components/Wheel";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userId) {
      axios
        .get(`${apiBaseUrl}/users/${userId}/wheel`)
        .then((response) => {
          if (response.data.items) {
            setItems(response.data.items);
          }
        })
        .catch((error) => console.error("Error fetching wheel:", error));
    }
  }, [userId]);

  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const resetItems = () => {
    setItems([]);
    if (userId) {
      axios
        .post(`${apiBaseUrl}/users/${userId}/wheel`, { items: [] })
        .then((response) => console.log("Wheel reset"))
        .catch((error) => console.error("Error resetting wheel:", error));
    }
  };

  const handleSaveWheel = () => {
    if (userId) {
      axios
        .post(`${apiBaseUrl}/users/${userId}/wheel`, { items })
        .then((response) => console.log("Wheel saved"))
        .catch((error) => console.error("Error saving wheel:", error));
    }
  };

  const handleAddUser = () => {
    axios
      .post(`${apiBaseUrl}/users`, { username })
      .then((response) => {
        setUserId(response.data.user_id);
        setMessage("User added successfully");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setMessage("User already exists");
          axios
            .get(`${apiBaseUrl}/users?username=${username}`)
            .then((res) => {
              setUserId(res.data.user_id);
            })
            .catch((err) => console.error("Error fetching user ID:", err));
        } else {
          setMessage("Error adding user");
        }
      });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Ruleta de la Suerte</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nombre de usuario"
      />
      <button onClick={handleAddUser}>Añadir Usuario</button>
      {message && <div>{message}</div>}
      <br />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Añadir elemento"
      />
      <button onClick={addItem}>Añadir</button>
      <button onClick={resetItems}>Restablecer</button>
      <button onClick={handleSaveWheel}>Guardar Ruleta</button>
      <Wheel items={items} />
    </div>
  );
};

export default App;
