// types/editorjs-plugins.d.ts

declare module "@editorjs/header" {
  import { ToolConstructable } from "@editorjs/editorjs";
  const Header: ToolConstructable;
  export = Header;
}

declare module "@editorjs/list" {
  import { ToolConstructable } from "@editorjs/editorjs";
  const List: ToolConstructable;
  export = List;
}

declare module "@editorjs/marker" {
  import { ToolConstructable } from "@editorjs/editorjs";
  const Marker: ToolConstructable;
  export = Marker;
}

declare module "@editorjs/embed" {
  import { ToolConstructable } from "@editorjs/editorjs";
  const Embed: ToolConstructable;
  export = Embed;
}

declare module "@editorjs/image" {
  import { ToolConstructable } from "@editorjs/editorjs";
  const editorImage: ToolConstructable;
  export = editorImage;
}

declare module "@editorjs/quote" {
  import { ToolConstructable } from "@editorjs/editorjs";
  const Quote: ToolConstructable;
  export = Quote;
}

