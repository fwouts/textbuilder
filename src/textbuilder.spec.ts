import "mocha";

import TextBuilder from "./textbuilder";
import { expect } from "chai";

describe("TextBuilder", () => {
  it("does not get confused with empty text", () => {
    let textBuilder = new TextBuilder();
    textBuilder.append();
    textBuilder.append("");
    textBuilder.append("", "");
    expect(textBuilder.build()).to.be.equal("");

    textBuilder = new TextBuilder();
    textBuilder.append("abc");
    textBuilder.indented(() => {
      textBuilder.append();
      textBuilder.append("", "");
      // There should be no indent or anything, just a line break.
      expect(textBuilder.build()).to.be.equal("abc\n");
      textBuilder.append("indented", "");
    });
    expect(textBuilder.build()).to.be.equal("abc\n  indented\n");
  });

  it("accepts multiple arguments", () => {
    let textBuilder = new TextBuilder();
    textBuilder.append("Hello", ", ", "World", "!", "\n");
    expect(textBuilder.build()).to.be.equal("Hello, World!\n");
  });

  it("breaks lines", () => {
    let textBuilder = new TextBuilder();
    textBuilder.linebreak();
    textBuilder.linebreak();
    textBuilder.append("line 1");
    textBuilder.append(" continued");
    textBuilder.linebreak();
    textBuilder.append("line 2");
    textBuilder.linebreak();
    textBuilder.linebreak();
    textBuilder.linebreak();
    textBuilder.append("line 3");
    textBuilder.linebreak();
    textBuilder.linebreak();
    expect(textBuilder.build()).to.be.equal(
      `

line 1 continued
line 2


line 3

`
    );
  });

  it("indents correctly", () => {
    let textBuilder = new TextBuilder();
    textBuilder.append("Hello,");
    textBuilder.indented(() => {
      textBuilder.append("indent 1");
      textBuilder.indented(() => {
        textBuilder.append("indent 2");
      });
      textBuilder.append("indent 1 again");
    });
    textBuilder.append("World!\n");
    expect(textBuilder.build()).to.be.equal(
      `Hello,
  indent 1
    indent 2
  indent 1 again
World!
`
    );
  });

  it("does not create empty blocks when indenting without anything", () => {
    let textBuilder = new TextBuilder();
    textBuilder.append("line 1");
    textBuilder.indented(() => {});
    textBuilder.indented(() => {});
    textBuilder.indented(() => {});
    textBuilder.append("line 2");
    expect(textBuilder.build()).to.be.equal(
      `line 1
line 2`
    );
  });
});