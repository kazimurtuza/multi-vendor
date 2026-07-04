import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast'
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import SelectRole from './pages/SelectRole';
// import Navbar from './components/Navbar';
import LayOut from './components/LayOut';
import Account from './pages/Account';
const App = () => {
   return <>
      <BrowserRouter>
         {/* <Navbar /> */}
         <Routes>
            <Route element={<PublicRoute />} >
               <Route path='/login' element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />} >
               <Route path='/select-role' element={<SelectRole />} />
               <Route element={<LayOut />}>
                  <Route path='/' element={<Home />} />
                  <Route path='/account' element={<Account/>} />
               </Route>

            </Route>

         </Routes>
         <Toaster />
      </BrowserRouter>
   </>
}
export default App 