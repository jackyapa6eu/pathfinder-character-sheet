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

const Abilities = ({ charId }) => {
  return (
    <AbilitiesContainer>
      <Ability showLabel name='str' charId={charId} abilityDesc='Сила' />
      <Ability name='dex' charId={charId} abilityDesc='Ловкость' />
      <Ability name='con' charId={charId} abilityDesc='Телосложение' />
      <Ability name='int' charId={charId} abilityDesc='Интеллект' />
      <Ability name='wis' charId={charId} abilityDesc='Мудрость' />
      <Ability name='cha' charId={charId} abilityDesc='Харизма' />
    </AbilitiesContainer>
  );
};

export default memo(Abilities);
