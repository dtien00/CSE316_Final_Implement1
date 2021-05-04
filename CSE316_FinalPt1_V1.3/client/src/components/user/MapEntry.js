import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import {Link} from 'react-router-dom';

const MapEntry = (props) => {
    const {data} = props;


    return (
        <>
         <WRow className='table-entry'>
            <WCol size="6">
                <Link to={"/"+props.data.name}>
                        <WButton onClick={()=>props.setActiveMap(data)} className={'specific-map-button'} >{data.name}
                        </WButton>
                </Link>
			<div className="modal-spacer">&nbsp;</div>
            </WCol>
            <WCol size="3">
                <div className='button-group'>
                        <WButton onClick={() => props.deleteMap(data, props.index)} wType="texted" className={'table-entry-buttons'}>
                                    <i className="material-icons ">delete_outline</i>
                        </WButton>
                        <Link to="/updateMap">
                        <WButton onClick={() => props.setActiveMap(data)} wType="texted" className={'table-entry-buttons'}>
                                    <i className="material-icons ">edit</i>
                        </WButton>
                        </Link>
                </div>
            </WCol>
        </WRow>
        </>
    );
};

export default MapEntry;