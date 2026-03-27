import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth, API } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      // Connect to Socket.io - Point to the production backend URL
      const backendUrl = import.meta.env.VITE_API_BASE_URL || '';
      const socketOrigin = backendUrl.replace('/api', '') || window.location.origin;
      
      const newSocket = io(socketOrigin, {
        query: { userId: user._id },
        transports: ['websocket', 'polling'], // Support both for Render stability
        withCredentials: true
      });

      setSocket(newSocket);

      newSocket.on('new_notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show audio-visual toast
        toast.custom((t) => (
          <div 
            onClick={() => {
              if (notif.link) window.location.href = notif.link;
              markRead(notif._id);
              toast.dismiss(t.id);
            }}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl shadow-2xl border transition-all animate-slide-in cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
              t.visible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0',
              'bg-slate-900 border-brand-purple/50'
            )}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-purple/20 flex items-center justify-center shrink-0">
              {notif.sender?.profilePicture ? (
                <img src={notif.sender.profilePicture} className="w-full h-full object-cover" />
              ) : (
                <span className="text-brand-purple font-bold">{notif.title[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{notif.title}</p>
              <p className="text-gray-400 text-xs line-clamp-1">{notif.message}</p>
            </div>
          </div>
        ));
      });

      // Fetch initial notifications
      API.get('/notifications').then(res => {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      });

      return () => newSocket.close();
    }
  }, [user]);

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotif = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (!notifications.find(n => n._id === id)?.read) setUnreadCount(p => Math.max(0, p - 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, deleteNotif }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

// Pre-defined Tailwind animation extension needed in tailwind.config.js for Slide-in
const cn = (...classes) => classes.filter(Boolean).join(' ');
