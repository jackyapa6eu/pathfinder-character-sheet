import { memo, useRef, useState } from 'react';
import styled from 'styled-components';
import Skill from './Skill';
import { availableSkills } from '../../utils/consts';
import Search from 'antd/es/input/Search';
import { filterData } from '../../utils/helpers';

const FeatsContainer = styled.div`
  grid-area: feats;
  display: flex;
  flex-direction: column;
  width: min-content;
  padding-top: 15px;
  margin: 0;
  height: max-content;
  gap: 15px;
`;

const Skills = ({ charId, userId }) => {
  const [searchItemText, setSearchItemText] = useState('');

  const searchInputRef = useRef(null);

  const handleSearch = (value) => {
    setSearchItemText(value.target.value);
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  };

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

      <div style={{ minHeight: '1450px' }}>
        {filterData(Object.values(availableSkills), ['ability', 'value'], searchItemText).map(
          ({ value, ability, label = false }, index) => (
            <Skill
              key={value}
              charId={charId}
              userId={userId}
              name={value}
              ability={ability}
              title={label || value}
              showLabels={index === 0}
            />
          )
        )}
      </div>
    </FeatsContainer>
  );
};

export default memo(Skills);
