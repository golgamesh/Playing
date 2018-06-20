declare interface IAdvancedSearchWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  RowLimitFieldLabel: string;
  SearchConfigFieldLabel: string;
  SearchConfigFieldDesc: string;
  ResultsConfigFieldLabel: string;
  ResultsConfigFieldDesc: string;
  IsDebugFieldLabel: string;
  AddCriteriaFieldLabel: string;
  AddCriteriaFieldDesc: string;
}

declare module 'AdvancedSearchWebPartStrings' {
  const strings: IAdvancedSearchWebPartStrings;
  export = strings;
}
