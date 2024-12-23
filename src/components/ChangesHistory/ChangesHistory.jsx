import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { format } from 'date-fns';

import charactersStore from '../../store/charactersStore';

const ChangesHistoryContainer = styled.div`
  display: grid;
  gap: 5px;
  padding: 10px 0;
`;

const ChangesHistoryItem = styled.p`
  display: grid;
  padding: 0 10px;
  align-items: center;
  grid-template-columns: 50px 120px 2fr 1fr 0.5fr 1fr;
  //height: 30px;
  border-radius: 8px;
  box-shadow: 0 0 1px black;
  //gap: 10px;
  margin: 0;
  width: 100%;

  @media (max-width: 800px) {
    grid-template-columns: 25px 2fr 1fr;
  }
`;

const ChangeIcon = styled.div`
  width: 25px;
  height: 25px;

  @media (max-width: 800px) {
  }
`;

const ChangeAuthor = styled.span`
  color: gray;
  @media (max-width: 800px) {
    grid-row: 2;
    grid-column: 1 / 3;
  }
`;

const ChangedValues = styled.span`
  display: grid;
  gap: 5px;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;

  @media (max-width: 800px) {
  }
`;

const ChangedTarget = styled.span`
  display: flex;
  gap: 5px;

  @media (max-width: 800px) {
  }
`;

const ChangeDate = styled.span`
  text-align: right;
  color: gray;
  @media (max-width: 800px) {
    grid-row: 2;
    grid-column: 3 / 3;
  }
`;

const formatDate = (timestamp) => {
  return format(new Date(timestamp), 'HH:mm dd.MM.yyyy');
};

export const ChangesHistory = observer(() => {
  const { openedCharacter } = charactersStore;

  const x = {
    author: {
      displayName: 'Eugene',
      dm: true,
      email: 'yapa6eu@gmail.com',
      uid: '9aKm8vlGflQQ5EIwd0vhdcKGX7T2',
    },
    currValue: 9,
    prevValue: 9,
    target: 'current hit points',
    type: 'changed',
    date: 1734929709570,
  };

  const historyArr = useMemo(() => {
    if (openedCharacter.changesHistory) {
      return Object.entries(openedCharacter.changesHistory)
        .map(([dataStr, data]) => {
          return {
            ...data,
            date: Number(dataStr),
          };
        })
        .sort((a, b) => b.date - a.date);
    }

    return [];
  }, [openedCharacter]);

  return (
    <ChangesHistoryContainer>
      {historyArr.length > 0 &&
        historyArr.map((item) => {
          return (
            <ChangesHistoryItem key={item.date}>
              <ChangeIcon>L</ChangeIcon>
              <ChangeAuthor>{item.author.displayName}</ChangeAuthor>
              <ChangedTarget>
                <span>{item.type}</span>
                <span>{item.target}</span>
              </ChangedTarget>
              <ChangedValues>
                <span>{item.prevValue}</span>
                <span>{item.prevValue || item.currValue ? '->' : ''}</span>
                <span>{item.currValue}</span>
              </ChangedValues>
              <div />
              <ChangeDate>{formatDate(item.date)}</ChangeDate>
            </ChangesHistoryItem>
          );
        })}
    </ChangesHistoryContainer>
  );
});

export default ChangesHistory;
