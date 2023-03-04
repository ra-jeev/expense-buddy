import { NavLink } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';

export const Navbar = () => {
  return (
    <nav className='navbar '>
      <NavLink className='logo nav-link' to='/'>
        Expense Buddy
      </NavLink>

      <NavLink className='nav-link' to='/new'>
        <FaPlusCircle /> Add New
      </NavLink>
    </nav>
  );
};
