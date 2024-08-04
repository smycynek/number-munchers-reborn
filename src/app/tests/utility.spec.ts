
/*
This is a little bit of overkill, but if I'm making a game
for kids, I want to make sure output is correct.

Eventualy, I'll add standalone unit tests that doesn't
require ng test
*/

import { DivisionExpressionData } from "../../math-components/expression-data/expressionData";
import { getValidFactors, getFactorTargets } from "../sampleRandomValues";
import { getNaturalNumberSet, getValidBetweenValues, getValidOutsideExclusiveValues, getValidMultiples, getValidDivisionPairs, expressionDataSetHas } from "../sampleValidValues";

describe('PseudoUnitTests-Utility', () => {
    it('expressionDataSetHas should work on sets', () => {
        const divisionPairs = getValidDivisionPairs(12);
        divisionPairs.forEach(d => console.log(`D ${d.toString()}`))
        const sampleTrue = new DivisionExpressionData(24,2);
        console.log(`sampleTrue: ${sampleTrue.toString()}`)
        const sampleFalse = new DivisionExpressionData(24,3);
        console.log(`sampleFalse: ${sampleFalse.toString()}`)
        expressionDataSetHas(sampleTrue, divisionPairs);
        expressionDataSetHas(sampleFalse, divisionPairs);
        expect(expressionDataSetHas(sampleTrue, divisionPairs)).toBeTrue();
        expect(expressionDataSetHas(sampleFalse, divisionPairs)).toBeFalse();
    });


    it('expressionDataSetHas should work on sets with different components but the same value', () => {
        
        let div1 = new DivisionExpressionData(12,2);
        let div2 = new DivisionExpressionData(18,3);

        let set: Set<DivisionExpressionData>  = new Set();
        expect(div1.value).toEqual(div2.value);

        set.add(div1);
        set.add(div2);

        expect(div1.getHashCode() === (div2.getHashCode())).toBeFalse();


        let div1Dup = new DivisionExpressionData(12,2);
        expect(expressionDataSetHas(div1Dup, set)).toBeTrue();

        let altDiv1 = new DivisionExpressionData(24,4);
        expect(expressionDataSetHas(altDiv1, set)).toBeFalse();
   
    });



});