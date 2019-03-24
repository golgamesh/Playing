declare interface IAdvancedSearchWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  SearchConfigFieldLabel: string;
  SearchConfigFieldDesc: string;
  IsDebugFieldLabel: string;
  AddCriteriaFieldLabel: string;
  AddCriteriaFieldDesc: string;
}

declare module 'AdvancedSearchWebPartStrings' {
  const strings: IAdvancedSearchWebPartStrings;
  export = strings;
}
