import { memo } from 'react';
import styled from 'styled-components';
import Ability from './Ability';

const AbilitiesContainer = styled.div`
  grid-area: abilities;
  display: flex;
  padding-top: 15px;
  flex-direction: column;
  width: 100%;
  margin: 0;
  height: max-content;
  gap: 5px;
`;

const Abilities = ({ store, charId, userId, canEdit }) => {
  return (
    <AbilitiesContainer>
      <Ability
        showLabel
        name='str'
        charId={charId}
        userId={userId}
        abilityDesc='Сила'
        canEdit={canEdit}
        store={store}
      />
      <Ability
        name='dex'
        charId={charId}
        userId={userId}
        abilityDesc='Ловкость'
        canEdit={canEdit}
        store={store}
      />
      <Ability
        name='con'
        charId={charId}
        userId={userId}
        abilityDesc='Телосложение'
        canEdit={canEdit}
        store={store}
      />
      <Ability
        name='int'
        charId={charId}
        userId={userId}
        abilityDesc='Интеллект'
        canEdit={canEdit}
        store={store}
      />
      <Ability
        name='wis'
        charId={charId}
        userId={userId}
        abilityDesc='Мудрость'
        canEdit={canEdit}
        store={store}
      />
      <Ability
        store={store}
        name='cha'
        charId={charId}
        userId={userId}
        abilityDesc='Харизма'
        canEdit={canEdit}
      />
    </AbilitiesContainer>
  );
};

export default memo(Abilities);
