export const divSymbol = '\u{00F7}';
export const greaterEqual = '\u{2265}';
export const lessEqual = '\u{2264}';
export const multSymbol = '\u{00D7}';

export function mb(): MathBuilder {
    return new MathBuilder();
}

export class MathBuilder {

    private mathElement: HTMLElement = document.createElement('span')

    public text(text: string, leadingSpace: boolean = false, trailingSpace: boolean = false): MathBuilder {
        const textSpan = document.createElement('span');
        textSpan.appendChild(document.createTextNode((leadingSpace? ' ' : '') + text + (trailingSpace? ' ' : '')));
        this.mathElement.appendChild(textSpan);
        return this;
    }

    public mText(text: string, leadingSpace: boolean = false, trailingSpace: boolean = false): MathBuilder {
        const mathNode= document.createElement('math');
        if (leadingSpace) {
            mathNode.appendChild(this.space());
        }
        const textNode= document.createElement('mtext');
        textNode.appendChild(document.createTextNode(text));
        mathNode.appendChild(textNode);
        if (trailingSpace) {
            mathNode.appendChild(this.space());
        }
        this.mathElement.appendChild(mathNode)
        return this;
    }

    public number(value: number, leadingSpace: boolean = true, trailingSpace: boolean = true): MathBuilder {
            const mathNode= document.createElement('math');
            const numberNode = document.createElement('mn');
            numberNode.appendChild(document.createTextNode(`${value}`));
            if (leadingSpace) {
                mathNode.appendChild(this.space());
            }
            mathNode.appendChild(numberNode);
            if (trailingSpace) {
                mathNode.appendChild(this.space());
            }
            this.mathElement.appendChild(mathNode);

        return this;
    }

    public space(): HTMLElement {
        const spaceNode = document.createElement('mspace');
        spaceNode.setAttribute('width', '0.35em');
        return spaceNode;
    }

    public fraction(numerator: number, denominator: number, leadingSpace: boolean = true, trailingSpace: boolean = true): MathBuilder {
        const mathNode= document.createElement('math');
        const fractionNode = document.createElement('mfrac');
        fractionNode.setAttribute('class', 'math-large');
        const numeratorNode = document.createElement('mn');
        const denominatorNode = document.createElement('mn');
        numeratorNode.appendChild(document.createTextNode(`${numerator}`));
        denominatorNode.appendChild(document.createTextNode(`${denominator}`));
        fractionNode.appendChild(numeratorNode);
        fractionNode.appendChild(denominatorNode);
        if (leadingSpace) {
            mathNode.appendChild(this.space());
        }
        mathNode.appendChild(fractionNode);
        if (trailingSpace) {
            mathNode.appendChild(this.space());
        }
        this.mathElement.appendChild(mathNode);
        return this;
    }

    public oneHalf(leadingSpace: boolean = true, trailingSpace: boolean = true): MathBuilder {
        return this.fraction(1,2, leadingSpace, trailingSpace);
    }


    public mixedNumber(whole: number, numerator: number, denominator: number, leadingSpace: boolean = true, trailingSpace: boolean = true): MathBuilder {
        const mathNode= document.createElement('math');
        const fractionNode = document.createElement('mfrac');
        const wholeNode = document.createElement('mn');
        wholeNode.appendChild(document.createTextNode(`${whole}`));
        const rowNode = document.createElement('mrow');

        fractionNode.setAttribute('class', 'math-large');
        const numeratorNode = document.createElement('mn');
        const denominatorNode = document.createElement('mn');
        numeratorNode.appendChild(document.createTextNode(`${numerator}`));
        denominatorNode.appendChild(document.createTextNode(`${denominator}`));
        fractionNode.appendChild(numeratorNode);
        fractionNode.appendChild(denominatorNode);
        rowNode.appendChild(wholeNode);
        rowNode.appendChild(fractionNode);
        if (leadingSpace) {
            mathNode.appendChild(this.space());
        }
        mathNode.appendChild(rowNode);
        if (trailingSpace) {
            mathNode.appendChild(this.space());
        }
        this.mathElement.appendChild(mathNode);
        return this;
    }


    
    public expression(operand1: number, operand2: number, operator: string, leadingSpace: boolean = false, trailingSpace: boolean = false, rvalue?: number): MathBuilder {
        const mathNode= document.createElement('math');
        const rowNode = document.createElement('mrow');
        const operand1Node = document.createElement('mn');
        const operand2Node = document.createElement('mn');
        const operatorNode = document.createElement('mo');
        operand1Node.appendChild(document.createTextNode(`${operand1}`));
        operatorNode.appendChild(document.createTextNode(operator));
        operand2Node.appendChild(document.createTextNode(`${operand2}`));
        rowNode.appendChild(operand1Node);
        rowNode.appendChild(operatorNode);
        rowNode.appendChild(operand2Node);
        if (rvalue) {
            const equalsNode = document.createElement('mo');
            equalsNode.appendChild(document.createTextNode('='));
            rowNode.appendChild(equalsNode);
            const rValueNode = document.createElement('mn');
            rValueNode.appendChild(document.createTextNode(`${rvalue}`));
            rowNode.appendChild(rValueNode);
        }
        if (leadingSpace) {
            mathNode.appendChild(this.space());
        }
        mathNode.appendChild(rowNode);
        if (trailingSpace) {
            mathNode.appendChild(this.space());
        }
        this.mathElement.appendChild(mathNode);
        return this;
    }

    public build(): string {
        const data = this.mathElement.outerHTML;
        this.reset();
        return data;
    }
    public toElement(): HTMLElement {
        return this.mathElement;
    }

    public reset(): void {
        this.mathElement = document.createElement('span');
    }
}

/*
This is not the most efficient way to get fraction values, but
the alternative would be to store the terms of the operation in
ValuePair as well as the HTML and final value, and I thought it
was too much to store, so I get the fraction terms later from
the generated HTML
*/
export function parseFraction(fraction: string): number[] {
    const element = document.createElement('math');
    element.innerHTML = fraction;
    const frac = element.querySelector('mfrac');
    return [Number(frac?.firstElementChild?.innerHTML),
        Number(frac?.lastElementChild?.innerHTML)];

}