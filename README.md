# TextBuilder

[![Circle CI status](https://circleci.com/gh/fwouts/textbuilder.svg?&style=shield)](https://circleci.com/gh/fwouts/textbuilder)

A simple library to output text, with support for intended blocks.

## Example usage

```
let textBuilder = new TextBuilder();
textBuilder.append('Line 1\n');
textBuilder.indented(() => {
  textBuilder.append('Indented line 2\n');
});
textBuilder.append('Line 3');
console.log(textBuilder.build());

/*
Produces the given output:
Line 1
  Indented line 2
Line 3 with something appended
*/
```
