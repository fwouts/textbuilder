export default class TextBuilder {
  private rootBlockList: BlockList = { blocks: [] };
  private indentLevel = 0;
  private indentSpace: string;

  constructor(indentSpace = "  ") {
    this.indentSpace = indentSpace;
  }

  append(text: string) {
    let lines = text.split("\n");
    const blocks = this.getCurrentBlocks().blocks;
    if (blocks.length > 0 && typeof blocks[blocks.length - 1] === "string") {
      blocks[blocks.length - 1] += lines[0];
      lines = lines.slice(1);
    }
    blocks.push(...lines);
  }

  indented(block: () => void) {
    this.getCurrentBlocks().blocks.push({ blocks: [] });
    this.indentLevel++;
    try {
      block();
    } finally {
      this.indentLevel--;
    }
  }

  build() {
    let text = this.buildBlockList(this.rootBlockList, "");
    if (text === null || text === "") {
      return "";
    }
    return text;
  }

  private buildBlockList(blockList: BlockList, indent: string) {
    if (blockList.blocks.length === 0) {
      return null;
    } else {
      const lines = blockList.blocks
        .map(block => this.buildBlock(block, indent))
        .filter(text => text !== null)
        .join("\n");
      return lines;
    }
  }

  private buildBlock(block: Block, indent: string): string | null {
    if (typeof block === "string") {
      if (block === "") {
        return "";
      }
      return indent + block;
    } else {
      const text = this.buildBlockList(block, indent + this.indentSpace);
      if (text === null) {
        return null;
      }
      if (text.endsWith("\n")) {
        return text.substr(0, text.length - 1);
      }
      return text;
    }
  }

  private getCurrentBlocks(): BlockList {
    let blockList = this.rootBlockList;
    for (let i = 0; i < this.indentLevel; i++) {
      const nested = blockList.blocks[blockList.blocks.length - 1];
      if (typeof nested === "string") {
        throw new Error("Unexpected error.");
      }
      blockList = nested;
    }
    return blockList;
  }
}

type Block = string | BlockList;
type BlockList = { blocks: Block[] };
