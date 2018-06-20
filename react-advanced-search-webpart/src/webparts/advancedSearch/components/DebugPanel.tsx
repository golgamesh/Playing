import * as React from 'react';
import styles from './AdvancedSearch.module.scss';

export interface IDebugPanelProps {
    searchQuery: string;
    isDebug: boolean;
}

export default class DebugPanel extends React.Component<IDebugPanelProps, {}> {
    constructor() {
        super();

    }

    public render(): React.ReactElement<IDebugPanelProps> {

        if(!this.props.isDebug){

            return null;

        } else {

            return (
                <div className={styles.panelDebug}>
                     <div className={styles.panelTitle}>
                         <div><i className="ms-Icon ms-Icon--BugSolid" aria-hidden="true"></i> Debug Panel</div>
                         <div>While in debug mode, result object will log to the console.</div>
                     </div>
                     <hr/>
                     <div className="ms-Grid">
                        <div className={`${styles.panelDetails} ms-Grid-row`}>
                            <div className={`ms-Grid-col ms-sm1 ${styles.panelLabel}`}>Query</div>
                            <div className={`ms-Grid-col ms-sm11 ${styles.panelValue}`}>{this.props.searchQuery}</div>
                        </div>
                        <div className={`${styles.panelDetails} ms-Grid-row`}>
                            <div className={`ms-Grid-col ms-sm1 ${styles.panelLabel}`}>Results</div>
                            <div className={`ms-Grid-col ms-sm11 ${styles.panelValue}`}>While in debug mode, result object will log to the console.</div>
                        </div>
                     </div>
                </div> 
            );

        }

    }

}