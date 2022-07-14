import React from 'react';
import './Application.sass';
import { Container } from 'react-bootstrap';
import LoginPage from '../User/LoginPage/LoginPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from '../Menu/Menu';
import UserList from '../User/Dashboard/UserList';
import Dashboard from '../User/Dashboard/Dashboard';
import AdPage from '../User/AdPage/AdPage';
import AdList from '../User/AdList/AdList';
import UserAdList from '../User/Dashboard/UserAdList';
import AddAd from '../User/Dashboard/AddAd';

function Application() {
  return (
    <Container className="mt-4">
      <Menu/>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <div></div> } />
          <Route path='/contact' element={ <ContactPage /> } />
          <Route path='/auth/user/login' element={  <LoginPage /> } />
          <Route path='/ads' element={ <AdList /> } />
          <Route path='/ad/:id' element={ <AdPage /> } />

          <Route path='/dashboard' element={ <Dashboard /> } />
          <Route path='/dashboard/ad/list' element={ <UserAdList /> } />
          <Route path='/dashboard/user/list' element={ <UserList /> } />
          <Route path='/dashboard/ad/add' element={ <AddAd /> } />
          <Route path="/dashboard/ad/list" element={ <p>Nije rutrano</p> } />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default Application;
