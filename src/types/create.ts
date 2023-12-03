import { ProdBrowseStrategy } from "./browse";

export type StrategyToCreate = ProdBrowseStrategy & {
  pythonCode: string;
};
