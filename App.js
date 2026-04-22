import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isLoginView, setIsLoginView] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    fatherName: "",
    motherName: "",
    month: "",
    day: "",
    year: ""
  });
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [loginErrors, setLoginErrors] = useState({});

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      // Initialize empty users array if not exists
      localStorage.setItem('users', JSON.stringify([]));
    }

    // Check for existing session
    const sessionUser = localStorage.getItem('currentUser');
    if (sessionUser) {
      setLoggedInUser(JSON.parse(sessionUser));
    }
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || (['month', 'day', 'year'].includes(name) && errors.dob)) {
      setErrors((prev) => ({ ...prev, [name]: null, dob: ['month', 'day', 'year'].includes(name) ? null : prev.dob }));
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";

    if (!formData.email) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.fatherName) newErrors.fatherName = "Father's Name is required";
    if (!formData.motherName) newErrors.motherName = "Mother's Name is required";

    if (!formData.month || !formData.day || !formData.year) {
      newErrors.dob = "Please complete your Date of Birth";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if user already exists
      const userExists = existingUsers.some(u => u.email === formData.email);

      if (userExists) {
        setErrors({ email: "Email is already registered" });
        return;
      }

      // Create user object with all data including DOB
      const newUser = {
        id: Date.now(), // Unique ID for the user
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dateOfBirth: {
          month: formData.month,
          day: formData.day,
          year: formData.year
        },
        registeredAt: new Date().toISOString()
      };

      // Add new user to the array
      existingUsers.push(newUser);

      // Save updated users array to localStorage
      localStorage.setItem('users', JSON.stringify(existingUsers));

      alert("Registration successful! Please login.");

      // Reset form data
      setFormData({
        firstName: "", lastName: "", email: "", password: "",
        fatherName: "", motherName: "", month: "", day: "", year: ""
      });

      // Switch to login view
      setIsLoginView(true);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginData.email) newErrors.email = "Email Address is required";
    if (!loginData.password) newErrors.password = "Password is required";

    setLoginErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Get users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // Find user with matching email and password
      const user = existingUsers.find(u => u.email === loginData.email && u.password === loginData.password);

      if (user) {
        alert("Login successful!");
        setLoggedInUser(user);
        // Store current user session in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Reset login form
        setLoginData({ email: "", password: "" });
      } else {
        setLoginErrors({ general: "Invalid email or password" });
      }
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    // Remove current user session from localStorage
    localStorage.removeItem('currentUser');
    setLoginData({ email: "", password: "" });
    alert("Logged out successfully!");
  };

  // Function to view all registered users (for debugging/admin purposes)
  const viewAllUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('All registered users:', users);
    alert(`Total registered users: ${users.length}\nCheck console for details`);
  };

  const errorStyle = { color: "#e74c3c", fontSize: "12px", marginTop: "5px", display: "block" };
  const switchStyle = { color: "#2e8b57", cursor: "pointer", textDecoration: "underline", background: "none", border: "none", padding: 0, font: "inherit" };

  if (loggedInUser) {
    return (
      <div className="container">
        <h1 className="logo"></h1>
        <div className="form-box" style={{ textAlign: 'center' }}>
          <h2>Welcome, {loggedInUser.firstName} {loggedInUser.lastName}!</h2>
          <div style={{ textAlign: 'left', marginTop: '20px' }}>
            <p><strong>Email:</strong> {loggedInUser.email}</p>
            <p><strong>Father's Name:</strong> {loggedInUser.fatherName}</p>
            <p><strong>Mother's Name:</strong> {loggedInUser.motherName}</p>
            <p><strong>Date of Birth:</strong> {loggedInUser.dateOfBirth?.month} {loggedInUser.dateOfBirth?.day}, {loggedInUser.dateOfBirth?.year}</p>
            <p><strong>Registered on:</strong> {new Date(loggedInUser.registeredAt).toLocaleDateString()}</p>
          </div>
          <button className="btn" onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="logo"></h1>
      <div className="form-box">
        <h2>{isLoginView ? 'Login' : 'Online Registration'}</h2>

        {isLoginView ? (
          <form onSubmit={handleLoginSubmit}>
            {loginErrors.general && <div style={{ ...errorStyle, marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{loginErrors.general}</div>}

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="text"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Email Address"
              />
              {loginErrors.email && <span style={errorStyle}>{loginErrors.email}</span>}
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Password"
              />
              {loginErrors.password && <span style={errorStyle}>{loginErrors.password}</span>}
            </div>

            <button type="submit" className="btn" style={{ marginBottom: '15px' }}>Login</button>
            <p style={{ textAlign: "center", fontSize: "14px" }}>
              Don't have an account? <button type="button" onClick={() => setIsLoginView(false)} style={switchStyle}>Register here</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="row">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleRegisterChange}
                  placeholder="First Name"
                />
                {errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
              </div>

              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleRegisterChange}
                  placeholder="Last Name"
                />
                {errors.lastName && <span style={errorStyle}>{errors.lastName}</span>}
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleRegisterChange}
                placeholder="Email Address"
              />
              {errors.email && <span style={errorStyle}>{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleRegisterChange}
                placeholder="Create a Password"
              />
              {errors.password && <span style={errorStyle}>{errors.password}</span>}
            </div>

            <div className="input-group">
              <label>Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleRegisterChange}
                placeholder="Father's Name"
              />
              {errors.fatherName && <span style={errorStyle}>{errors.fatherName}</span>}
            </div>

            <div className="input-group">
              <label>Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleRegisterChange}
                placeholder="Mother's Name"
              />
              {errors.motherName && <span style={errorStyle}>{errors.motherName}</span>}
            </div>

            <div className="input-group">
              <label>Date of Birth</label>
              <div className="dob">
                <select name="month" value={formData.month} onChange={handleRegisterChange}>
                  <option value="">Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>

                <select name="day" value={formData.day} onChange={handleRegisterChange}>
                  <option value="">Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>

                <select name="year" value={formData.year} onChange={handleRegisterChange}>
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {errors.dob && <span style={errorStyle}>{errors.dob}</span>}
            </div>

            <button type="submit" className="btn" style={{ marginBottom: '15px' }}>Register</button>
            <p style={{ textAlign: "center", fontSize: "14px" }}>
              Already have an account? <button type="button" onClick={() => setIsLoginView(true)} style={switchStyle}>Login here</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;