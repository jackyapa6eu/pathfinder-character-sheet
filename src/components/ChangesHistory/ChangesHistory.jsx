import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { format } from 'date-fns';

import charactersStore from '../../store/charactersStore';
import {
  ArrowRightOutlined,
  DeleteOutlined,
  FormOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RightOutlined,
  RollbackOutlined,
  UndoOutlined,
} from '@ant-design/icons';

const ChangesHistoryContainer = styled.div`
  display: grid;
  gap: 5px;
  padding: 10px 0;
`;

const ChangesHistoryItem = styled.div`
  display: grid;
  padding: 0 10px;
  align-items: center;
  grid-template-columns: 50px 120px 4fr 1fr 0 115px;
  border-radius: 8px;
  box-shadow: 0 0 1px black;
  margin: 0;
  width: 100%;

  @media (max-width: 800px) {
    grid-template-columns: 25px 2fr 1fr;
  }
`;

const ChangeIcon = styled.div`
  width: 25px;
  height: 25px;
  align-self: start;
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
    align-items: start;
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

  const IconContent = (type) => {
    switch (type) {
      case 'changed':
        return <FormOutlined />;
      case 'added':
        return <PlusOutlined />;
      case 'deleted':
        return <DeleteOutlined />;
      case 'used':
        return <PlayCircleOutlined />;
      case 'unused':
        return <UndoOutlined />;
      case 'rest':
        return <UndoOutlined />;
    }
  };

  return (
    <ChangesHistoryContainer>
      {historyArr.length > 0 &&
        historyArr.map((item) => {
          return (
            <ChangesHistoryItem key={item.date}>
              <ChangeIcon>{IconContent(item.type)}</ChangeIcon>
              <ChangeAuthor>{item.author.displayName}</ChangeAuthor>
              <ChangedTarget>
                <span
                  style={{
                    textTransform: 'uppercase',
                    minWidth: '72px',
                    textAlign: 'center',
                    background: 'black',
                    color: 'white',
                    padding: '0 3px',
                  }}
                >
                  {item.type}
                </span>
                <span>{item.target}</span>
              </ChangedTarget>
              <ChangedValues>
                <span>
                  {Array.isArray(item.prevValue) ? item.prevValue.join(', ') : item.prevValue}
                </span>
                <span>{item.prevValue || item.currValue ? <ArrowRightOutlined /> : ''}</span>
                <span>
                  {Array.isArray(item.currValue) ? item.currValue.join(', ') : item.currValue}
                </span>
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
