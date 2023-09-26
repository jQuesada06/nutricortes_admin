import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/config";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import {
  TextField,
  Button,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetAllInputs = () => {
    setEmail("");
    setPassword("");
    setName("");
    setLastName("");
    setConfirmPassword("");
    setPhone("");
    setCountry("");
    setGender("");
    setDateOfBirth("");
  };

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

  const isEmailValid = (email) => {
    if (email.length === 0) return true;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
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
    const db = getFirestore();
    const usersCollectionRef = collection(db, "users");
    await addDoc(usersCollectionRef, userData);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !email ||
      password !== confirmPassword ||
      !password ||
      !confirmPassword ||
      !name ||
      !lastName ||
      !phone ||
      !country ||
      !gender ||
      !dateOfBirth
    ) {
      toast.error("Debe llenar todos los campos", { autoClose: 3000 });
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const role = false;

      await saveUserDataToFirestore({
        email,
        name,
        lastName,
        phone,
        country,
        gender,
        dateOfBirth,
        uid: user.uid,
        role,
      });

      resetAllInputs();
      toast.success(`Usuario registrado con éxito`, {
        autoClose: 3000,
      });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Este usuario ya está registrado", { autoClose: 3000 });
      } else {
        toast.error(`Error: ${error.message}`, { autoClose: 3000 });
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const db = getFirestore();
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error(`El usuario ya se encuentra registrado`, {
          autoClose: 3000,
        });
        navigate("/login");
      } else {
        resetAllInputs();
        navigate("/finishsignup", {
          state: {
            fullName: user.displayName,
            email: user.email,
            uid: user.uid,
          },
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, { autoClose: 3000 });
    }
  };

  return (
    <Box component="form" width="50%" mx="auto">
      <Paper elevation={3} className="signup-container">
        <Typography variant="h5" component="div" className="signup-label">
          Sign up
        </Typography>
        <Tooltip title="Ejemplo: email@domain.com" arrow followCursor>
          <TextField
            className="email-field"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            error={!isEmailValid(email)}
            margin="normal"
            autoComplete="off"
            required
          />
        </Tooltip>
        <TextField
          className="password-field"
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          margin="normal"
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />

        <TextField
          className="confirm-password-field"
          label="Confirm Password"
          variant="outlined"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          margin="normal"
          autoComplete="off"
          error={confirmPassword && confirmPassword !== password}
          helperText={
            confirmPassword && confirmPassword !== password
              ? "Passwords do not match"
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleToggleConfirmPassword}>
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />
        <TextField
          className="name-field"
          label="Name"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          margin="normal"
          autoComplete="off"
          required
        />
        <TextField
          className="last-name-field"
          label="Last Name"
          variant="outlined"
          value={lastName}
          onChange={handleLastNameChange}
          margin="normal"
          autoComplete="off"
          required
        />
        <Tooltip title="Ejemplo: 8888-8888" arrow followCursor>
          <TextField
            className="phone-field"
            label="Phone"
            variant="outlined"
            value={phone}
            onChange={handlePhoneChange}
            margin="normal"
            autoComplete="off"
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
          className="signup-button"
          variant="contained"
          color="primary"
          onClick={handleSignup}
        >
          Sign up
        </Button>
        <div className="google-signup-container">
          <span>or</span>
          <Button
            className="google-signup-button"
            variant="contained"
            color="primary"
            onClick={handleGoogleSignup}
          >
            Sign up with Google
          </Button>
        </div>
        <p>
          Already have an account? <NavLink to="/login">Login</NavLink>
        </p>
      </Paper>
    </Box>
  );
};

export default Signup;
