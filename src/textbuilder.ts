export default class TextBuilder {
  /** List of non-empty parts to concatenate. */
  private _parts: string[] = [];
  private _indentLevel = 0;

  append(...text: string[]) {
    let incomingTextLength = 0;
    for (let t of text) {
      incomingTextLength += t.length;
    }
    if (incomingTextLength === 0) {
      return;
    }
    if (this._getLastCharacter() === "\n") {
      for (let i = 0; i < this._indentLevel; i++) {
        this._parts.push("  ");
      }
    }
    for (let t of text) {
      if (t.length === 0) {
        continue;
      }
      this._parts.push(t);
    }
  }

  indented(block: () => void) {
    this._indentLevel++;
    this._addLinebreakIfNotBeginning();
    try {
      block();
    } finally {
      this._indentLevel--;
      let lastCharacter = this._getLastCharacter();
      if (lastCharacter.length && lastCharacter !== "\n") {
        this._addLinebreakIfNotBeginning();
      }
    }
  }

  linebreak() {
    this._parts.push("\n");
  }

  build() {
    return this._parts.join("");
  }

  private _addLinebreakIfNotBeginning() {
    let lastCharacter = this._getLastCharacter();
    if (lastCharacter.length && lastCharacter !== "\n") {
      this.linebreak();
    }
  }

  private _getLastCharacter(): string {
    if (this._parts.length === 0) {
      return "";
    }
    let lastPart = this._parts[this._parts.length - 1];
    return lastPart[lastPart.length - 1];
  }
}
