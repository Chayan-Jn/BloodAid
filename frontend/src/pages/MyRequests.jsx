import { useState, useEffect } from 'react'
import '../css/MyRequests.css'

const MyRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('https://bloodaid-fly0.onrender.com/api/my-requests', {
          credentials: 'include'
        })
        const data = await res.json()
        if (res.ok) setRequests(data.requests || [])
        else setError(data.message || 'Failed to fetch requests')
      } catch {
        setError('Server error. Try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  return (
    <div className="my-requests-page">
      <h2>My Requests</h2>

      {loading && <p className="loading-message">Loading requests...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && requests.length === 0 && <p className="no-requests">No requests found.</p>}

      <div className="requests-list">
        {requests.map((req, index) => (
          <div key={index} className="request-card">
            <div className="request-row">
              <span className='label'>Request Id:</span>
              <span className='value'>{req._id}</span>
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
              <select
                value={req.status}
                onChange={async (e) => {
                  const newStatus = e.target.value
                  try {
                    const res = await fetch('https://bloodaid-fly0.onrender.com/api/change-status', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({ reqId: req._id, status: newStatus })
                    })
                    if (res.ok) {
                      setRequests((prev) =>
                        prev.map((r) => (r._id === req._id ? { ...r, status: newStatus } : r))
                      )
                    } else {
                      alert('Failed to update status')
                    }
                  } catch {
                    alert('Server error while updating status')
                  }
                }}
              >
                <option value="pending">Pending</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
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

export default MyRequests
