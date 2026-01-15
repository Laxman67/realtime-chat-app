import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUser, setOnlineUser } from './store/slices/authSlice';
import { connectSocket, disconnectSocket } from './lib/socket';

import {
  Router as BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, [getUser]);

  useEffect(() => {
    if (authUser) {
      const socket = connectSocket(authUser._id);
      socket.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUser(users));
      });
      return () => disconnectSocket();
    }
  }, [authUser]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to={'/'} />}
        />

        <Route
          path="/login"
          element={!authUser ? <Register /> : <Navigate to={'/'} />}
        />
        <Route
          path="/profile"
          element={!authUser ? <Profile /> : <Navigate to={'/login'} />}
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
