import * as React from 'react';
import { Card } from 'antd';

const CardPanel = (props) => {
    const { children, ...others } = props;
    return (
        <Card {...others}>
            {/* <div style={{ display: "flex", justifyContent: align }}>
                <div style={{ width: "100%" }}>
                    {children}
                </div>
            </div> */}
            {children}
        </Card>
    );
};

export default CardPanel;
