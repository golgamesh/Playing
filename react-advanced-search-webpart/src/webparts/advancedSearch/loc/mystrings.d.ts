declare interface IAdvancedSearchWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  RowLimitFieldLabel: string;
  OptionsFieldLabel: string;
  OptionsFieldDesc: string;
  IsDebugFieldLabel: string;
  AddCriteriaFieldLabel: string;
  AddCriteriaFieldDesc: string;
}

declare module 'AdvancedSearchWebPartStrings' {
  const strings: IAdvancedSearchWebPartStrings;
  export = strings;
}
