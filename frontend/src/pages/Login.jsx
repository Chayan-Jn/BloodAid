import { useState, useRef } from "react"
import { requestOTP } from "../utils/requestOtp";
import '../css/Login.css'

const Login = () => {
    const [loginType, setLoginType] = useState('password');
    const [email, setEmail] = useState('');
    const [otp,setOTP] = useState('');
    const [password, setPassword] = useState('');
    const [message,setMessage] = useState('Login')
    const lastOtpTime = useRef(0);


    const switchLoginType = async () => {
        if (loginType === "password") {
            setLoginType("otp");
            await requestOTP({email,lastOtpTime,setMessage});
        }
        else if (loginType === "otp") {
            setLoginType("password")
        }
    }
    const handleLogin = async ()=>{
        try{
            if(!email || !password ){
                setMessage("Fill all fields ")
                return;
            }
            if(loginType==="otp"){
                if(!otp) setMessage("Enter OTP");
                else if (!/^\d{6}$/.test(otp)) {
                    setMessage("Invalid OTP");
                }
                return;
            }
        }
        catch (err) {
            console.error(err);
            setMessage("Server error while logging in ");
        }
    }
    return (
        <div className="login-page">
            <div className="login-heading">{message}</div>
            <div className="login-inputs">
                <div className="input-box">
                    <label htmlFor="email" >Email</label>
                    <input type="tel" id="email" value={email} onChange={e => setEmail(e.target.value)} />
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
                            <input type="text" id="otp" maxLength={6} placeholder="Enter OTP sent to your Email" onChange={e=>setOTP(e.target.value)}/>
                        </div>
                        <div className="login-otp">
                            <div className="login-type l-button" onClick={switchLoginType}>{`Login using Password?`}</div>
                            <div className="resend-otp l-button" onClick={async ()=>{await requestOTP({email,lastOtpTime,setMessage})}}>Resend OTP</div>
                        </div>
                        <div className="login-btn-otp" onClick={handleLogin}>Login</div>
                    </>
                }
            </div>
        </div>
    )
}

export default Login;