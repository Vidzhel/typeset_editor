import React, { useCallback, useEffect, useState } from "react";
import {
  Ribbon as RibbonBootstrap,
  RibbonGroup,
  RibbonGroupItem,
  RibbonButton,
} from "react-bootstrap-ribbon";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-ribbon/dist/react-bootstrap-ribbon.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import {
  MdContentPaste,
  MdContentCut,
  MdContentCopy,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
  MdUndo,
  MdRedo,
  MdFormatColorReset,
} from "react-icons/md";

const StyledRow = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const StyledTabs = styled(Tabs)`
  a[data-rb-event-key="home"] {
    margin-left: 66px;
  }
`;

const StyledDropdownButton = styled(DropdownButton)`
  position: absolute;
  left: 0;
  top: 2px;
`;

type RibbonType = {
  onPaste: () => void;
  onCut: () => void;
  onCopy: () => void;
  onFontChanged: (font: string) => void;
  onFontSizeChanged: (size: number) => void;
  onFormatBold: (setFormat: boolean) => void;
  onFormatItalic: (setFormat: boolean) => void;
  onFormatUnderline: (setFormat: boolean) => void;
  onFormatStrike: (setFormat: boolean) => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onAbout: () => void;
  onUndo: () => void;
  onRedo: () => void;
  selectedTextStyles: SelectedTextStyles;
  onUndoFormat: () => void;
};

export interface SelectedTextStyles {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  font: string;
  fontSize: number;
}

