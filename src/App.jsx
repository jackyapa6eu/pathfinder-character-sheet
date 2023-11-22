import './App.css';
import './vendor/normalize.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import styled from 'styled-components';

const StyledApp = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 80px 1fr;
  grid-template-areas:
    'header header header header header header'
    'mainContainer mainContainer mainContainer mainContainer mainContainer mainContainer';
  background-color: #282828;
  min-height: 100vh;
`;

const MainContainer = styled.main`
  display: grid;
  grid-area: mainContainer;
  padding: 10px;
`;

function App() {
  return (
    <StyledApp>
      <Header />
      <MainContainer>
        <Routes>
          <Route element={<div>Main</div>} path='/' />
          <Route element={<div>sign-in</div>} path='/sign-in' />
          <Route element={<div>sign-up</div>} path='/sign-up' />
          <Route element={<div>404 страница не найдена</div>} path='/*' />
        </Routes>
      </MainContainer>
    </StyledApp>
  );
}

export default App;
