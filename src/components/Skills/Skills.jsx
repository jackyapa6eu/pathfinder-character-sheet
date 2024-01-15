import { memo } from 'react';
import styled from 'styled-components';
import Skill from './Skill';
import { availableSkills } from '../../utils/consts';

const FeatsContainer = styled.div`
  grid-area: feats;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 15px;
  margin: 0;
  height: max-content;
  gap: 5px;
  outline: 1px solid yellow;
`;

const Skills = ({ charId, userId }) => {
  return (
    <FeatsContainer>
      {Object.values(availableSkills).map(({ value, ability, label = false }, index) => (
        <Skill
          key={value}
          charId={charId}
          userId={userId}
          name={value}
          ability={ability}
          title={label || value}
          showLabels={index === 0}
        />
      ))}
    </FeatsContainer>
  );
};

export default memo(Skills);
