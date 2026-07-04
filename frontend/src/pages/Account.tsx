import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext'
import toast from 'react-hot-toast';

function Account() {
    const { user, setUser,setIsAuth } = useAppData();
    const firstLetter = user?.name.charAt(0).toUpperCase();
    const navigate = useNavigate();

    const logoutHandler=()=>{
        localStorage.setItem('token',"");
        setUser(null);
        setIsAuth(false);
        navigate('/login');
        toast.success('logout successfully ')

    }
  return (
        <div>Account</div>
    )
}

export default Account