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
      {/*<Skill charId={charId} userId={userId} name='acrobatics' ability='dex' showLabels />*/}
      {/*<Skill charId={charId} userId={userId} name='appraise' ability='int' />*/}
      {/*<Skill charId={charId} userId={userId} name='bluff' ability='cha' />*/}
      {/*<Skill charId={charId} userId={userId} name='climb' ability='str' />*/}
      {/*<Skill charId={charId} userId={userId} name='craft' ability='int' />*/}
      {/*<Skill charId={charId} userId={userId} name='diplomacy' ability='cha' />*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='disableDevice'*/}
      {/*  title='disable device'*/}
      {/*  ability='dex'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill charId={charId} userId={userId} name='disguise' ability='cha' />*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='escapeArtist'*/}
      {/*  title='escape Artist'*/}
      {/*  ability='dex'*/}
      {/*/>*/}
      {/*<Skill charId={charId} userId={userId} name='fly' ability='dex' />*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='handleAnimal'*/}
      {/*  title='handle Animal'*/}
      {/*  ability='cha'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill charId={charId} userId={userId} name='heal' ability='wis' />*/}
      {/*<Skill charId={charId} userId={userId} name='intimidate' ability='cha' />*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgeArcana'*/}
      {/*  title='knowledge (Arcana)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgeDungeoneering'*/}
      {/*  title='knowledge (Dungeoneering)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgeEngineering'*/}
      {/*  title='knowledge (Engineering)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgeGeography'*/}
      {/*  title='knowledge (Geography)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgeHistory'*/}
      {/*  title='knowledge (History)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgeLocal'*/}
      {/*  title='knowledge (Local)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgeNature'*/}
      {/*  title='knowledge (Nature)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgeNobility'*/}
      {/*  title='knowledge (Nobility)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgePlanes'*/}
      {/*  title='knowledge (Planes)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='knowledgeReligion'*/}
      {/*  title='knowledge (Religion)'*/}
      {/*  ability='int'*/}
      {/*  trainedOnly*/}
      {/*/>*/}

      {/*<Skill charId={charId} userId={userId} name='linguistics' ability='int' trainedOnly />*/}
      {/*<Skill charId={charId} userId={userId} name='perception' ability='wis' />*/}
      {/*<Skill charId={charId} userId={userId} name='perform' ability='cha' />*/}
      {/*<Skill charId={charId} userId={userId} name='profession' ability='wis' trainedOnly />*/}
      {/*<Skill charId={charId} userId={userId} name='ride' ability='dex' />*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='senseMotive'*/}
      {/*  title='sense Motive'*/}
      {/*  ability='wis'*/}
      {/*/>*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='sleightOfHand'*/}
      {/*  title='sleight of Hand'*/}
      {/*  ability='dex'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
      {/*<Skill charId={charId} userId={userId} name='spellCraft' ability='int' trainedOnly />*/}
      {/*<Skill charId={charId} userId={userId} name='stealth' ability='dex' />*/}
      {/*<Skill charId={charId} userId={userId} name='survival' ability='wis' />*/}
      {/*<Skill charId={charId} userId={userId} name='swim' ability='str' />*/}
      {/*<Skill*/}
      {/*  charId={charId}*/}
      {/*  userId={userId}*/}
      {/*  name='useMagicDevice'*/}
      {/*  title='use Magic Device'*/}
      {/*  ability='cha'*/}
      {/*  trainedOnly*/}
      {/*/>*/}
    </FeatsContainer>
  );
};

export default memo(Skills);
