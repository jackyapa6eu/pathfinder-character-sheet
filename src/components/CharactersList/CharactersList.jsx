import { observer } from 'mobx-react';
import { memo, useEffect } from 'react';
import charactersStore from '../../store/charactersStore';
import authStore from '../../store/authStore';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CharacterListContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: start;
  padding: 0 10px;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  width: 100%;
  gap: 16px;
  padding: 16px;
`;

const CharacterCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-shadow: 0 0 1px rgba(128, 128, 128, 0.5);
  padding: 10px;
  border-radius: 6px;
  width: 130px;
  height: 130px;
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
`;

const CharactersList = observer(() => {
  const { getCharactersList, characters } = charactersStore;
  const { user } = authStore;

  const navigate = useNavigate();

  const getData = async () => {
    await getCharactersList(user.uid);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <CharacterListContainer>
      <h3 style={{ margin: 0, marginBottom: '15px' }}>Characters</h3>
      {Object.keys(characters) && (
        <CardsContainer>
          {Object.entries(characters).map(([charRef, charData]) => (
            <CharacterCard key={charRef} onClick={() => navigate(`/chars/${charRef}`)}>
              <h4>{charData.name}</h4>
              <p>
                <span>level</span>
                <span>{charData.level}</span>
              </p>
              <p>
                <span>{charData.race}</span>
              </p>
              <p>
                <span>{charData.alignment}</span>
              </p>
            </CharacterCard>
          ))}
        </CardsContainer>
      )}
    </CharacterListContainer>
  );
});

export default memo(CharactersList);
