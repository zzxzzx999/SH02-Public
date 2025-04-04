import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';
import { useSubmit } from './SubmitContext.js';

function NavBar({links, logout, isComplete}) {
  const submitAnswersToAPI = useSubmit();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const popUpRef = useRef(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const companyName = params.get('company');
  localStorage.setItem("companyName", companyName);
  const gapID = params.get("gap_id");

  const handleOutsideClick = (e) => {
    if (pageRef.current &&!pageRef.current.contains(e.target)) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {document.removeEventListener("mousedown", handleOutsideClick);};
  }, []);

  const handleButtonClick = () => {
    if (logout) {
      navigate('/');
    } else {
      setIsPopupOpen(true);
    }
  };

  const [collapsed, setCollapsed] = useState(true);
  const toggleSidebar = () => { setCollapsed(!collapsed); };

  return (
    <div ref={pageRef}>
    <nav className={`side-navbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        <img
          src='/placeholder.png'
          className={`logo ${collapsed ? 'collapsed' : ''}`}
          alt="Logo"
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
        <h2>{companyName}</h2>
        {isComplete ? (
          <>
            <p>Are you finished?<br></br>If not, you can save and come back later.</p>
            <button className="submitButton" onClick={async () => { await submitAnswersToAPI(false); navigate('/home'); }}>
              SAVE AND EXIT
            </button>
            <button className="submitButton" style={{ margin: '15px' }} onClick={async () => { await submitAnswersToAPI(true); navigate(`/overall-output?company=${companyName}&gap_id=${encodeURIComponent(gapID)}`);}}>
              FINISHED, GO TO RESULTS <br></br> (YOU CAN'T UNDO THIS ACTION)
            </button>
          </>)
          : (
          <>
            <p>Would you like to save and come back later?</p>
            <button className="submitButton" onClick={async () => { await submitAnswersToAPI(false); navigate('/home'); }}>
              SAVE AND EXIT
            </button>
          </>)
        }
      </Popup>
    )}
    </div>
  );
}

export default NavBar;

const Popup = forwardRef(({ onClose, children }, ref) => {
  return (
    <div className="bubble-container" style={{ width: '500px', height:'270px', display: 'flex', justifycontent: 'center', alignitems: 'center', position: 'fixed'}} onClick={(e) => e.stopPropagation()} ref={ref}>
      {children}
    </div>
  );
});



