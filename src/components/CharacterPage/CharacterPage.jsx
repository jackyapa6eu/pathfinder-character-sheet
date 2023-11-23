import { observer } from 'mobx-react';
import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import authStore from '../../store/authStore';
import charactersStore from '../../store/charactersStore';
import { toJS } from 'mobx';
import styled from 'styled-components';

const CharacterPageContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: max-content;
  grid-template-areas:
    'title title title title title title'
    '. . . baseInfo baseInfo baseInfo';
  box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  padding: 0 5px;
  gap: 5px;

  & h3 {
    grid-area: title;
    margin: 0;
  }

  & .character-base-info {
    display: flex;
    grid-area: baseInfo;
    justify-content: end;
    gap: 5px;
    margin: 0;
  }
`;

const CharacterPage = observer(() => {
  const { user } = authStore;
  const { subscribeCharacter, openedCharacter, clearOpenedCharacter } = charactersStore;
  const { charId } = useParams();

  useEffect(() => {
    console.log('Данные обновлены:', toJS(openedCharacter));
  }, [openedCharacter]);

  useEffect(() => {
    const unsubscribe = subscribeCharacter(user.uid, charId);

    return () => {
      unsubscribe();
      clearOpenedCharacter();
    };
  }, []);

  return (
    <CharacterPageContainer>
      {Object.keys(openedCharacter).length && (
        <>
          <h3>{openedCharacter.name}</h3>
          <p className='character-base-info'>
            <span>{openedCharacter.race}</span>/<span>{openedCharacter.level} lvl</span>/
            <span>{openedCharacter.alignment}</span>
          </p>
        </>
      )}
    </CharacterPageContainer>
  );
});

export default memo(CharacterPage);
