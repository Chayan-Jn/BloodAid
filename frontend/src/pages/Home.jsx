import { useEffect,useState } from "react";


const Home = ()=>{
    const [verified,setVerified] = useState(false);
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
      }, [])
    return(
        <>
            {verified && 
                (
                    <div>
                        Home
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