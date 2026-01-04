import '../css/Landing.css'
import { useNavigate } from 'react-router-dom'
const Landing = () => {
    const navigate = useNavigate();
    const handleRegister = () => navigate('/register');
    const handleLogin = () => navigate('/login');

    return (
        <div className="landing-page">
            <div className="landing-hero">
                <nav>
                    <div className="nav-login" onClick={handleLogin}>Login</div>
                    <div className="nav-register" onClick={handleRegister}>Register</div>
                </nav>

                <div className="landing-page-body">
                    <div className="hero">
                        <div>Donate Blood</div>
                        <div>Save Lives</div>
                    </div>
                </div>
            </div>

            <div className="mission">
                <h2>Our Mission</h2>
                <p>
                    BloodAid connects donors and recipients instantly to ensure that no
                    life is lost due to blood shortages. Together, we can make every drop count.
                </p>
            </div>

            <div className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div><strong>1.</strong> Register as a donor or requester.</div>
                    <div><strong>2.</strong> Find or offer blood in your area.</div>
                    <div><strong>3.</strong> Save lives through verified connections.</div>
                </div>
            </div>

            <footer className="footer">
                <p>© 2026 BloodAid | Saving lives, one drop at a time</p>
            </footer>
        </div>
    )
}

export default Landing
