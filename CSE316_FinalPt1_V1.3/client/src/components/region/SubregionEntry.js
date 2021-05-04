import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import {Link} from 'react-router-dom';

const SubregionEntry = (props) => {
    const data = props.data;
    console.log(data);
					// <img className="welcome-icon" src={Globe} alt="welcome image"/>

    const handleActive = () => {
        console.log("EYOOOOO: " + data.name);
        props.handleActive(data);
    }

    const handleActiveMapChange = () => {
        console.log("REGION (MAP) ID: ");
        console.log(data.name);
        props.changeActiveMap(data.name);
    }

	return (
        <WRow className='region-entry'>
        <label className="col-spacer-header">&nbsp;</label>
            <WCol size="2">
                <Link to={"/"+props.activeMap.name}>
                <WButton className='specific-region-button' wType="texted" onClick={handleActiveMapChange}>{data.name}
                <label className="col-spacer-header">&nbsp;</label>
                </WButton>
                </Link>
            </WCol>

            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>{data.capital}
                
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>{data.leader}
                
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>{data.flag}</WButton>
            </WCol>

            <WCol size="3">
                <Link to={"/"+data.name+"/landmarks"}>
                    <WButton className='specific-region-button' wType="texted" onClick={handleActive}>{data.landmarks[0] ? data.landmarks:"[Landmarks]"}</WButton>
                </Link>
            </WCol>
        </WRow>
	);
}

export default SubregionEntry;