import { useState, useEffect } from 'react'
import '../css/AreaRequests.css'

const AreaRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('https://bloodaid-fly0.onrender.com/api/my-area-requests', {
          credentials: 'include'
        })
        const data = await res.json()
        if (res.ok) setRequests(data.requests || [])
        else setError(data.message || 'Failed to fetch area requests')
      } catch {
        setError('Server error. Try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  return (
    <div className="area-requests-page">
      <h2>Requests In Your Area</h2>

      {loading && <p className="loading-message">Loading requests...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && requests.length === 0 && (
        <p className="no-requests">No requests found in your area.</p>
      )}

      <div className="requests-list">
        {requests.map((req, index) => (
          <div key={index} className="request-card">
            <div className="request-row">
              <span className="label">Request Id:</span>
              <span className="value">{req._id}</span>
            </div>
            <div className="request-row">
              <span className="label">Blood Type:</span>
              <span className="value">{req.bloodType}</span>
            </div>
            <div className="request-row">
              <span className="label">Units Needed:</span>
              <span className="value">{req.unitsNeeded}</span>
            </div>
            <div className="request-row">
              <span className="label">Location:</span>
              <span className="value">{req.location.state}, {req.location.district}</span>
            </div>
            <div className="request-row">
              <span className="label">Status:</span>
              <span className={`status ${req.status}`}>{req.status}</span>
            </div>
            <div className="request-row">
              <span className="label">Requested On:</span>
              <span className="value">{new Date(req.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AreaRequests
