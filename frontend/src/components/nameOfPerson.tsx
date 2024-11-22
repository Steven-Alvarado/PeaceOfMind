import React, { useState, useEffect} from "react";
import axios from "axios";

type NameOfPersonProps = {
    userId: number | string | null;
};

const NameOfPerson: React.FC<NameOfPersonProps> = ({ userId }) => {
    const [fullName, setFullName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchUserName = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
          const { first_name, last_name } = response.data;
          setFullName(`${first_name} ${last_name}`);
        } catch (err) {
          setError("Failed to load user name.");
        }
      };
  
      fetchUserName();
    }, [userId]);
  
    if (error) {
      return <span>{error}</span>;
    }
  
    return <span>Welcome, {fullName || "Loading..."}</span>;
  };
  
  export default NameOfPerson;