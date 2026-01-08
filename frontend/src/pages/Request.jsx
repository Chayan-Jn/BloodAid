import { useState } from 'react'
import indiaData from '../data/india_states_districts.json'
import '../css/Donate.css'

const Request = () => {
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [districts, setDistricts] = useState([])
  const [bloodGroup, setBloodGroup] = useState('')
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(false)
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
    setDonors([])

    const requestData = {
      state: selectedState,
      district: selectedDistrict,
      bloodType: bloodGroup
    }

    try {
      const res = await fetch('http://localhost:3000/api/find-donor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
        credentials: 'include'
      })
      const data = await res.json()

      if (res.ok && data.donors?.length) {
        console.log('donors are ',data.donors);
        setDonors(data.donors)
      } else {
        setError(data.message || 'No donors found in this area')
      }
    } catch (err) {
      console.log(err)
      setError('Server error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="request-page">
      <div className="request-page-heading">Find a Donor</div>

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
          <select name="district" id="district" disabled={!districts.length} onChange={e => setSelectedDistrict(e.target.value)} value={selectedDistrict} required>
            <option value="">Select District</option>
            {districts.map((d, index) => (
              <option key={index} value={d}>{d}</option>
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

        <button type="submit" className="request-form-submit-btn" disabled={loading}>
          {loading ? 'Searching.....' : 'Find Donor'}
        </button>
      </form>

      {/* Conditinal rendering of results we get */}
      <div className="results-section">
        {error && <p className="error-message">{error}</p>}

        {donors.length > 0 && (
          <div className="donor-results">
            <h3>Available Donors</h3>
            <ul>
              {donors.map((donor, index) => (
                <li key={index}>
                  <strong>{donor.name || donor.email}</strong>
                  <strong>{donor.bloodType}  </strong>
                  <br />
                  {donor.location.state}, {donor.location.district}
                  <br />
                  Contact: {donor.mobile || 'Not provided'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Request
