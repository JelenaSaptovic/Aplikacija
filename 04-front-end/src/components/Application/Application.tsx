import React from 'react';
import './Application.sass';
import { Container } from 'react-bootstrap';
import LoginPage from '../User/LoginPage/LoginPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from '../Menu/Menu';
import UserList from '../User/UserList/UserList';
import UserPage from '../User/UserPage/UserPage';

function Application() {
  return (
    <Container className="mt-4">
      <Menu/>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <div></div> } />
          <Route path='/contact' element={ <ContactPage /> } />
          <Route path='/auth/user/login' element={  <LoginPage /> } />
          <Route path='/users' element={ <UserList /> } />
          <Route path='/user/:id' element={ <UserPage /> } />

        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default Application;
