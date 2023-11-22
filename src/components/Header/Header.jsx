import React, { memo, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Menu } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import authStore from '../../store/authStore';
import { observer } from 'mobx-react';
import DiceIcon from '../../icons/DiceIcon';

const StyledHeader = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 80px 1fr 120px;
  grid-area: header;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.12);
  padding: 10px;
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

const Header = observer(() => {
  const navigate = useNavigate();
  const { user, logout, mountedAuthLoadingState } = authStore;

  const handleNavigateButton = (path) => {
    navigate(`/${path}`);
  };

  const items = [
    {
      key: '1',
      label: <span onClick={logout}>Выйти</span>,
    },
  ];

  return (
    <StyledHeader>
      <DiceIcon size='60px' handleClick={() => handleNavigateButton('')} />

      <div></div>
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
                    Регистрация
                  </SignButton>
                }
              />
              <Route
                path='/*'
                element={
                  <SignButton size='default' onClick={() => handleNavigateButton('sign-in')}>
                    Вход
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
