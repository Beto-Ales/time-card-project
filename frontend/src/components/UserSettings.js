import React, { useState } from 'react'
import ChangePasswordForm from './ChangePassword'
import ChangeEmailForm from './ChangeEmail'

const UserSettings = () => {
  const [activeForm, setActiveForm] = useState('')

  const handleShowChangePassword = () => {
    setActiveForm('changePassword')
  }

  const handleShowChangeEmail = () => {
    setActiveForm('changeEmail')
  }

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <button onClick={handleShowChangePassword}>Change Password</button>
        <button onClick={handleShowChangeEmail}>Change Email</button>
      </div>
      <div>
        {activeForm === 'changePassword' && <ChangePasswordForm isRecoverPassword={false} />}
        {activeForm === 'changeEmail' && <ChangeEmailForm />}
      </div>
    </div>
  )
}

export default UserSettings
