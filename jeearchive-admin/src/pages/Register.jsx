import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import './Register.css';
import { FaGoogle } from "react-icons/fa";
import { IoMdMail, IoMdClose } from "react-icons/io";
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';


const GOOGLE_URL = import.meta.env.VITE_API_URL + '/auth/google';

const Register = () => {
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    role: "admin"
  });

  const [signinData, setSigninData] = useState({
    email: "",
    password: ""
  });

  const [withEmail, setWithEmail] = useState(false);
  const [signin, setSignin] = useState(true);

  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('admin_token', token);
      toast.success('Logged in with Google!');
      refreshUser().then(() => navigate('/user'));
    }
  }, [location.search]);

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSigninChange = (e) => {
    setSigninData({ ...signinData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', signupData);
      toast.success("User Registered Successfully");

      if (res.data.token && res.data.user.role === 'admin') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('admin_token', res.data.token);
        await refreshUser();
        navigate('/user');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', signinData);
      toast.success("User Logged In Successfully");

      if (res.data.token && res.data.user.role === 'admin') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('admin_token', res.data.token);
        await refreshUser();
        navigate('/user');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="register-form">
      <div className="left-side-register">
        <div className="slider">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`register-card register-card${(i % 3) + 1}`} />
          ))}
        </div>
      </div>

      <div className="right-side-register">
        {!withEmail ? (
          <>
            <div className="logo" />
            <div className="signup-heading">
              <h2 className='signup-h2'>Let's get <br /> started</h2>
              <p className='signup-p'>Bring your personal email, <br /> connect your work later</p>
            </div>
            <div className="signup-options">
              <button className='with-google' onClick={() => (window.location.href = GOOGLE_URL)}>
                <FaGoogle className='google-icon' /> Continue with Google
              </button>
              <button className='with-email' onClick={() => setWithEmail(true)}>
                <IoMdMail className='mail-icon' /> Continue with email
              </button>
            </div>
          </>
        ) : (
          <>
            <p><IoMdClose onClick={() => setWithEmail(false)} className='cross-icon' /></p>
            {!signin ? (
              <>
                <h2>Signup with <br /> email address</h2>
                <form onSubmit={handleSignup}>
                  <input name="firstName" placeholder="First Name" onChange={handleSignupChange} required />
                  <input name="lastName" placeholder="Last Name" onChange={handleSignupChange} required />
                  <input name="email" type="email" placeholder="Email" onChange={handleSignupChange} required />
                  <input name="password" type="password" placeholder="Password" onChange={handleSignupChange} required />
                  <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleSignupChange} required />
                  <button type="submit">Signup</button>
                </form>
                <p className='signup-signin-p'>Already have an account? <span onClick={() => setSignin(true)}>Signin</span></p>
              </>
            ) : (
              <>
                <h2>Signin with <br /> email address</h2>
                <form onSubmit={handleSignin}>
                  <input name="email" type="email" placeholder="Email" onChange={handleSigninChange} required />
                  <input name="password" type="password" placeholder="Password" onChange={handleSigninChange} required />
                  <button type="submit">Signin</button>
                </form>
                <p className='signup-signin-p'>Don't have an account? <span onClick={() => setSignin(false)}>Signup</span></p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
