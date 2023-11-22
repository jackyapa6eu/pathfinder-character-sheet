import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from 'firebase/app';
import { BrowserRouter } from 'react-router-dom';

const handleResize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
handleResize();
window.addEventListener('resize', handleResize);

(function () {
  const firebaseConfig = {
    apiKey: 'AIzaSyB5xyDLPnswLLZioaU_AtlydixuIU_TZYs',
    authDomain: 'olegators-in-pathfinder.firebaseapp.com',
    databaseURL: 'https://olegators-in-pathfinder-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'olegators-in-pathfinder',
    storageBucket: 'olegators-in-pathfinder.appspot.com',
    messagingSenderId: '68880431060',
    appId: '1:68880431060:web:71677bd72d52afd705c841',
  };
  initializeApp(firebaseConfig);
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
