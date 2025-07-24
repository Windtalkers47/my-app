// import { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';

// export default function ResetPassword() {
//   const [searchParams] = useSearchParams();
//   const [newPassword, setNewPassword] = useState('');
//   const [status, setStatus] = useState('');
//   const token = searchParams.get('token');

//   const handleReset = async () => {
//     if (!token) {
//       setStatus('Invalid or missing token');
//       return;
//     }

//     try {
//       const res = await fetch('/api/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token, newPassword }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setStatus('Password reset successful. You can now log in.');
//       } else {
//         setStatus(data.message || 'Error resetting password.');
//       }
//     } catch (err) {
//       setStatus('Server error.');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
//         <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
//         <input
//           type="password"
//           className="w-full p-2 border mb-4 rounded"
//           placeholder="Enter new password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//         />
//         <button
//           onClick={handleReset}
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//         >
//           Reset Password
//         </button>
//         {status && <p className="mt-4 text-center text-sm text-red-600">{status}</p>}
//       </div>
//     </div>
//   );
// }

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

