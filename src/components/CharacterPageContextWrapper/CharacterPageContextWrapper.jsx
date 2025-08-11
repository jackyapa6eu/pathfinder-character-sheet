import { memo, useEffect, useState } from 'react';
import CharacterPage from '../CharacterPage';
import { CharactersStore } from '../../store/charactersStore';

const CharacterPageContextWrapper = ({
  additionalCharId,
  additionalOwnerId,
  isModal,
  isDarkTheme,
}) => {
  const [store, setStore] = useState(null);

  useEffect(() => {
    const newStore = new CharactersStore();
    setStore(newStore);
  }, []);

  if (!store) {
    return <div />;
  }

  return (
    <CharacterPage
      store={store}
      additionalCharId={additionalCharId}
      additionalOwnerId={additionalOwnerId}
      isModal={isModal}
      isDarkTheme={isDarkTheme}
    />
  );
};

export default memo(CharacterPageContextWrapper);
