import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
// components
import ChangePasswordForm from './ChangePassword'
// services
import usersService from '../services/users'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  usersService.setToken(token)

  return (
    <div>
      <Link to="/"><button className='screenBtn'>Login</button></Link>
      <h1>Reset Password</h1>
      <p>Token: {token}</p>
      <ChangePasswordForm isRecoverPassword={true} />
    </div>
  )
}

export default ResetPassword
