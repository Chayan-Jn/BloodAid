import { useState, useEffect } from 'react'
import indiaData from '../data/india_states_districts.json'
import '../css/Update.css'

const UpdateProfile = () => {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    age: '',
    bloodType: '',
    state: '',
    district: '',
    gender: ''
  })
  const [districts, setDistricts] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'))
    if (storedUser) {
      setUser(storedUser)
      setFormData({
        name: storedUser.name || '',
        mobile: storedUser.mobile || '',
        age: storedUser.age || '',
        bloodType: storedUser.bloodType || '',
        state: storedUser.location?.state || '',
        district: storedUser.location?.district || '',
        gender: storedUser.gender || ''
      })

      // set districts based on saved state
      const stateObj = indiaData.states.find(s => s.state === storedUser.location?.state)
      setDistricts(stateObj ? stateObj.districts : [])
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleStateChange = (e) => {
    const stateName = e.target.value
    setFormData(prev => ({ ...prev, state: stateName, district: '' }))

    const stateObj = indiaData.states.find(s => s.state === stateName)
    setDistricts(stateObj ? stateObj.districts : [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('https://bloodaid-004f.onrender.com/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Profile updated successfully!')
        sessionStorage.setItem('user', JSON.stringify({ ...user, ...formData }))
      } else setMessage(data.message || 'Failed to update profile')
    } catch {
      setMessage('Server error. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className="update-page">
      <h2>Update Profile</h2>

      <form onSubmit={handleSubmit} className="update-form">
        <div className="form-group">
          <label>Email (cannot be changed)</label>
          <input type="email" value={user.email} disabled />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mobile</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Blood Group</label>
          <select name="bloodType" value={formData.bloodType} onChange={handleChange} required>
            <option value="">Select</option>
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

        <div className="form-group">
          <label>State</label>
          <select name="state" value={formData.state} onChange={handleStateChange} required>
            <option value="">Select State</option>
            {indiaData.states.map(s => (
              <option key={s.state} value={s.state}>{s.state}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            disabled={!districts.length}
            required
          >
            <option value="">Select District</option>
            {districts.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  )
}

export default UpdateProfile
