import "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textStyle: {
      removeEmptyTextStyle: () => ReturnType;
    };
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}
