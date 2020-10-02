import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEditor,
  Node,
  Editor as SlateEditor,
  Transforms,
  Text,
} from "slate";

import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";

import styled from "styled-components";
import { Ribbon, SelectedTextStyles } from "./Ribbon";
import { StyledText } from "./StyledText";
import { About, NewFileModal, OpenFileModal, SaveFileModal } from "./Modals";
import {
  initStorage,
  getProjectNames,
  openProject,
  saveProject,
} from "./storage";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledEditable = styled(Editable)`
  flex-grow: 1;
  width: 100%;
  padding: 10px;
`;

const defaultFormat = {
  font: "Times New Roman",
  fontSize: 18,
  isBold: false,
  isItalic: false,
  isStrike: false,
  isUnderline: false,
};

type EditorObject = SlateEditor & ReactEditor & HistoryEditor;

export const Editor: React.FC = () => {
  const [storage, setStorage] = useState<IDBDatabase | null>(null);
  const [projects, setProjects] = useState<string[]>([]);

  const [showOpenFileModal, setShowOpenFileModal] = useState(false);
  const [showSaveFileModal, setShowSaveFileModal] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    initStorage().then((db) => {
      setStorage(db);

      getProjectNames(db).then((projectNames) => {
        setProjects(projectNames);
      });
    });
  }, []);

  const [selectedTextStyles, setSelectedTextStyles] = useState<
    SelectedTextStyles
  >(defaultFormat);

  const editor = useMemo<EditorObject>(() => {
    let editor = withReact(createEditor());
    return withHistory(editor);
  }, []);

  const actions = useMemo(() => actionCreator(editor), [editor]);

  const initialText = [
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph.", ...defaultFormat }],
    },
  ];
  const [value, setValue] = useState<Node[]>(initialText);

  const renderLeaf = useCallback((props) => {
    return <StyledText {...props} {...props.leaf} />;
  }, []);

  return (
    <>
      {showSaveFileModal && storage ? (
        <SaveFileModal
          onModalClose={() => setShowSaveFileModal(false)}
          onSaveFile={(projectName: string, override: boolean) => {
            saveProject(
              storage,
              {
                name: projectName,
                content: JSON.stringify(value),
              },
              override
            ).then(
              () => {
                if (!override) {
                  projects.push(projectName);
                  setProjects(projects);
                }
                setShowSaveFileModal(false);
              },
              (message) => {
                console.log(message);
              }
            );
          }}
          projects={projects}
        />
      ) : null}

      {showOpenFileModal && storage ? (
        <OpenFileModal
          onModalClose={() => setShowOpenFileModal(false)}
          onOpenFile={(projectName: string) => {
            openProject(storage, projectName).then((project) => {
              setValue(JSON.parse(project.content));
              setShowOpenFileModal(false);
            });
          }}
          projects={projects}
        />
      ) : null}

      {showNewFileModal ? (
        <NewFileModal
          onModalClose={() => setShowNewFileModal(false)}
          onNewFile={() => {
            setValue(initialText);
            setShowNewFileModal(false);
          }}
        />
      ) : null}

      {showAboutModal ? (
        <About onModalClose={() => setShowAboutModal(false)} />
      ) : null}

      <Container>
        <Ribbon
          onOpenFile={() => setShowOpenFileModal(true)}
          onNewFile={() => setShowNewFileModal(true)}
          onSaveFile={() => setShowSaveFileModal(true)}
          onAbout={() => setShowAboutModal(true)}
          selectedTextStyles={selectedTextStyles}
          {...actions}
        />
        <Slate
          editor={editor}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);

            if (editor.selection) {
              setSelectedTextStyles({
                isUnderline: actions.isUnderline(editor),
                isStrike: actions.isStrike(editor),
                isItalic: actions.isItalic(editor),
                isBold: actions.isBold(editor),
                fontSize: actions.getFontSize(editor),
                font: actions.getFont(editor),
              });
            }
          }}
        >
          <StyledEditable
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              if (!event.ctrlKey) {
                return;
              }

              switch (event.key) {
                case "b": {
                  actions.onFormatBold(true);
                  break;
                }
                case "i": {
                  actions.onFormatItalic(true);
                  break;
                }
                case "u": {
                  actions.onFormatUnderline(true);
                  break;
                }
                case "l": {
                  actions.onFormatStrike(true);
                  break;
                }
              }
            }}
          />
        </Slate>
      </Container>
    </>
  );
};

const actionCreator = (editor: ReactEditor & HistoryEditor) => ({
  onPaste: () => document.execCommand("paste"),
  onCut: () => document.execCommand("cut"),
  onCopy: () => document.execCommand("copy"),
  onFontChanged: (font: string) =>
    Transforms.setNodes(
      editor,
      { font: font },
      { match: (n) => Text.isText(n), split: true }
    ),
  getFont: (editor) => {
    let font = "Aral";

    for (const [node] of SlateEditor.nodes(editor)) {
      if (node.font) {
        font = node.font as string;
        break;
      }
    }

    return font;
  },
  onFontSizeChanged: (fontSize: number) =>
    Transforms.setNodes(
      editor,
      { fontSize: fontSize },
      { match: (n) => Text.isText(n), split: true }
    ),
  getFontSize: (editor) => {
    let fontSize = 14;

    for (const [node] of SlateEditor.nodes(editor)) {
      if (node.fontSize) {
        fontSize = node.fontSize as number;
        break;
      }
    }

    return fontSize;
  },
  onFormatUnderline: (setFormat: boolean) =>
    Transforms.setNodes(
      editor,
      { isUnderline: setFormat },
      { match: (n) => Text.isText(n), split: true }
    ),
  isUnderline: (editor) => {
    const [matches] = SlateEditor.nodes(editor, {
      match: (element) => {
        return !!element.isUnderline;
      },
    });

    return !!matches;
  },
  onFormatStrike: (setFormat: boolean) =>
    Transforms.setNodes(
      editor,
      { isStrike: setFormat },
      { match: (n) => Text.isText(n), split: true }
    ),
  isStrike: (editor) => {
    const [matches] = SlateEditor.nodes(editor, {
      match: (element) => {
        return !!element.isStrike;
      },
    });

    return !!matches;
  },
  onFormatItalic: (setFormat: boolean) =>
    Transforms.setNodes(
      editor,
      { isItalic: setFormat },
      { match: (n) => Text.isText(n), split: true }
    ),
  isItalic: (editor: EditorObject) => {
    const [matches] = SlateEditor.nodes(editor, {
      match: (element) => {
        return !!element.isItalic;
      },
    });

    return !!matches;
  },
  onFormatBold: (setFormat: boolean) =>
    Transforms.setNodes(
      editor,
      { isBold: setFormat },
      { match: (n) => Text.isText(n), split: true }
    ),
  isBold: (editor: EditorObject) => {
    const [match] = SlateEditor.nodes(editor, {
      match: (element) => {
        return !!element.isBold;
      },
    });

    return !!match;
  },
  onUndoFormat: () =>
    Transforms.setNodes(editor, defaultFormat, {
      match: (n) => Text.isText(n),
      split: true,
    }),
  onRedo: () => HistoryEditor.redo(editor),
  onUndo: () => HistoryEditor.undo(editor),
});
