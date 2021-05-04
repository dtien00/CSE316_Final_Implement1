import React, { useState, useEffect } 	from 'react';
import Homescreen 		from './components/homescreen/Homescreen';
import { useMutation, useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import * as mutations 	from './cache/mutations';
import { jsTPS } 		from './utils/jsTPS';
import Update			from './components/modals/Update';
import Login			from './components/modals/Login';
import CreateAccount	from './components/modals/CreateAccount';
import MapCreation		from './components/modals/MapCreation';
import UserHome 		from './components/user/UserHome';
import MapUpdate		from './components/modals/MapUpdate';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import NavbarOptions from './components/navbar/NavbarOptions';
import RegionSpreadSheet from './components/region/RegionSpreadSheet';
import RegionViewer from './components/landmarks/RegionViewer'; 


const App = () => {
	let user = null;
    let transactionStack = new jsTPS();
	const [activeMap, setActiveMap] 		= useState({});
	const [activeRegion, setActiveRegion]	= useState({});
	const [regions, setRegions]				= useState([]);
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);
    const[AddRegion]    =useMutation(mutations.ADD_REGION);
	
    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }
	const auth = user === null ? false : true;
	
	// exact component={user===null ? Homescreen:UserHome}

	const handleSetActiveMap = (data) => {
		console.log("Changing active map");
		setActiveMap(data);
		console.log(activeMap);
	}

	const addNewSubregion = (mapID, region, opcode) => {
        let {data} = AddRegion({variables: {_id: mapID, region: region, index: opcode}});
        // reload();
		console.log("APP.JS CALL: ");
		console.log(activeMap);
		
	}

	const setNewActiveRegion = (data) => {
		console.log("Changing active region");
		setActiveRegion(data);
		console.log(activeRegion);
	}

	const changeActiveMap = (map) => {
		setActiveMap(map);
	}

	const mapName = activeMap.name;
	const regionName = activeRegion.name;
	console.log("MAP NAME: " + mapName);
	console.log("REGION NAME: " + regionName);

	return(
		<Router>
        	<WLayout wLayout="header-lside">
				<NavbarOptions auth={auth} user={user} fetchUser={refetch}/>
					<Switch>
						<Route 
							path="/" exact render={()=>user===null ? <Homescreen/>:<UserHome user={user} setActiveMap={handleSetActiveMap}/>}
						/>
						<Route
							path="/register"
							render={()=><CreateAccount fetchUser={refetch} />}
						/>
						<Route
							path="/update"
							render={()=><Update fetchUser={refetch}/>}
						/>
						<Route
							path="/login"
							render={()=><Login fetchUser={refetch} />}
						/>
						<Route
							path="/newMap"
							render={()=><MapCreation user={user} />}
						/>
						<Route
							path="/updateMap"
							render={()=><MapUpdate user={user} activeMap={activeMap}/>}
						/>
						<Route
							path={"/"+mapName}
							render={()=><RegionSpreadSheet user={user} activeMap={activeMap} activeRegions={activeRegion}
							handleSetActive={setNewActiveRegion} addSubregion={addNewSubregion} 
							handleActiveMapChange={changeActiveMap} handleActiveRegion={setNewActiveRegion}/>}
						/>
						<Route
							path={"/"+regionName+"/landmarks"}
							render={()=><RegionViewer user={user} activeMap={activeMap} activeRegion={activeRegion} 
							handleActiveMapChange={changeActiveMap} setActiveRegion={setNewActiveRegion} addSubregion={addNewSubregion}/>}
						/>
					</Switch>
			</WLayout>
		</Router>
	);
}

export default App;