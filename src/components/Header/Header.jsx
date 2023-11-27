import { memo } from 'react';
import styled from 'styled-components';
import { Button, Dropdown } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import authStore from '../../store/authStore';
import { observer } from 'mobx-react';
import DiceIcon from '../../icons/DiceIcon';

const StyledHeader = styled.div`
  width: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: minmax(auto, max-content) 1fr minmax(auto, max-content);
  gap: 20px;
  grid-area: header;
  box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  padding: 0 10px;
`;

const UserContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const SignButton = styled(Button)`
  color: #282828;
`;

const HeaderNavMenu = styled.div`
  display: flex;
  align-items: end;
  justify-content: end;
  width: 100%;
`;

const NavMenuItem = styled.button`
  background: none;
  border: 1px solid black;
  border-radius: 6px;
  padding: 5px;
  cursor: pointer;
  transition: all ease 0.3s;
  &:hover {
    background: black;
    color: white;
  }
`;

const Header = observer(() => {
  const navigate = useNavigate();
  const { user, logout, mountedAuthLoadingState } = authStore;

  const handleNavigateButton = (path) => {
    navigate(`/${path}`);
  };

  const items = [
    {
      key: '2',
      label: <span onClick={() => handleNavigateButton('create-character')}>Create character</span>,
    },
    {
      key: '1',
      label: (
        <span style={{ color: 'gray' }} onClick={logout}>
          Logout
        </span>
      ),
    },
  ];

  return (
    <StyledHeader>
      <DiceIcon size='60px' handleClick={() => handleNavigateButton('')} />

      <HeaderNavMenu>
        {/*{user && (*/}
        {/*  <NavMenuItem onClick={() => handleNavigateButton('create-character')}>*/}
        {/*    create character*/}
        {/*  </NavMenuItem>*/}
        {/*)}*/}
      </HeaderNavMenu>

      {mountedAuthLoadingState !== 'loading' && (
        <UserContainer>
          {user ? (
            <Dropdown
              menu={{
                items,
              }}
            >
              <Button>{user.displayName}</Button>
            </Dropdown>
          ) : (
            <Routes>
              <Route
                path='/sign-in'
                element={
                  <SignButton size='default' onClick={() => handleNavigateButton('sign-up')}>
                    Sign up
                  </SignButton>
                }
              />
              <Route
                path='/*'
                element={
                  <SignButton size='default' onClick={() => handleNavigateButton('sign-in')}>
                    Sign in
                  </SignButton>
                }
              />
            </Routes>
          )}
        </UserContainer>
      )}
    </StyledHeader>
  );
});

export default memo(Header);
