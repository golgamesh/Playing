declare interface IAdvancedSearchWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  IncludeKeywordSearchLabel: string;
  SearchConfigFieldLabel: string;
  SearchConfigFieldDesc: string;
  IsDebugFieldLabel: string;
  AddCriteriaFieldLabel: string;
  AddCriteriaFieldDesc: string;
  StartMinimizedLabel: string;
}

declare module 'AdvancedSearchWebPartStrings' {
  const strings: IAdvancedSearchWebPartStrings;
  export = strings;
}
