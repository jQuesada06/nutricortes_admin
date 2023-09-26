import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import "./FinishSignup.css";

const FinishSignup = () => {
  const location = useLocation();
  const { fullName, email, uid } = location.state || {};

  const navigate = useNavigate();

  const displayNameParts = fullName.split(" "); // Assuming the space is the separator
  const firstName = displayNameParts[0];
  const lastName = displayNameParts.slice(1).join(" ");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data
          .map((country) => country.name.common)
          .sort((a, b) => a.localeCompare(b, "es"));

        setCountries(countryNames);
      } catch (error) {}
    };

    fetchCountries();
  }, []);

  const resetAllInputs = () => {
    setPhone("");
    setCountry("");
    setGender("");
    setDateOfBirth(null);
  };

  const handlePhoneChange = (event) => {
    let input = event.target.value.replace(/\D/g, "");

    if (event.nativeEvent.inputType === "deleteContentBackward") {
      if (input.length === 5) {
        input = input.substring(0, input.length - 1);
      }
    } else {
      input = input.slice(0, 8).replace(/(\d{4})(\d{0,4})/, "$1-$2");
    }

    const hasError = input.length < 8 && input.length > 0;

    setPhone(input);
    setPhoneError(hasError);
    console.log(phoneError);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleDateOfBirthChange = (event) => {
    setDateOfBirth(event.target.value);
  };

  const saveUserDataToFirestore = async (userData) => {
    try {
      const db = getFirestore();
      const usersCollectionRef = collection(db, "users");
      await addDoc(usersCollectionRef, userData);
    } catch (error) {
      throw error;
    }
  };

  const handleFinishSignup = async (e) => {
    e.preventDefault();
    if (!phone || !country || !gender || !dateOfBirth) {
      toast.error("Debe llenar todos los campos", { autoClose: 3000 });
      return;
    }
    try {
      const role = false;
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        country,
        gender,
        dateOfBirth,
        uid,
        role,
      };

      await saveUserDataToFirestore(userData);

      resetAllInputs();
      toast.success(`Usuario registrado con éxito`, {
        autoClose: 3000,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error finishing signup:", error);
      toast.error(`Error: ${error.message}`, { autoClose: 3000 });
    }
  };

  return (
    <Box component="form" width="50%" mx="auto">
      <Paper elevation={3} className="finish-signup-container">
        <Typography variant="h5" component="div">
          Finish Sign-up
        </Typography>

        <Tooltip title="Ejemplo: 8888-8888" arrow followCursor>
          <TextField
            className="phone-field"
            label="Phone"
            variant="outlined"
            value={phone}
            onChange={handlePhoneChange}
            margin="normal"
            autoComplete="off"
            error={phoneError}
            required
          />
        </Tooltip>
        <FormControl className="country-select">
          <InputLabel>Select Country</InputLabel>
          <Select value={country} onChange={handleCountryChange}>
            {countries.map((country, index) => (
              <MenuItem key={index} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="gender-date-container">
          <FormControl className="gender-field">
            <InputLabel>Género</InputLabel>
            <Select value={gender} onChange={handleGenderChange}>
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </Select>
          </FormControl>
          <div className="dob-container">
            <InputLabel>Fecha de Nacimiento</InputLabel>
            <TextField
              className="dob-field"
              type="date"
              id="date-of-birth"
              variant="outlined"
              value={dateOfBirth}
              onChange={handleDateOfBirthChange}
              margin="normal"
              autoComplete="off"
              required
            />
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFinishSignup}
        >
          Finish Sign-up
        </Button>
      </Paper>
    </Box>
  );
};

export default FinishSignup;
