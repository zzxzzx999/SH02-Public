import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';

function NavBar({links, logout}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const popUpRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (
      pageRef.current &&
      !pageRef.current.contains(e.target) &&
      pageRef.current &&
      !pageRef.current.contains(e.target)
    ) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleButtonClick = () => {
    if (logout) {
      navigate('/');
    } else {
      setIsPopupOpen(true);
    }
  };

  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div ref={pageRef}>
    <nav className={`side-navbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="gordon-logo-container">
        <img
          src='/gordonLogo.png'
          className={`gordon-logo ${collapsed ? 'collapsed' : ''}`}
          alt="Gordon Foley Logo"
        />
        {!collapsed && (
          <button className="toggle-btn" onClick={toggleSidebar}>
            {collapsed ? '>>' : '<<'}
          </button>
        )}
      </div>
      {collapsed && (
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? '>>' : '<<'}
        </button>
      )}
      <ul>
        {links.map((link) => (
          <div key={link.name}>
 <li key={link.name}>
            {collapsed ? (
              link.image && (
                <Link to={link.path}>
                  <img className="collapsed-icons" src={link.image} alt={link.name} />
                </Link>
              )
            ) : (
              <Link to={link.path}>
                {link.image && (
                  <img className="collapsed-icons" src={link.image} alt={link.name} />
                )}
                {link.name && <span>{link.name}</span>}
              </Link>
            )}
          </li>
          </div>
        ))}
        <li
          className="logout-button"
          onClick={(e) => {
            if (!logout) {
              e.preventDefault();
              handleButtonClick();
            }
          }}>
          <a href={logout ? '/' : '#'} className="logout-link">
            <img className="collapsed-icons" src="/logout.png" alt="logout" />
            {collapsed ? '' : (logout ? 'LOG OUT' : 'SAVE AND EXIT')}
          </a>
        </li>
      </ul>
    </nav>

    {isPopupOpen && (
      <Popup ref={popUpRef} onClose={() => setIsPopupOpen(false)}>
      <button className="close-button" onClick={() => setIsPopupOpen(false)}>X</button>
        <h2>Company Name</h2>
        <p>Are you finished?<br></br>If not, you can save and come back later.</p>
        <button className="submitButton" onClick={() => navigate('/home')}>SAVE AND EXIT</button>
        <button className="submitButton" style={{margin:'15px'}} onClick={() => navigate('/results')}>FINISHED, GO TO RESULTS</button>
      </Popup>
    )}
    </div>
  );
}

export default NavBar;

function Popup({onClose, children}) {
  return (
      <div className="bubble-container" style = {{width:'500px', marginTop:'40px'}} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
  );
}


