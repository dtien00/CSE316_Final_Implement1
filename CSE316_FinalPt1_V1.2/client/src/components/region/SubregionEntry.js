import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import {Link} from 'react-router-dom';

const SubregionEntry = (props) => {
    const data = props.data;
    console.log(data);
					// <img className="welcome-icon" src={Globe} alt="welcome image"/>

    const handleActive = () => {
        props.handleActive(data);
    }

	return (
        <WRow className='region-entry'>
        <label className="col-spacer-header">&nbsp;</label>
            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>Name
                <label className="col-spacer-header">&nbsp;</label>
                
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>Capital
                
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>Leader
                
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>Flag</WButton>
            </WCol>

            <WCol size="3">
                <Link to={"/"+props.activeMap.name+"/"+data.name}>
                    <WButton className='specific-region-button' wType="texted" onClick={handleActive}>Landmarks</WButton>
                </Link>
            </WCol>
        </WRow>
	);
}

export default SubregionEntry;