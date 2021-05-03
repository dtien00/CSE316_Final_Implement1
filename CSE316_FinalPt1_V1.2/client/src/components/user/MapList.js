import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import MapEntry from './MapEntry';

const MapList = (props) => {
    const entries = props.maps ? props.maps : null;
    
					// <img className="welcome-icon" src={Globe} alt="welcome image"/>

	return (
		entries ? <div className=' table-entries container-primary'>
            {
                
                entries.map((entry, index) => (
                    <MapEntry
                        data={entry} key={entry._id}
                        deleteMap={props.deleteMap}
                        editItem={props.editItem}
                        index={index}
                        setActiveMap={props.setActiveMap}
                    />
                ))
            }

            </div>
            : <div className='container-primary' />
	);
}

export default MapList;
