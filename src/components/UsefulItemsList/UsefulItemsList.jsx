import { observer } from 'mobx-react';
import usersStore from '../../store/usersStore';
import { useCallback, useEffect, useMemo } from 'react';
import { toJS } from 'mobx';
import ItemDescription from '../ItemDescription';
import { notification } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 100%;
  height: 100%;
  padding: 0 10px;
`;

const ItemsContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, 50px);
  width: 100%;
  gap: 10px;
  padding: 6px;
`;

const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-shadow: 0 0 1px rgba(128, 128, 128, 0.5);
  padding: 6px;
  border-radius: 6px;
  width: 340px;
  height: min-content;
  cursor: pointer;
  transition: all ease 0.5s;
  & p {
    margin: 0;
    display: flex;
    gap: 3px;
  }

  & h4 {
    margin: 0;
    font-weight: 500;
  }

  &:hover {
    box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  }

  @media screen and (max-width: 420px) {
    & {
      width: 100%;
    }
  }
`;

export const UsefulItemsList = observer(() => {
  const { usersCharacters } = usersStore;
  const [api, contextHolder] = notification.useNotification();

  const usefulItems = useMemo(() => {
    return Object.entries(usersCharacters).reduce((res, [charName, charData]) => {
      if (charData.inventory) {
        Object.values(charData.inventory).forEach((item) => {
          if (item.isUseful) {
            res.push({ ...item, owner: charName });
          }
        });
      }

      return res;
    }, []);
  }, [usersCharacters]);

  const handleShowItemDescription = useCallback(
    (itemData) => {
      api.open({
        message: (
          <span>
            {itemData.name} / {itemData.owner}
          </span>
        ),
        description: (
          <div>
            <ItemDescription itemData={itemData} />
          </div>
        ),
        duration: 0,
      });
    },
    [usefulItems]
  );

  useEffect(() => {
    console.log('usersCharacters:', toJS(usersCharacters));
    console.log('usefulItems:', toJS(usefulItems));
  }, []);

  return (
    <Container>
      {contextHolder}
      <ItemsContainer>
        {usefulItems.map((item) => (
          <ItemCard key={item.ref} onClick={() => handleShowItemDescription(item)}>
            <h4>{item.itemName}</h4>
          </ItemCard>
        ))}
      </ItemsContainer>
    </Container>
  );
});