export const Ribbon: React.FC<RibbonType> = ({
  onPaste,
  onCopy,
  onCut,
  onFontChanged,
  onFontSizeChanged,
  onFormatBold,
  onFormatItalic,
  onFormatStrike,
  onFormatUnderline,
  onNewFile,
  onOpenFile,
  onSaveFile,
  onRedo,
  onUndo,
  selectedTextStyles,
  onAbout,
  onUndoFormat,
}) => {
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    const fontCheck = new Set(
      [
        // Windows 10
        "Arial",
        "Arial Black",
        "Bahnschrift",
        "Calibri",
        "Cambria",
        "Cambria Math",
        "Candara",
        "Comic Sans MS",
        "Consolas",
        "Constantia",
        "Corbel",
        "Courier New",
        "Ebrima",
        "Franklin Gothic Medium",
        "Gabriola",
        "Gadugi",
        "Georgia",
        "HoloLens MDL2 Assets",
        "Impact",
        "Ink Free",
        "Javanese Text",
        "Leelawadee UI",
        "Lucida Console",
        "Lucida Sans Unicode",
        "Malgun Gothic",
        "Marlett",
        "Microsoft Himalaya",
        "Microsoft JhengHei",
        "Microsoft New Tai Lue",
        "Microsoft PhagsPa",
        "Microsoft Sans Serif",
        "Microsoft Tai Le",
        "Microsoft YaHei",
        "Microsoft Yi Baiti",
        "MingLiU-ExtB",
        "Mongolian Baiti",
        "MS Gothic",
        "MV Boli",
        "Myanmar Text",
        "Nirmala UI",
        "Palatino Linotype",
        "Segoe MDL2 Assets",
        "Segoe Print",
        "Segoe Script",
        "Segoe UI",
        "Segoe UI Historic",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "SimSun",
        "Sitka",
        "Sylfaen",
        "Symbol",
        "Tahoma",
        "Times New Roman",
        "Trebuchet MS",
        "Verdana",
        "Webdings",
        "Wingdings",
        "Yu Gothic",
        // macOS
        "American Typewriter",
        "Andale Mono",
        "Arial",
        "Arial Black",
        "Arial Narrow",
        "Arial Rounded MT Bold",
        "Arial Unicode MS",
        "Avenir",
        "Avenir Next",
        "Avenir Next Condensed",
        "Baskerville",
        "Big Caslon",
        "Bodoni 72",
        "Bodoni 72 Oldstyle",
        "Bodoni 72 Smallcaps",
        "Bradley Hand",
        "Brush Script MT",
        "Chalkboard",
        "Chalkboard SE",
        "Chalkduster",
        "Charter",
        "Cochin",
        "Comic Sans MS",
        "Copperplate",
        "Courier",
        "Courier New",
        "Didot",
        "DIN Alternate",
        "DIN Condensed",
        "Futura",
        "Geneva",
        "Georgia",
        "Gill Sans",
        "Helvetica",
        "Helvetica Neue",
        "Herculanum",
        "Hoefler Text",
        "Impact",
        "Lucida Grande",
        "Luminari",
        "Marker Felt",
        "Menlo",
        "Microsoft Sans Serif",
        "Monaco",
        "Noteworthy",
        "Optima",
        "Palatino",
        "Papyrus",
        "Phosphate",
        "Rockwell",
        "Savoye LET",
        "SignPainter",
        "Skia",
        "Snell Roundhand",
        "Tahoma",
        "Times",
        "Times New Roman",
        "Trattatello",
        "Trebuchet MS",
        "Verdana",
        "Zapfino",
      ].sort()
    );

    (async () => {
      // @ts-ignore
      await document.fonts.ready;

      const fontAvailable = new Set();

      // @ts-ignore
      for (const font of fontCheck.values()) {
        // @ts-ignore
        if (document.fonts.check(`12px "${font}"`)) {
          fontAvailable.add(font);
        }
      }
      const fonts = Array.from(fontAvailable.values());

      // @ts-ignore
      setFonts(fonts);
      onFontChanged(fonts[0] as string);
      onFontSizeChanged(14);
    })();
  }, [onFontChanged, onFontSizeChanged]);

  return (
    <div className="container">
      <StyledDropdownButton id="dropdown-basic-button" title="File">
        <Dropdown.Item onClick={onNewFile}>New</Dropdown.Item>
        <Dropdown.Item onClick={onOpenFile}>Open</Dropdown.Item>
        <Dropdown.Item onClick={onSaveFile}>Save</Dropdown.Item>
        <Dropdown.Item onClick={onAbout}>About</Dropdown.Item>
      </StyledDropdownButton>

      <StyledTabs defaultActiveKey="home">
        <Tab eventKey="home" title="Home">
          <RibbonBootstrap breakpoint="lg" height="140px">
            <RibbonGroup title="Clipboard" colClass="col-3">
              <StyledRow>
                <RibbonGroupItem colClass="col-4">
                  <RibbonButton onClick={onPaste}>
                    <MdContentPaste size={30} />
                    <div>Paste</div>
                  </RibbonButton>
                </RibbonGroupItem>

                <RibbonGroupItem colClass="col-8">
                  <div className={"row"}>
                    <RibbonGroupItem colClass="col-12">
                      <RibbonButton onClick={onCut}>
                        <MdContentCut />
                        Cut
                      </RibbonButton>
                    </RibbonGroupItem>

                    <RibbonGroupItem colClass="col-12">
                      <RibbonButton onClick={onCopy}>
                        <MdContentCopy />
                        Copy
                      </RibbonButton>
                    </RibbonGroupItem>
                  </div>
                </RibbonGroupItem>
              </StyledRow>
            </RibbonGroup>

            <RibbonGroup title="Fonts" colClass="col-3">
              <div className={"row"}>
                <RibbonGroupItem colClass="col-12">
                  <InputGroup className="mb-3">
                    <Form.Control
                      as="select"
                      value={selectedTextStyles.font}
                      onChange={(e) => onFontChanged(e.target.value)}
                    >
                      {fonts.map((font, index) => (
                        <option key={index}>{font}</option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      type="text"
                      placeholder="Size"
                      value={selectedTextStyles.fontSize}
                      onChange={(e) => onFontSizeChanged(+e.target.value)}
                    />
                  </InputGroup>
                </RibbonGroupItem>

                <RibbonGroupItem colClass="col-12">
                  <ButtonGroup className="mr-2" aria-label="First group">
                    <ToggleButton
                      type="checkbox"
                      variant="secondary"
                      checked={selectedTextStyles.isBold}
                      value="1"
                      onChange={(e) => {
                        onFormatBold(!selectedTextStyles.isBold);
                      }}
                    >
                      <MdFormatBold />
                    </ToggleButton>

                    <ToggleButton
                      type="checkbox"
                      variant="secondary"
                      checked={selectedTextStyles.isItalic}
                      value="1"
                      onChange={(e) => {
                        onFormatItalic(!selectedTextStyles.isItalic);
                      }}
                    >
                      <MdFormatItalic />
                    </ToggleButton>

                    <ToggleButton
                      type="checkbox"
                      variant="secondary"
                      checked={selectedTextStyles.isUnderline}
                      value="1"
                      onChange={(e) => {
                        onFormatUnderline(!selectedTextStyles.isUnderline);
                      }}
                    >
                      <MdFormatUnderlined />
                    </ToggleButton>

                    <ToggleButton
                      type="checkbox"
                      variant="secondary"
                      checked={selectedTextStyles.isStrike}
                      value="1"
                      onChange={(e) => {
                        onFormatStrike(!selectedTextStyles.isStrike);
                      }}
                    >
                      <MdStrikethroughS />
                    </ToggleButton>
                  </ButtonGroup>

                  <Button
                    style={{
                      marginBottom: "0.5em",
                    }}
                    variant="secondary"
                    onClick={(e) => {
                      onUndoFormat();
                    }}
                  >
                    <MdFormatColorReset />
                  </Button>
                </RibbonGroupItem>
              </div>
            </RibbonGroup>

            <RibbonGroup title="Actions" colClass="col-1">
              <RibbonGroupItem colClass="col-12">
                <div className={"row"}>
                  <RibbonGroupItem colClass="col-12">
                    <RibbonButton onClick={onUndo}>
                      <MdUndo />
                      Undo
                    </RibbonButton>
                  </RibbonGroupItem>

                  <RibbonGroupItem colClass="col-12">
                    <RibbonButton onClick={onRedo}>
                      <MdRedo />
                      Redo
                    </RibbonButton>
                  </RibbonGroupItem>
                </div>
              </RibbonGroupItem>
            </RibbonGroup>
          </RibbonBootstrap>
        </Tab>
        <Tab eventKey="insert" title="Insert">
          <RibbonBootstrap breakpoint="lg" height="8rem" class={"something"}>
            <RibbonGroup title="Clipboard" colClass="col-3">
              <RibbonGroupItem
                colClass="col-4"
                onClick={() => alert("Hello from Ribbon button!")}
              >
                <RibbonButton>
                  ✏️
                  <div>Edit</div>
                </RibbonButton>
              </RibbonGroupItem>
            </RibbonGroup>
          </RibbonBootstrap>
        </Tab>
      </StyledTabs>
    </div>
  );
};
