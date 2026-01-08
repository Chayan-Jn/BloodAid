import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import indiaData from '../data/india_states_districts.json'
import '../css/Donate.css'

const Donate = () => {
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [districts, setDistricts] = useState([])
  const [bloodGroup, setBloodGroup] = useState('')
  const [contact, setContact] = useState('')
  const navigate = useNavigate()

  const handleStateChange = (e) => {
    const stateName = e.target.value
    setSelectedState(stateName)
    const stateObj = indiaData.states.find(s => s.state === stateName)
    setDistricts(stateObj ? stateObj.districts : [])
    setSelectedDistrict('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const donorData = {
      state: selectedState,
      district: selectedDistrict,
      bloodType: bloodGroup,
      mobile:contact
    }
    const res = await fetch('http://localhost:3000/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData),
      credentials:"include"
    })
    if (res.ok){
      alert('Details saved successfully!');
      navigate('/home')
    }
    else alert('Failed to save details')
  }

  return (
    <div className="donate-page">
      <div className="donate-page-heading">Select Area You Can Donate In</div>
      <form onSubmit={handleSubmit}>
        <div className="donate-form-item">
          <label htmlFor="state">State</label>
          <select name="state" id="state" value={selectedState} onChange={handleStateChange} required>
            <option value="">Select State</option>
            {indiaData.states.map((item) => (
              <option key={item.state} value={item.state}>{item.state}</option>
            ))}
          </select>
        </div>

        <div className="donate-form-item">
          <label htmlFor="district">District</label>
          <select name="district" id="district" disabled={!districts.length} onChange={e=>setSelectedDistrict(e.target.value)} value={selectedDistrict} required>
            <option value="">Select District</option>
            {districts.map((d, index) => (
              <option key={index} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="donate-form-item">
          <label htmlFor="bloodType">Blood Group</label>
          <select name="bloodType" id="bloodType" value={bloodGroup} onChange={e=>setBloodGroup(e.target.value)} required>
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

        <div className="donate-form-item">
          <label htmlFor="contact">Contact Number</label>
          <input type="tel" name="contact" id="contact" placeholder="Enter your number" value={contact} onChange={e=>setContact(e.target.value)}   pattern="[0-9]{10}"
            title="Please enter a 10-digit number" required/>
        </div>

        <button type="submit" className="donate-form-submit-btn">Save Details</button>
      </form>
    </div>
  )
}

export default Donate
