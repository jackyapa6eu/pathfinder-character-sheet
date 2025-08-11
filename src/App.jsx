import './App.css';
import './vendor/normalize.css';
import { useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import styled from 'styled-components';
import SignUpForm from './components/SignUpForm';
import { getAuth } from 'firebase/auth';
import authStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRouter/ProtectedRoute';
import { observer } from 'mobx-react';
import SignInForm from './components/SignInForm';
import CreateCharacter from './components/CreateCharacter';
import MainPage from './components/MainPage';
import CharacterPage from './components/CharacterPage';
import knownItemsStore from './store/knownItemsStore';
import loadingImage from './assets/images/loading-image.gif';
import { getLSData, setLSData } from './utils/helpers';
import CharacterPageContextWrapper from './components/CharacterPageContextWrapper';

const StyledApp = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 65px 1fr;
  grid-template-areas:
    'header header header header header header'
    'mainContainer mainContainer mainContainer mainContainer mainContainer mainContainer';
  background-color: #f1f1f1;
  min-height: 100vh;

  filter: ${({ isdarktheme }) => (isdarktheme ? 'invert(1)' : 'invert(0)')};

  transition: all ease 0.5s;
`;

const MainContainer = styled.main`
  position: relative;
  display: grid;
  grid-area: mainContainer;
  justify-items: center;
  padding: 10px;

  @media screen and (max-width: 605px) {
    & {
      padding: 0;
      padding-bottom: 10px;
    }
  }
`;

export const Loader = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 7%;
  background: rgba(0, 0, 0, 0.9);
  align-items: start;
  justify-content: center;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 777;
  display: flex;
  visibility: ${({ loading }) => (loading ? 'visible' : 'hidden')};
  opacity: ${({ loading }) => (loading ? 1 : 0)};
  transition: all ease 0.5s;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: min-content;
  height: min-content;
`;

const LoadingGif = styled.img``;

const App = observer(() => {
  const [isDarkTheme, setIsDarkTheme] = useState(getLSData('darkTheme') || false);
  const auth = getAuth();
  const {
    getUserData,
    user,
    setUser,
    isPreviouslyLogged,
    mountedAuthLoadingState,
    setAppMountedAuthLoadingState,
  } = authStore;
  const { setUserId } = knownItemsStore;

  useEffect(() => {
    setAppMountedAuthLoadingState('loading');
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        await getUserData(user.uid);
      } else setUser(null);
      setAppMountedAuthLoadingState('done');
    });
  }, []);

  const isStayLogged =
    isPreviouslyLogged &&
    (mountedAuthLoadingState === 'pending' || mountedAuthLoadingState === 'loading');

  const handleSwitchTheme = useCallback(() => {
    setIsDarkTheme(!isDarkTheme);
    setLSData('darkTheme', !isDarkTheme);
  }, [isDarkTheme]);

  return (
    <StyledApp isdarktheme={+isDarkTheme}>
      <Loader
        loading={+(mountedAuthLoadingState === 'pending' || mountedAuthLoadingState === 'loading')}
      >
        <ImageContainer>
          <LoadingGif src={loadingImage} alt='olegators loading' />
        </ImageContainer>
      </Loader>
      <Header isDarkTheme={isDarkTheme} handleSwitchTheme={handleSwitchTheme} />
      <MainContainer>
        <Routes>
          <Route element={<MainPage />} path='/' />
          <Route
            element={<ProtectedRoute component={<SignInForm />} to='/' condition={!user} />}
            path='/sign-in'
          />
          <Route
            element={<ProtectedRoute component={<SignUpForm />} to='/' condition={!user} />}
            path='/sign-up'
          />
          <Route
            element={
              <ProtectedRoute
                component={<CreateCharacter />}
                to='/'
                condition={isStayLogged || user}
              />
            }
            path='/create-character'
          />
          <Route
            element={
              <ProtectedRoute
                component={<CharacterPageContextWrapper isDarkTheme={isDarkTheme} />}
                to='/'
                condition={isStayLogged || user}
              />
            }
            path='/chars/:charId'
          />
          <Route
            element={
              <ProtectedRoute
                component={<CharacterPageContextWrapper isDarkTheme={isDarkTheme} />}
                to='/'
                condition={isStayLogged || user?.dm || user}
              />
            }
            path='/:userId/chars/:charId'
          />
          <Route element={<div>404 страница не найдена</div>} path='/*' />
        </Routes>
      </MainContainer>
    </StyledApp>
  );
});

export default App;
