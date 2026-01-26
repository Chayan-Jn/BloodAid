import { useState } from 'react'
import indiaData from '../data/india_states_districts.json'
import '../css/Request.css'

const RequestForm = () => {
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [districts, setDistricts] = useState([])
  const [bloodGroup, setBloodGroup] = useState('')
  const [units, setUnits] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleStateChange = (e) => {
    const stateName = e.target.value
    setSelectedState(stateName)
    const stateObj = indiaData.states.find(s => s.state === stateName)
    setDistricts(stateObj ? stateObj.districts : [])
    setSelectedDistrict('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const requestData = {
      bloodType: bloodGroup,
      location: { state: selectedState, district: selectedDistrict },
      units: units
    }

    try {
      const res = await fetch('https://bloodaid-004f.onrender.com/api/make-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
        credentials: 'include'
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess('Request submitted successfully!')
        setSelectedState('')
        setSelectedDistrict('')
        setDistricts([])
        setBloodGroup('')
        setUnits(1)
      } else {
        setError(data.message || 'Failed to submit request')
      }
    } catch {
      setError('Server error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="request-form-page">
      <div className="request-form-heading">Make a Blood Request</div>
      <form onSubmit={handleSubmit}>
        <div className="request-form-item">
          <label htmlFor="state">State</label>
          <select name="state" id="state" value={selectedState} onChange={handleStateChange} required>
            <option value="">Select State</option>
            {indiaData.states.map((item) => (
              <option key={item.state} value={item.state}>{item.state}</option>
            ))}
          </select>
        </div>

        <div className="request-form-item">
          <label htmlFor="district">District</label>
          <select
            name="district"
            id="district"
            value={selectedDistrict}
            disabled={!districts.length}
            onChange={e => setSelectedDistrict(e.target.value)}
            required
          >
            <option value="">Select District</option>
            {districts.map((d, idx) => (
              <option key={idx} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="request-form-item">
          <label htmlFor="bloodType">Blood Group</label>
          <select name="bloodType" id="bloodType" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} required>
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="request-form-item">
          <label htmlFor="units">Units Needed</label>
          <input
            type="number"
            min="1"
            max="10"
            value={units}
            onChange={e => setUnits(parseInt(e.target.value))}
            required
          />
        </div>

        <button type="submit" className="request-form-submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  )
}

export default RequestForm
