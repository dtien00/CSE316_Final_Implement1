import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import SubregionEntry from './SubregionEntry';
import RegionHeader from './RegionHeader';
import * as mutations from '../../cache/mutations';
import * as queries from '../../cache/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RegionSpreadSheet = (props) => {
    let maps =[];
    const [map, setMap] = useState({});
    const[entries, setEntries] = useState([]);
    const[AddRegion]    =useMutation(mutations.ADD_REGION);
    const{loading, error, data, refetch}   =useQuery(queries.GET_DB_MAPS)
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }
    
    useEffect(()=>{refetchMaps(refetch);},[maps]);

    console.log(props.activeMap);
    // setEntries(props.activeMap.regions);

    const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
			if (props.activeMap._id) {
				let tempID = props.activeMap._id;
				let map = maps.find(map => map._id === tempID);
				props.handleSetActive(map);
			}
		}
	}


    const addDefaultSubregion = async () => {
        console.log("Adding default subregion");
		const regions = props.activeMap.regions;
        console.log("Before:");
        console.log(regions);
		const lastID = regions.length >= 1 ? regions[regions.length - 1].id + 1 : 0;
        let newSubregion ={
            _id: '',
            id: lastID,
            name: 'No Name',
            capital: 'No Capital',
            leader: 'No Leader',
            flag: '[Image Here]',
            parent: ' ',
            landmarks: []
        }
		let mapID = props.activeMap._id;
        let {data} = await AddRegion({variables: {_id: mapID, region: newSubregion, index: -1}});
        await refetchMaps(refetch);
        console.log("After:");
        console.log(props.activeMap.regions);
        props.handleActiveMapChange(props.activeMap);
        console.log("After 2:");
        console.log(props.activeMap.regions);
        setEntries(props.activeRegions.regions);
        // window.location.reload();
        // entries = regions;
    }

    const changeActiveMap = (mapId) => {
        // setEntries(props.activeMap.regions);
        setEntries(props.activeMap.regions.filter(map => map.parent===mapId));
    }

	return (
        <>
        <div>
        <Link to={"/"+props.activeMap.name}>
        <WButton onClick={addDefaultSubregion} className={'add-subregion-button'} >+
                        </WButton>
        </Link>
        <label className="spreadsheet-header">{props.activeMap.name}</label>
        <RegionHeader/>
            {entries ? <div className=' region-spreadsheet container-primary'>             
            {
                
                entries.map((entry, index) => (
                    <SubregionEntry
                        data={entry} key={entry._id}
                        index={index}
                        activeMap={props.activeMap}
                        handleActive={props.handleSetActive}
                        changeActiveMap={changeActiveMap}
                    />
                ))
            }

            </div>
            : <div className='region-spreadsheet container-primary' />}
        </div>
        </>
	);
}

export default RegionSpreadSheet;

