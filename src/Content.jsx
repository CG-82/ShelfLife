import Home from './Home.jsx';
import Collection from './Collection.jsx';
import Search from './Search.jsx';

function Content (){

    let homeActive= true;
    let collectionActive= false;
    let searchActive=false;

     return (

        <>
        <div>
            {homeActive && <Home />}
            {collectionActive && <Collection/>}
            {searchActive && <Search/>}
        </div>
        </>);
}
export default Content