export const requestOTP = async ({ email, lastOtpTime, setMessage }) => {
    const now = Date.now();
    if (now - lastOtpTime.current < 15000) { // has 15s passed (throttle)
        console.log("Please wait a bit before requesting another OTP")
        setMessage("Please wait a bit before requesting another OTP")
        return;
    }
    else if (!email) {
        setMessage("Email can't be empty ")
        return;
    }
    await fetch('https://bloodaid-004f.onrender.com/email-otp', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email
        }),
        credentials: "include"
    });
    setMessage("Enter OTP")
    lastOtpTime.current = now;
}

