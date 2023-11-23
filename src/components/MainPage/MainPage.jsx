import { observer } from 'mobx-react';
import { memo } from 'react';
import authStore from '../../store/authStore';
import CharactersList from '../CharactersList/CharactersList';

const MainPage = observer(() => {
  const { user } = authStore;

  return <>{user ? <CharactersList /> : <h1>Olegators is Pathfinder</h1>}</>;
});

export default memo(MainPage);
