import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Home.css';
import { CgProfile } from "react-icons/cg";

const Home = ()=>{
    const [verified,setVerified] = useState(false);
    const [totalDonors,setTotalDonors] = useState("Complete Your details to get");
    const [totalRequests,setTotalRequests] = useState("Complete Your details to get");
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
        const countTotalDonors = async ()=>{
          try {
             const res = await fetch("http://localhost:3000/api/total-donors", {
              method:"GET",
              headers:{
                'Content-Type':'application/json'
              },
              credentials: "include", 
            })
            if (res.ok){
              const data = await res.json();
              const count = data.count ?? "Complete your details"
              setTotalDonors(count);
            }
          } catch (err) {
            console.error("Verification failed", err)
          }
        }
        checkAuth()
        countTotalDonors()
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
                              <button className="request-btn" onClick={e=>navigate('/request')}>Search</button>
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