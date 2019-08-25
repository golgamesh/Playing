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
  GreaterThanName: string;
  GreaterThanPlaceholder1: string;
  LessThanName: string;
  LessThanPlaceholder1: string;
  BetweenName: string;
  BetweenPlaceholder1: string;
  BetweenPlaceholder2: string;
  BetweenSymbol: string;
  ContainsName: string;
  GreaterThanEqualsName: string;
  GreaterThanEqualsPlaceholder1: string;
  LessThanEqualsName: string;
  LessThanEqualsPlaceholder1: string;
  EqualsName: string;
  EqualsSymbol: string;
  EqualsPlaceholder1: string;
}

declare module 'AdvancedSearchWebPartStrings' {
  const strings: IAdvancedSearchWebPartStrings;
  export = strings;
}
