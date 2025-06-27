import React, { useState } from 'react';
import Home from './Home.jsx';
import Collection from './Collection.jsx';
import Search from './Search.jsx';

function Content (){

    const [homeActive, setHomeActive] = useState(true);
    const [collectionActive, setCollectionActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);

    const showHome = () => {
        setHomeActive(true);
        setCollectionActive(false);
        setSearchActive(false);
    };

    const showCollection = () => {
        setHomeActive(false);
        setCollectionActive(true);
        setSearchActive(false);
    };

    const showSearch = () => {
        setHomeActive(false);
        setCollectionActive(false);
        setSearchActive(true);
    };

    return (
        <>
        <div>
            <button className="home-button" onClick={showHome}>Home</button>
            <button className="collection-button" onClick={showCollection}>Collection</button>
            <button className="search-button" onClick={showSearch}>Search</button>
        </div>
        <div>
            {homeActive && <Home />}
            {collectionActive && <Collection />}
            {searchActive && <Search />}
        </div>
        </>
    );
}

export default Content;
