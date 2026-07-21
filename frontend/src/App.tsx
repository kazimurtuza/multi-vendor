import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast'
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import SelectRole from './pages/SelectRole';
import LayOut from './components/LayOut';
import Account from './pages/Account';
import { useAppData } from './context/AppContext';
import Restaurant from './pages/Restaurant';
import MenuItems from './pages/MenuItems';
import AddMenuItem from './pages/AddMenuItem';

const App = () => {
   const { user } = useAppData();
   
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<PublicRoute />}>
               <Route path='/login' element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
               <Route path='/select-role' element={<SelectRole />} />
               {user && user?.role === 'seller' ? (
                  <>
                     <Route path='/' element={<Restaurant />} />
                     <Route path='/menu-items' element={<MenuItems />} />
                     <Route path='/add-menu-item' element={<AddMenuItem />} />
                  </>
               ) : (
                  <Route element={<LayOut />}>
                     <Route path='/' element={<Home />} />
                     <Route path='/account' element={<Account />} />
                  </Route>
               )}
            </Route>
         </Routes>
         <Toaster />
      </BrowserRouter>
   );
}
export default App 