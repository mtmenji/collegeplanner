import React, { useRef, useState, useEffect } from 'react';
import './Navbar.css';
import { useAuth } from '../Contexts/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { usePlannerContext } from '../Contexts/PlannerContext';
const firestore = getFirestore();

function Navbar() {

    /* Header ************************************************************************************/
    const { plannerName } = usePlannerContext();

    /* Humburger Menu Functionality **************************************************************/
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
    setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
    
      const handleLinkClick = () => {
        setIsOpen(false);
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

  /* Dark Mode Functionality ************************************************************************/
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
        const body = document.body;
        body.classList.toggle('dark-mode');
        setIsDarkMode(!isDarkMode);
    };

  /* User Functionality ************************************************************************/
  const { currentUser, signOutUser } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (currentUser) {
      const fetchUserName = async () => {
        try {
          const userDoc = doc(firestore, 'users', currentUser.uid);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            setUserName(docSnapshot.data().name || 'User');
          } else {
            setUserName('User');
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      };

      fetchUserName();
    }
  }, [currentUser, firestore]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  /*** HTML Return Statement**************************************************************************/
  return (
    <nav className="navbar">
      <div className="navbar-logo">{plannerName ? plannerName : 'College Planner'}</div>
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/planners" onClick={handleLinkClick}>Planners</a></li>
          <li><a href="/settings" onClick={handleLinkClick}>Account Settings</a></li>
          {currentUser ? (
            <>
              <li><a href="#!" onClick={handleSignOut}>Log Out</a></li>
            </>
          ) : (
            <li><a href="/login" onClick={handleLinkClick}>Log In</a></li>
          )}
        </ul>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
}

export default Navbar;