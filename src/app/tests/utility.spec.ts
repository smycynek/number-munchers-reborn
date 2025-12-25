/*
This is a little bit of overkill, but if I'm making a game
for kids, I want to make sure output is correct.
*/

import { DivisionExpressionData } from '../../math-components/expression-data/expressionData';
import { getValidDivisionPairs, expressionDataSetHas } from '../puzzles/sampleValidValues';

describe('PseudoUnitTests-Utility', () => {
  it('expressionDataSetHas should work on sets', () => {
    const divisionPairs = getValidDivisionPairs(12);
    const sampleTrue = new DivisionExpressionData(24, 2);
    const sampleFalse = new DivisionExpressionData(24, 3);
    expressionDataSetHas(sampleTrue, divisionPairs);
    expressionDataSetHas(sampleFalse, divisionPairs);
    expect(expressionDataSetHas(sampleTrue, divisionPairs)).toBeTrue();
    expect(expressionDataSetHas(sampleFalse, divisionPairs)).toBeFalse();
  });

  it('expressionDataSetHas should work on sets with different components but the same value', () => {
    const div1 = new DivisionExpressionData(12, 2);
    const div2 = new DivisionExpressionData(18, 3);

    const set: Set<DivisionExpressionData> = new Set();
    expect(div1.value).toEqual(div2.value);

    set.add(div1);
    set.add(div2);

    expect(div1.getHashCode() === div2.getHashCode()).toBeFalse();

    const div1Dup = new DivisionExpressionData(12, 2);
    expect(expressionDataSetHas(div1Dup, set)).toBeTrue();

    const altDiv1 = new DivisionExpressionData(24, 4);
    expect(expressionDataSetHas(altDiv1, set)).toBeFalse();
  });
});
