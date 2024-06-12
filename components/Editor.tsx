// import React, { useEffect, useRef, useState } from "react";
// import EditorJS from "@editorjs/editorjs";
// import { useTheme } from "next-themes";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";

// export const Editor = ({
//     onSaveTrigger,
//     fileId,
//     fileData,
// }: {
//     onSaveTrigger: any;
//     fileId: any;
//     fileData: File;
// }) => {
//     const ref = useRef<EditorJS | null>(null);
//     const [document, setDocument] = useState();
//     const { theme } = useTheme();

//     useEffect(() => {
//         if (fileData) {
//             initEditor();
//         }
//         return () => {
//             if (ref.current) {
//                 ref.current.destroy();
//                 ref.current = null;
//             }
//         };
//     }, [fileData]);

//     const initEditor = () => {
//         if (ref.current) {
//             ref.current.destroy();
//         }

//         ref.current = new EditorJS({
//             tools: {
//                 header: {
//                     class: Header,
//                     inlineToolbar: true,
//                     config: {
//                         placeholder: "Type Heading...",
//                         levels: [2, 3]
//                     }
//                 },
//                 list: {
//                     class: List,
//                     inlineToolbar: true,
//                     config: {
//                         defaultStyle: 'unordered'
//                     }
//                 }
//             }
//         })

//     };

//     return <div>Editor</div>;
// };
