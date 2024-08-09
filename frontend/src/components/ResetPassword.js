import { useSearchParams } from 'react-router-dom';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div>
      <h1>Reset Password</h1>
      <p>Token: {token}</p>
      {/* You can now use the token to handle password reset logic */}
    </div>
  );
}

export default ResetPassword;
