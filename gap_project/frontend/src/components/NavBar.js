import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';

function NavBar({links}) {
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
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
          <li><Link to={link.path}><img className="collapsed-icons" src={link.image} alt={link.name} />{collapsed ? '' : (link.name)}</Link></li>
          </div>
        ))}
        <li className="logout-button">
        <Link to='/'><img className="collapsed-icons" src='/logout.png' alt='logout' />{collapsed ? '' : 'LOG OUT'}</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;




/*<Link 
to="/page1" 
className={collapsed ? 'collapsed-link' : ''}>
{collapsed ? '' : 'Committees & Representative'}
</Link>
</li>
<li> <button className="nav-button" onClick={() => openPopup('Page 2')}>
Page 2
</button></li>
<li className="bottom-components">
<Link to="/page3">
<img
  src={require('./profileIcon.png')}
  className={`navbar-icons ${collapsed ? 'collapsed' : ''}`}
  alt="Link to profile"
/>
</Link></li>



      {isPopupOpen && (
        <GapConfirmPopUp onClose={closePopup} pageName={'company fojhEIFH'} />
      )}*/


