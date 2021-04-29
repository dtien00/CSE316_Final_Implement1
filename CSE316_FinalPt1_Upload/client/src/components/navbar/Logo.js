import React from 'react';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const Logo = (props) => {
    return (
        <WButton className="logo" onClick={props.setHomeScreen} wType="texted" hoverAnimation="text-primary"> 
        The World Data Mapper
        </WButton>
    );
};

export default Logo;