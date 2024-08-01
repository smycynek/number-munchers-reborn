import { ExpressionData, MixedNumberExpressionData } from '../math-components/expression-data/expressionData';
import { dataUpperBound } from './constants';

import {

  isPerfectSquare
} from './predicates';

const perfectSquares = new Set<number>([...getNaturalNumberSet(dataUpperBound)].filter(n => isPerfectSquare(n)));


export function getPerfectSquares(): Set<number> {
  return new Set<number>([...perfectSquares]);
}


export function getNaturalNumberSet(upperBound: number): Set<number> {
  const base = [...[].constructor(upperBound + 1).keys()]
  const baseSet = new Set(base);
  baseSet.delete(0);
  return baseSet
}


export function toExpressionDataSet(values: Set<number>): Set<ExpressionData> {
  
  return new Set<ExpressionData>([...values].map(v => new MixedNumberExpressionData(v,0,0)));
}

export function expressionDataSetHas(expression: ExpressionData, set: Set<ExpressionData>): boolean {
  const setVals = [...set].map(vp => vp.value);
  return setVals.includes(expression.value);
}