import { memo } from 'react';
import styled from 'styled-components';
import SavingThrow from './SavingThrow';
import CharacterSpeed from '../CharacterSpeed';

const ThrowsContainer = styled.div`
  grid-area: savingThrows;
  display: flex;
  padding-top: 15px;
  flex-direction: column;
  width: 100%;
  margin: 0;
  height: max-content;
  gap: 5px;
`;

const SavingThrowsAndSpeed = ({ store, charId, userId, canEdit }) => {
  return (
    <ThrowsContainer>
      <SavingThrow
        name='fortitude'
        abilityName='con'
        charId={charId}
        userId={userId}
        showLabels
        canEdit={canEdit}
        store={store}
      />
      <SavingThrow
        name='reflex'
        abilityName='dex'
        charId={charId}
        userId={userId}
        canEdit={canEdit}
        store={store}
      />
      <SavingThrow
        name='will'
        abilityName='wis'
        charId={charId}
        userId={userId}
        canEdit={canEdit}
        store={store}
      />
      <CharacterSpeed store={store} canEdit={canEdit} userId={userId} charId={charId} />
    </ThrowsContainer>
  );
};

export default memo(SavingThrowsAndSpeed);
