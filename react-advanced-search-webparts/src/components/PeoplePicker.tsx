import * as React from 'react';
import { 
    sp, 
    SearchResults,
    SearchResult, 
    SearchQueryBuilder,
    SearchQuery 
} from '@pnp/sp';
import {
    NormalPeoplePicker, IPeoplePickerProps
} from 'office-ui-fabric-react/lib/Pickers';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { Label } from 'office-ui-fabric-react/lib/Label';

export interface PeoplePickerProps extends IPeoplePickerProps {
    label?: string;
    placeholder?: string;
    ManagedProperty?: string;
}

export interface PeoplePickerState {

}

export interface PeopleSearchResult extends SearchResult {
    JobTitle: string;
    PictureURL: string;
    PreferredName: string;
}

export default class PeoplePicker extends React.Component<PeoplePickerProps, PeoplePickerState> {
    constructor(props: PeoplePickerProps) {
        super(props);

        this.state = {

        } as PeoplePickerState;
    }

    public state: PeoplePickerState;
    public RowLimit = 5;

    
    public render(): React.ReactElement<PeoplePickerProps> {
        return (
            <div>
                <Label>{this.props.label}</Label>
                <NormalPeoplePicker
                    onResolveSuggestions={this.onPersonPicker_ResolveSuggestions}
                    itemLimit={1}
                />
            </div>
        );
    }

    
    protected onPersonPicker_ResolveSuggestions = (filter: string, selectedItems?: IPersonaProps[]): IPersonaProps[] | PromiseLike<IPersonaProps[]> => {
        if(filter.length > 2) {
            let currPersons = [];
            let histPersons = [];
            let p = [];
            
            p.push(this._searchPeople(filter).then(persons => {
                currPersons = persons;
            }));
            
            p.push(this._searchManagedProperty(filter, "Author").then(persons => {
                histPersons = persons;
            }));

            return Promise.all(p).then(() => {
                histPersons = this._cleanMultivalueResults(histPersons, filter);
                return this._removeDuplicates(currPersons.concat(histPersons));
            });
        } else {
            return Promise.resolve([]);
        }
    }

    private _searchPeople(searchTerms: string): Promise<Array<IPersonaProps>> {
        let SelectProperties = [
            "PreferredName",
            "JobTItle",
            "PictureURL"
        ];
        let SourceId = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
        let RowLimit = this.RowLimit;
        const queryOptions: SearchQuery = {
            SelectProperties,
            RowLimit,
            SourceId
        };
        
        const q = SearchQueryBuilder(searchTerms, queryOptions);

        
        return sp.search(q).then((r: SearchResults) => {
            return r.PrimarySearchResults.map((row: PeopleSearchResult) => {
                return {
                    secondaryText: row.JobTitle,
                    imageUrl: row.PictureURL,
                    primaryText: row.PreferredName
                } as IPersonaProps;
            });
        });
    }

    private _searchManagedProperty(searchTerms: string, managedProperty: string): Promise<Array<IPersonaProps>> {
        let SelectProperties = [
            managedProperty
        ];
        let RowLimit = this.RowLimit;
        let TrimDuplicates = true;

        const queryOptions: SearchQuery = {
            SelectProperties,
            RowLimit,
            TrimDuplicates
        };
        
        const q = SearchQueryBuilder(searchTerms, queryOptions);

        return sp.search(q).then((r: SearchResults) => {
            console.log('results: ', r.PrimarySearchResults);
            return r.PrimarySearchResults.map(row => {
                return {
                    secondaryText: '',
                    imageUrl: '',
                    primaryText: row.Author
                } as IPersonaProps;
            });

        });

    }

    private _removeDuplicates(persons: Array<IPersonaProps>): Array<IPersonaProps> {
        let unique = {};
        persons.forEach(p => {
          if(!unique[p.primaryText]) {
            unique[p.primaryText] = p;
          }
        });
        let arr: Array<IPersonaProps> = [];
        for (let p in unique) {
            arr.push(unique[p]);
        }

        return arr;
    }

    private _cleanMultivalueResults(persons: Array<IPersonaProps>, searchTerm: string): Array<IPersonaProps> {
        let multis = persons.filter(p => p.primaryText.indexOf(';') !== -1);
        let lowerTerm = searchTerm.toLowerCase();

        multis.forEach(p => {
            let names = p.primaryText.split(';');
            for(let i = 0; i < names.length; i++) {
                let n = names[i];
                if(n.toLowerCase().indexOf(lowerTerm) !== -1) {
                    p.primaryText = n;
                    break;
                }
            }
        });

        return persons;
    }
    
}