import React, { useState } from 'react'
import changePassword from '../services/users'

const ChangePasswordForm = () => {
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState('')

  const currentPassword = ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword.trim() === '') {
      setStatus('New password cannot be empty')
      return
    }

    try {
      await changePassword(currentPassword, newPassword)
      setStatus('Password updated successfully')
    } catch (error) {
      setStatus(`Error: ${error.message}`)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}

export default ChangePasswordForm
