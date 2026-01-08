import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Home.css';
import { CgProfile } from "react-icons/cg";

const Home = ()=>{
    const [verified,setVerified] = useState(false);
    const [totalDonors,setTotalDonors] = useState(0);
    const [totalRequests,setTotalRequests] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
          try {
            const res = await fetch("http://localhost:3000/verify", {
              credentials: "include", 
            })
            if (res.ok) setVerified(true)
          } catch (err) {
            console.error("Verification failed", err)
          }
        }
        checkAuth()
      }, []);
    
    return(
        <>
            {verified && 
                (
                    <div className="home-page">
                        <nav>
                          <div className="logo"></div>
                          <div className="profile-icon">
                            <CgProfile className="profile-icon" />
                          </div>
                        </nav>
                        <div className="main">
                          <div className="row1">
                            <div className="donate">
                              <div>Be a donor</div>
                              <button className="donate-btn" onClick={e=>navigate('/donate')}>Donate</button>
                            </div>
                            <div className="request">
                              <div>Need a donor?</div>
                              <button className="request-btn">Search</button>
                            </div>
                          </div>
                          <div className="row2">
                            <div className="donors-in-area">
                              <div>Total donors in your area</div>
                              <button>{totalDonors}</button>
                            </div>
                            <div className="requests-in-area">
                              <div>Total requests in your area</div>
                              <button>{totalRequests}</button>
                            </div>
                          </div>
                        </div>
                    </div>
                )
            }
            {!verified &&
                (
                    <div>
                        Login to access this page
                    </div>
                )
            }
        </>

    )
}

export default Home;