import * as Model from '../model/AdvancedSearchModel';

export interface IAdvancedSearchProps {
  description: string;
  rowLimit: number;
  initialOptions: Model.IAdvancedSearchOptions;
  isDebug: boolean;
}
