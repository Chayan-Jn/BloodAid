import { useState, useRef } from "react";
import '../css/Register.css'
import { requestOTP } from "../utils/requestOtp";
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [askedForOTP, setAskedForOTP] = useState(false);
    const [message, setMessage] = useState('')
    const lastOtpTime = useRef(0);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            if (!email || !password || !otp) {
                setMessage("Fill all fields ")
                return;
            }
            if (!/^\d{6}$/.test(otp)) {
                setMessage("Invalid OTP");
                return;
            }
            const res = await fetch('https://bloodaid-004f.onrender.com/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                    otp
                }),
                credentials: "include"
            })
            const data = await res.json();
            if (data.ok) {
                setMessage("Registered successfully!");
                navigate('/home')
            } else {
                setMessage(data.message || "Registration failed");
            }
        }
        catch (err) {
            console.error(err);
            setMessage("Server error while registering ");
        }

    }
    const otpRequested = async (e) => {
        setAskedForOTP(true);
        await requestOTP({ email, setMessage, lastOtpTime });

    }

    return (
        <div className="register-page">
            <div className="r-msg">{message}</div>
            <div className="register-heading">Register</div>
            <div className="register-inputs">
                <div className="input-box">
                    <label htmlFor="email">Email ID</label>
                    <input type="tel" id="email" onChange={e => setEmail(e.target.value)} value={email} />
                </div>
                <div className="input-box">
                    <label htmlFor="password">Create Password</label>
                    <input type="password" id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                </div>
                {askedForOTP === true &&
                    <div className="input-box">
                        <label htmlFor="otp">OTP</label>
                        <input type="text" id="otp" maxLength={6} placeholder="Enter OTP sent to Email" value={otp} onChange={e => setOtp(e.target.value)} />
                    </div>
                }
                <div className="r-buttons">
                    {askedForOTP === false &&
                        <button className="request-otp" onClick={otpRequested}>
                            Request OTP
                        </button>
                    }
                    <button onClick={handleRegister} className="register-btn">Register</button>
                </div>
            </div>
        </div>
    )
}

export default Register