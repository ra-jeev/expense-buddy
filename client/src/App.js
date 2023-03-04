import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import { RealmAppProvider } from './RealmApp';
import { Dashboard } from './routes/Dashboard';
import { NewTransaction } from './routes/NewTransaction';
import { Navbar } from './components/Navbar';
import './App.css';

const Layout = () => {
  return (
    <div className='app'>
      <Navbar />
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <RealmAppProvider appId={process.env.REACT_APP_REALM_APP_ID}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='/new' element={<NewTransaction />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RealmAppProvider>
  );
}

export default App;
