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

const Editor = ({ currentClientSocketId, socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const init = () => {
    // console.log("init");
    editorRef.current = CodeMirror.fromTextArea(
      document.getElementById("readtimeEditor"),
      {
        mode: { name: "javascript", json: true },
        theme: "material",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        matchBrackets: true,
      }
    );

    editorRef.current.on("change", (editorInstans, changes) => {
      // console.log("editorInstans", editorInstans);
      // console.log("change", changes);
      const { origin } = changes;

      const code = editorInstans.getValue();
      onCodeChange({ socketId: null, code });

      if (origin !== "setValue") {
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
        if (code !== null) {
          // console.log("CODE_CHANGE *****", code, socketId);
          editorRef.current.setValue(code);
          onCodeChange({ socketId, code, currentClientSocketId });
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
