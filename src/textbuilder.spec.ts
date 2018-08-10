import { expect } from "chai";
import "mocha";
import TextBuilder from "./textbuilder";

describe("TextBuilder", () => {
  it("uses customizable indent spacing", () => {
    let textBuilder = new TextBuilder("\t");
    textBuilder.append("line 1");
    textBuilder.indented(() => {
      textBuilder.append("line 2");
    });
    expect(textBuilder.build()).to.be.equal(
      `line 1
\tline 2`
    );
  });

  it("does not get confused with empty text", () => {
    let textBuilder = new TextBuilder();
    textBuilder.append("");
    expect(textBuilder.build()).to.be.equal("");

    textBuilder = new TextBuilder();
    textBuilder.append("abc");
    textBuilder.indented(() => {
      textBuilder.append("");
      // There should be no indent or anything, just a line break.
      expect(textBuilder.build()).to.be.equal("abc\n");
      textBuilder.append("indented");
    });
    expect(textBuilder.build()).to.be.equal("abc\n  indented");
  });

  it("breaks lines", () => {
    let textBuilder = new TextBuilder();
    textBuilder.append("\n");
    textBuilder.append("\nline 1");
    textBuilder.append(" continued");
    textBuilder.append("\n");
    textBuilder.append("line 2\n\n\n");
    textBuilder.append("line 3\n");
    textBuilder.append("\n");
    expect(textBuilder.build()).to.be.equal(
      `

line 1 continued
line 2


line 3

`
    );
  });

  it("keeps indentation when line breaks in the middle", () => {
    let textBuilder = new TextBuilder();
    textBuilder.append("A");
    textBuilder.indented(() => {
      textBuilder.append("B\nC\nD");
    });
    textBuilder.append("E");
    expect(textBuilder.build()).to.be.equal(
      `A
  B
  C
  D
E`
    );
  });

  it("removes indentation on empty lines", () => {
    let textBuilder = new TextBuilder();
    textBuilder.append("A");
    textBuilder.indented(() => {
      textBuilder.append("B\n\n\nC\nD");
    });
    textBuilder.append("E");
    expect(textBuilder.build()).to.be.equal(
      `A
  B


  C
  D
E`
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

  it("removes last line break at the end of indent block", () => {
    let textBuilder = new TextBuilder();
    textBuilder.append("Hello,");
    textBuilder.indented(() => {
      textBuilder.append("indent\n");
    });
    textBuilder.append("World!\n");
    expect(textBuilder.build()).to.be.equal(
      `Hello,
  indent
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
