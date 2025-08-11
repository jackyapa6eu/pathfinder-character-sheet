import { memo, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Skill from './Skill';
import { availableSkills } from '../../utils/consts';
import Search from 'antd/es/input/Search';
import { filterData } from '../../utils/helpers';

const FeatsContainer = styled.div`
  grid-area: feats;
  display: flex;
  width: 100%;
  flex-direction: column;
  width: min-content;
  padding-top: 15px;
  margin: 0;
  height: max-content;
  gap: 15px;
`;

const SkillsListContainer = styled.div`
  min-height: 200px;
`;

const Skills = ({ store, charId, userId, canEdit }) => {
  const [searchItemText, setSearchItemText] = useState('');

  const searchInputRef = useRef(null);

  const handleSearch = (value) => {
    setSearchItemText(value.target.value);
    if (searchInputRef.current) {
      console.log('1');
      searchInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  };

  const list = useMemo(() => {
    return filterData(Object.values(availableSkills), ['ability', 'value'], searchItemText);
  }, [searchItemText]);

  return (
    <FeatsContainer>
      <div ref={searchInputRef}>
        <Search
          allowClear
          className='inventory-panel-search-input'
          value={searchItemText}
          onChange={handleSearch}
        />
      </div>

      <SkillsListContainer>
        {list.map(({ value, ability, label = false }, index) => (
          <Skill
            key={value}
            charId={charId}
            userId={userId}
            name={value}
            ability={ability}
            title={label || value}
            showLabels={index === 0}
            canEdit={canEdit}
            store={store}
          />
        ))}
      </SkillsListContainer>
    </FeatsContainer>
  );
};

export default memo(Skills);
