import React, { useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/material.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closetag";
import socketAction from "../../socketAction";
import Avatar from "react-avatar";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const init = () => {
    console.log("init");
    editorRef.current = CodeMirror.fromTextArea(
      document.getElementById("readtimeEditor"),
      {
        mode: { name: "javascript", json: true },
        theme: "material",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );

    editorRef.current.on("change", (editorInstans, changes) => {
      console.log("editorInstans", editorInstans);
      console.log("change", changes);
      const { origin } = changes;

      const code = editorInstans.getValue();
      onCodeChange({ socketId: null, code });
      console.log("code", code);
      if (origin !== "setValue") {
        console.log("working -->", code);
        socketRef.current.emit(socketAction.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(socketAction.CODE_CHANGE, ({ code, socketId }) => {
        console.log("code receving ouut  side if -->", code);
        if (code !== null) {
          console.log("code receving in side if -->", code);
          editorRef.current.setValue(code);
          onCodeChange({ socketId, code });
        }
      });
    }

    return () => {
      socketRef.current.off(socketAction.CODE_CHANGE);
    };
  }, [socketRef.current]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div className="w-100">
        <textarea className="w-100" id="readtimeEditor"></textarea>
      </div>
    </>
  );
};

export default Editor;
