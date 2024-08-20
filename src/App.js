import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';

/* Component Imports */
import Header from './Components/Header';
import Footer from './Components/Footer';
import PrivateRoute from './Components/PrivateRoute';

/* Page Imports */
import Home from './Pages/Home';
import Register from './Pages/Register';
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import Planners from './Pages/Planners';
import Planner from './Pages/Planner';
import Week from './Pages/Week';
import PlannerCalendar from './Pages/PlannerCalendar';
import PlannerSettings from './Pages/PlannerSettings';
import Create from './Pages/Create';
import Settings from './Pages/Settings';
import NotFound from './Pages/NotFound';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Header/>
        <main className='content'>
          <Router>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/register' element={<Register/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/forgot' element={<ForgotPassword/>}/>
              <Route path='/planners' element={<PrivateRoute><Planners/></PrivateRoute>}/>
              <Route path='/planners/:id' element={<PrivateRoute><Planner/></PrivateRoute>}/>
              <Route path='/planners/:id/settings' element={<PrivateRoute><PlannerSettings/></PrivateRoute>}/>
              <Route path='/planners/:id/:weekid' element={<PrivateRoute><Week/></PrivateRoute>}/>
              <Route path='/create' element={<PrivateRoute><Create/></PrivateRoute>}/>
              <Route path='/settings' element={<PrivateRoute><Settings/></PrivateRoute>}/>
              <Route path='*' element={<NotFound/>}/>
            </Routes>
          </Router>
        </main>
        <Footer/>
      </AuthProvider>
    </div>
  );
}

export default App;