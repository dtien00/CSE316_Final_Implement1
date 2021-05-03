import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const RegionHeader = (props) => {

    return (
        <WRow className="region-header">
            <label className="col-spacer-header">&nbsp;</label>
            <WCol size="2">
                <WButton className='table-header-section' wType="texted" onClick={null}>Name
                <label className="col-spacer-header">&nbsp;</label>
                
                <label className="col-spacer-header">&nbsp;</label>
                
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" onClick={null}>Capital
                
                <label className="col-spacer-header">&nbsp;</label>
                <label className="col-spacer-header">&nbsp;</label>
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" onClick={null}>Leader
                
                <label className="col-spacer-header">&nbsp;</label>
                
                <label className="col-spacer-header">&nbsp;</label>
                <label className="col-spacer-header">&nbsp;</label>
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" onClick={null}>Flag</WButton>
            </WCol>

            <WCol size="3">
                <WButton className='table-header-section' wType="texted" onClick={null}>Landmarks</WButton>
            </WCol>
        </WRow>
    );
};

export default RegionHeader;