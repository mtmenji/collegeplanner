import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';

/*Partial Imports*/
import Header from './Partials/Header';
import Footer from './Partials/Footer';

/*Page Imports*/
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Planners from './Pages/Planners';
import Create from './Pages/Create';
import Settings from './Pages/Settings';
import NotFound from './Pages/NotFound';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Header/>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/planners' element={<Planners/>}/>
            <Route path='/create' element={<Create/>}/>
            <Route path='/settings' element={<Settings/>}/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </Router>
        <Footer/>
      </AuthProvider>
    </div>
  );
}

export default App;
