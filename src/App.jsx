import './App.css';
import './vendor/normalize.css';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import styled from 'styled-components';
import SignUpForm from './components/SignUpForm';
import { getAuth } from 'firebase/auth';
import authStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRouter/ProtectedRoute';
import { observer } from 'mobx-react';
import SignInForm from './components/SignInForm';

const StyledApp = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 80px 1fr;
  grid-template-areas:
    'header header header header header header'
    'mainContainer mainContainer mainContainer mainContainer mainContainer mainContainer';
  background-color: #f1f1f1;
  min-height: 100vh;
`;

const MainContainer = styled.main`
  display: grid;
  grid-area: mainContainer;
  justify-items: center;
  padding: 10px;
`;

const App = observer(() => {
  const auth = getAuth();
  const { getUserData, user, setUser, setAppMountedAuthLoadingState } = authStore;
  useEffect(() => {
    setAppMountedAuthLoadingState('loading');
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await getUserData(user.uid);
      } else setUser(null);
      setAppMountedAuthLoadingState('pending');
    });
  }, []);

  useEffect(() => {
    console.log('use Effect user:', user);
  }, [user]);
  return (
    <StyledApp>
      <Header />
      <MainContainer>
        <Routes>
          <Route element={<div>Main</div>} path='/' />
          <Route
            element={<ProtectedRoute component={<SignInForm />} to='/' condition={!user} />}
            path='/sign-in'
          />
          <Route
            element={<ProtectedRoute component={<SignUpForm />} to='/' condition={!user} />}
            path='/sign-up'
          />
          <Route element={<div>404 страница не найдена</div>} path='/*' />
        </Routes>
      </MainContainer>
    </StyledApp>
  );
});

export default App;
