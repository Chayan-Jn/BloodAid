import '../css/ProfilePopup.css'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaTint, FaSignOutAlt } from 'react-icons/fa'

const ProfilePopup = ({ user, onClose, onLogout }) => {
  const navigate = useNavigate()
  if (!user) return null

  const { name, email, bloodType } = user

  return (
    <div className="profile-popup-card">
      <div className="popup-header">
        <h2>{name}</h2>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>

      <div className="popup-content">
        <div className="info-row">
          <FaEnvelope className="icon" />
          <span>{email}</span>
        </div>
        <div className="info-row">
          <FaTint className="icon" />
          <span>Blood Group: {bloodType}</span>
        </div>
      </div>

      <div className="popup-actions">
        <button 
          className="request-btn" 
          onClick={() => {
            onClose()
            navigate('/request')
          }}
        >
          Make a Request
        </button>

        <button 
          className="update-btn" 
          onClick={() => {
            onClose()
            navigate('/profile/edit')
          }}
        >
          Update Details
        </button>

        <button 
          className="your-requests-btn" 
          onClick={() => {
            onClose()
            navigate('/my-requests')
          }}
        >
          Your Requests
        </button>

        <button
          className="logout-btn"
          onClick={() => {
            onClose()
            onLogout?.()
          }}
        >
          <FaSignOutAlt className="icon-small" /> Logout
        </button>
      </div>
    </div>
  )
}

export default ProfilePopup
