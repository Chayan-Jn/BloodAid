import { useState, useRef } from "react"
import { requestOTP } from "../utils/requestOtp";
import { useNavigate } from 'react-router-dom'
import '../css/Login.css'

const Login = () => {
    const [loginType, setLoginType] = useState('password');
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')
    const lastOtpTime = useRef(0);
    const navigate = useNavigate();


    const switchLoginType = async () => {
        if (loginType === "password") {
            setLoginType("otp");
            await requestOTP({ email, lastOtpTime, setMessage });
        }
        else if (loginType === "otp") {
            setLoginType("password")
        }
    }
    const handleLogin = async () => {
        try {
            if (!email) {
                setMessage("Fill Email")
                return;
            }
            if (loginType === "otp") {
                if (!otp) {
                    setMessage("Enter OTP");
                    return;
                }
                else if (!/^\d{6}$/.test(otp)) {
                    setMessage("Invalid OTP");
                    return;
                }
            }
            else if (loginType === "password") {
                if (!password) {
                    setMessage("Enter Password");
                    return;
                }
            }
            const res = await fetch('https://bloodaid-fly0.onrender.com/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    loginType: loginType,
                    otp: otp
                }),
                credentials: "include"
            })
            const data = await res.json();
            setMessage(data.message);
            navigate('/home');

        }
        catch (err) {
            console.error(err);
            setMessage("Server error while logging in ");
        }
    }
    return (
        <div className="login-page">
            <div className="l-msg">{message}</div>
            <div className="login-heading">LOGIN</div>
            <div className="login-inputs">
                <div className="input-box">
                    <label htmlFor="email" >Email</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                {loginType === "password" &&
                    <>
                        <div className="input-box">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="Enter Password" value={password}
                                onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="login-pswd">
                            <div className="login-type otp-btn" onClick={switchLoginType}>{`Login using OTP?`}</div>
                            <div className="login-btn-pswd" onClick={handleLogin}>Login</div>
                        </div>
                    </>
                }
                {loginType === "otp" &&
                    <>
                        <div className="input-box">
                            <label htmlFor="otp">OTP</label>
                            <input type="text" id="otp" maxLength={6} placeholder="Enter OTP sent to your Email" onChange={e => setOTP(e.target.value)} value={otp} />
                        </div>
                        <div className="login-otp">
                            <div className="login-type l-button" onClick={switchLoginType}>{`Login using Password?`}</div>
                            <div className="resend-otp l-button" onClick={async () => { await requestOTP({ email, lastOtpTime, setMessage }) }}>Resend OTP</div>
                        </div>
                        <div className="login-btn-otp" onClick={handleLogin}>Login</div>
                    </>
                }
            </div>
        </div>
    )
}

export default Login;