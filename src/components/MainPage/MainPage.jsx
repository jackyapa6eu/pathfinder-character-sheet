import { observer } from 'mobx-react';
import { memo } from 'react';
import styled from 'styled-components';
import authStore from '../../store/authStore';
import CharactersList from '../CharactersList/CharactersList';
import { Tabs } from 'antd';
import UsefulItemsList from '../UsefulItemsList';

const StyledTabs = styled(Tabs)`
  width: 100%;
  color: black;!important;

  & .ant-tabs-nav {
    margin: 0;
  }
  
  & .ant-tabs-nav-list {
    flex-wrap: wrap;
  }
  
  & .ant-tabs-tab-btn {
    color: black!important;
    
  }
  
  & .ant-tabs-tab  {
    padding-top: 0!important;
  }
`;

const MainPage = observer(() => {
  const { user } = authStore;

  return (
    <>
      {user ? (
        <StyledTabs
          size='small'
          type='card'
          items={[
            {
              label: `Characters`,
              key: 1,
              children: <CharactersList />,
            },
            {
              label: `Useful items`,
              key: 2,
              children: <UsefulItemsList />,
            },
          ]}
        />
      ) : (
        <h1>Olegators is Pathfinder</h1>
      )}
    </>
  );
});

export default memo(MainPage);
