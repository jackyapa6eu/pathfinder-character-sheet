import React, { memo, useState } from 'react';
import { Button, Drawer, Modal } from 'antd';
import CharacterPageContextWrapper from '../CharacterPageContextWrapper';
import styled from 'styled-components';

const StyledModal = styled(Drawer)`
  filter: ${({ isdarktheme }) => (isdarktheme ? 'invert(1)' : 'invert(0)')};

  transition: all ease 0.5s;

  & .ant-modal-content {
    padding: 3px;
  }

  @media screen and (max-width: 660px) {
    & .ant-drawer-body {
      padding: 4px;
    }
  }
`;

const Teammate = ({ item, isDarkTheme }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <Button
        onClick={() => {
          setModalIsOpen(true);
        }}
      >
        {item.name}
      </Button>
      <StyledModal
        open={modalIsOpen}
        width={'100vw'}
        height={'calc(100vh - 50px'}
        onClose={() => setModalIsOpen(false)}
        footer={null}
        isdarktheme={isDarkTheme}
        centered
      >
        <div>
          <CharacterPageContextWrapper
            additionalCharId={item.charName}
            isModal
            additionalOwnerId={item.owner}
          />
        </div>
      </StyledModal>
    </div>
  );
};

export default memo(Teammate);
