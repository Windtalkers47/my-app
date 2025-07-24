import { useState } from 'react';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert('Password reset successful');
    } catch (err) {
      console.error(err);
      alert('Reset failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <input
        className="w-full p-2 border mb-3 rounded"
        placeholder="Enter your reset token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <input
        className="w-full p-2 border mb-3 rounded"
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset} className="w-full bg-green-600 text-white p-2 rounded">
        Reset Password
      </button>
    </div>
  );
}

