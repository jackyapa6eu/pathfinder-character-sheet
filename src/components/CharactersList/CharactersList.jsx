import { observer } from 'mobx-react';
import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toJS } from 'mobx';
import { FaSkullCrossbones } from 'react-icons/fa6';

import charactersStore from '../../store/charactersStore';
import authStore from '../../store/authStore';
import usersStore from '../../store/usersStore';

const CharacterListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 100%;
  height: 100%;
  padding: 0 10px;
`;

const CardsContainer = styled.div`
  display: grid;
  //grid-template-rows: repeat(auto-fill, 50px);
  width: 100%;
  gap: 10px;
  padding: 6px;
`;

const CharacterCard = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 5px;
  box-shadow: 0 0 1px rgba(128, 128, 128, 0.5);
  padding: 6px;
  border-radius: 6px;
  width: 340px;
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

const ListsContainer = styled.div`
  display: flex;
  gap: 20px;

  @media screen and (max-width: 770px) {
    & {
      flex-direction: column;
    }
  }
`;

const CharactersList = observer(() => {
  const { getCharactersList, characters } = charactersStore;
  const { user } = authStore;
  const { getUsers, usersCharacters } = usersStore;

  const navigate = useNavigate();

  const getData = async () => {
    await getCharactersList(user.uid);
    console.log(toJS(user));
    await getUsers(user.uid, user.dm);
  };

  useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

  return (
    <CharacterListContainer>
      {/*<h3 style={{ margin: 0, marginBottom: '15px' }}>Characters</h3>*/}
      <ListsContainer>
        {usersCharacters && (
          <CardsContainer>
            {Object.values(usersCharacters).map(({ owner, name, charName, classes, isDead }) => (
              <CharacterCard
                onClick={() => navigate(`${owner}/chars/${charName}`)}
                owner={owner === user.uid ?? false}
                key={`${owner}__${name}`}
              >
                <h4>
                  {name} [
                  {Object.values(classes).reduce((acc, curr) => {
                    return acc + curr.levels;
                  }, 0)}
                  ]
                </h4>
                <p>
                  {Object.entries(classes).map(([className, classData], index, array) => (
                    <span key={className}>
                      {className} {classData.levels} {index < array.length - 1 ? '/' : ''}
                    </span>
                  ))}
                </p>
                {isDead && (
                  <FaSkullCrossbones
                    style={{ position: 'absolute', right: '5px', bottom: '5px' }}
                  />
                )}
              </CharacterCard>
            ))}
          </CardsContainer>
        )}
      </ListsContainer>
    </CharacterListContainer>
  );
});

export default memo(CharactersList);
