import * as React from 'react';
import styles from './GlobalAlerts.module.scss';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";


const map: any = require('lodash/map');

const Qry_Alert = `<View>
    <Query>
        <Where>
            <And>
                <And>
                    <Eq>
                        <FieldRef Name='IsActive' />
                        <Value Type='Boolean'>1</Value>
                    </Eq>
                    <Leq>
                        <FieldRef Name='StartDate' />
                        <Value Type='DateTime'>
                            <Today />
                        </Value>
                    </Leq>
                </And>
                <Geq>
                    <FieldRef Name='ExpiryDate' />
                    <Value Type='DateTime'>
                        <Today />
                    </Value>
                </Geq>
            </And>
        </Where>
        <OrderBy>
            <FieldRef Name='Sequence' />
            <FieldRef Name='Modified' />
        </OrderBy>
    </Query>
    <ViewFields>
        <FieldRef Name='Title' />
    </ViewFields>
</View>
  `;

export interface IAlertsProps {
 

    alertBackgroundColor: string;
    textColor: string;
}

export default function (props: IAlertsProps) {
    let bgColor: string = props.alertBackgroundColor ? props.alertBackgroundColor : 'red';
    let textColor: string = props.textColor ? props.textColor : 'white';
    const [alerts, setAlerts] = React.useState<string>('');
    const [showAlerts, setShowAlerts] = React.useState<boolean>(false);
  
    const _hidePlaceHolders = () => {
        let style: string = `
        div[data-sp-placeholder="Top"] {
            display: none !important;
        }
    `;
        var head = document.head || document.getElementsByTagName('head')[0];
        var styletag = document.createElement('style');
        styletag.type = 'text/css';
        styletag.appendChild(document.createTextNode(style));
        head.appendChild(styletag);
    };
    const _loadAlerts = async () => {
        let globalalerts: any[] = await sp.web.lists.getByTitle('Alerts').getItemsByCAMLQuery({
            ViewXml: Qry_Alert
        });
        if (globalalerts.length > 0) {
            let tempMsges = map(globalalerts, 'Title');
            setAlerts(tempMsges.join('~'));
           
            setShowAlerts(true);
        } else _hidePlaceHolders();
    };
    React.useEffect(() => {
        _loadAlerts();
    }, []);
     
    if(alerts.length !=null)
    {
      var alertType = alerts
    }
    
    return (
        
        <>
        
            {alerts.length > 0 &&
                <div className={css("ms-Grid-row", styles.alertContainer)} style={{ backgroundColor: 'red', color: 'white' }}>
                    {showAlerts &&
                        <span id="alertMessage">{alerts}</span>
                    }
                </div>
            }
        </>
    );
}