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
  gap: 3px;
`;

const Abilities = ({ charId, userId }) => {
  return (
    <AbilitiesContainer>
      <Ability showLabel name='str' charId={charId} userId={userId} abilityDesc='Сила' />
      <Ability name='dex' charId={charId} userId={userId} abilityDesc='Ловкость' />
      <Ability name='con' charId={charId} userId={userId} abilityDesc='Телосложение' />
      <Ability name='int' charId={charId} userId={userId} abilityDesc='Интеллект' />
      <Ability name='wis' charId={charId} userId={userId} abilityDesc='Мудрость' />
      <Ability name='cha' charId={charId} userId={userId} abilityDesc='Харизма' />
    </AbilitiesContainer>
  );
};

export default memo(Abilities);
