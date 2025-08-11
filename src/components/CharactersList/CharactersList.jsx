import { observer } from 'mobx-react';
import React, { memo, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSkullCrossbones } from 'react-icons/fa6';

import authStore from '../../store/authStore';
import usersStore from '../../store/usersStore';
import CroppedImage from '../CroppedImage';

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
  align-items: flex-end;
  position: relative;
  max-width: 550px;
  gap: 5px;
  box-shadow: 0 0 1px rgba(128, 128, 128, 1);
  padding: 6px;
  border-radius: 6px;
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

  @media screen and (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
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

const DEFAULT_IMAGE_LINK = 'https://i.postimg.cc/bNHNQwtg/0926d090-dd70-4242-926e-5cea3c486c48.png';

const CharactersList = observer(() => {
  const { user } = authStore;
  const { getUsers, usersCharacters } = usersStore;

  const navigate = useNavigate();

  const chars = useMemo(
    () =>
      usersCharacters
        ? Object.values(usersCharacters).sort((a, b) => Number(!!a.isDead) - Number(!!b.isDead))
        : [],
    [usersCharacters]
  );

  const getData = async () => {
    await Promise.all([getUsers(user.uid, user.dm)]);
  };

  useEffect(() => {
    if (user) {
      (async () => {
        await getData();
      })();
    }
  }, [user]);

  return (
    <CharacterListContainer>
      <ListsContainer>
        <CardsContainer>
          {chars.map(({ owner, name, charName, classes, isDead, avatar }) => (
            <CharacterCard
              onClick={() => navigate(`${owner}/chars/${charName}`)}
              owner={owner === user.uid ?? false}
              key={`${owner}__${name}`}
            >
              <CroppedImage
                imageSrc={avatar?.imageLink || DEFAULT_IMAGE_LINK}
                croppedAreaPixels={avatar?.croppedAreaPixels || null}
                displayWidth={80}
                displayHeight={80}
                borderRadius='50%'
              />
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
                <FaSkullCrossbones style={{ position: 'absolute', right: '5px', bottom: '5px' }} />
              )}
            </CharacterCard>
          ))}
        </CardsContainer>
      </ListsContainer>
    </CharacterListContainer>
  );
});

export default memo(CharactersList);
