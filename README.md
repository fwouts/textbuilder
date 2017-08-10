# TextBuilder

A simple library to output text, with support for intended blocks.

## Example usage

```
let textBuilder = new TextBuilder();
textBuilder.append('Line 1');
textBuilder.linebreak();
textBuilder.intended(() => {
  textBuilder.append('Indented line 2');
  textBuilder.linebreak();
});
textBuilder.append('Line 3', ' with something ', 'appended');

/*
Produces the given output:
Line 1
  Indented line 2
Line 3 with something appended
*/
```