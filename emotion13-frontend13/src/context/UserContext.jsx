import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get("http://127.0.0.1:8000/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        } catch (err) {
         console.error("Error fetching user data", err);
          setUser(null);
        }
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
