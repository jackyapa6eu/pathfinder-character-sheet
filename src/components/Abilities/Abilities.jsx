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

const Abilities = () => {
  return (
    <AbilitiesContainer>
      <Ability showLabel name='str' />
      <Ability name='dex' />
      <Ability name='con' />
      <Ability name='int' />
      <Ability name='wis' />
      <Ability name='cha' />
    </AbilitiesContainer>
  );
};

export default memo(Abilities);
