import React from 'react';
import { observer } from 'mobx-react';
import RichTextModal from '../RichTextModal';
import styled from 'styled-components';

const StyledContainer = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 24px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ul,
  ol {
    margin: 0;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
  }

  img {
    max-width: 100%;
    max-height: 70vh;
  }
`;

const CharacterBackground = observer(({ store, charId, userId, canEdit }) => {
  const { openedCharacter, editBackground } = store;

  const handleEditBackGround = async (newValue) => {
    await editBackground(userId, charId, newValue);
  };

  return (
    <div>
      {!canEdit && (
        <RichTextModal handleSubmit={handleEditBackGround} text={openedCharacter.background} />
      )}

      <StyledContainer dangerouslySetInnerHTML={{ __html: openedCharacter.background || '' }} />
    </div>
  );
});

export default CharacterBackground;
