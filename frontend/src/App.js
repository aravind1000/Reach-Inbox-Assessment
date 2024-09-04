import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ListOfMail from './pages/ListOfMail';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { auth } from './firebase/config'; 
import { signOut } from 'firebase/auth';

function App() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('savedReplies');
      await signOut(auth);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-800">
        <img src="logo.jpeg" alt="Reach Me Inbox Logo" className="h-10" />
        <p className='flex justify-center text-white'>Ctrl + D - Delete, Ctrl + R - Reply, Ctrl + Shift + R - Reset</p>
        <div className="flex items-center gap-4">
          {currentUser && (
            <button 
              onClick={handleLogout} 
              className="bg-secondary text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ListOfMail />
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
