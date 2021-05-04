import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import SubregionEntry from '../region/SubregionEntry';
import RegionHeader from '../region/RegionHeader';
import * as mutations from '../../cache/mutations';
import * as queries from '../../cache/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Globe					from '../../transparent_globe_altered.png';

const RegionViewer = (props) => {
    let maps =[];
    const [map, setMap] = useState({});
    const[entries, setEntries] = useState([]);
    const[AddRegion]    =useMutation(mutations.ADD_REGION);


    const{loading, error, data, refetch}   =useQuery(queries.GET_DB_MAPS)
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

    const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
			if (props.activeRegion._id) {
				let tempID = props.activeRegion._id;
				let map = maps.find(map => map._id === tempID);
				props.setActiveRegion(map);
			}
		}
	}

	return (
        <>
        <Link to={"/"+props.activeMap.name}>
        <button onClick={null} className={'return-to-spreadsheet-button'} >Back
                        </button>
        </Link>
        <label className="region-landmarks-label">Region Landmarks:</label>
            <div className=' region-landmarks container-secondary'>
            </div>
            <label className="region-viewer-name region-property">{"Region name: " + props.activeRegion.name}</label>
            <label className="region-viewer-parent region-property">Parent Region: To be implemented</label>
            <label className="region-viewer-capital region-property">{"Region capital: " + props.activeRegion.capital}</label>
            <label className="region-viewer-leader region-property">{"Region leader: " + props.activeRegion.leader}</label>
            
            <button onClick={null} className={'add-landmark-button'} >+
                        </button>
            <input className="landmark-input" type="text"></input>
			<img className="region-viewer-icon" src={Globe} alt="welcome image"/>
        </>
	);
}

export default RegionViewer;

