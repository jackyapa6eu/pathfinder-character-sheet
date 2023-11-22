import React, { memo } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';

const StyledHeader = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 80px 1fr 120px;
  grid-area: header;
  box-shadow: 0 0 3px wheat;
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

const Header = () => {
  const navigate = useNavigate();

  const handleNavigateButton = (path) => {
    navigate(`/${path}`);
  };

  return (
    <StyledHeader>
      <div onClick={() => handleNavigateButton('')}>logo</div>
      <div>header content</div>
      <UserContainer>
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
      </UserContainer>
    </StyledHeader>
  );
};

export default memo(Header);
