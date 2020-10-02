import React, { useCallback, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import styled from "styled-components";

type ModalsProps = {
  onModalClose: () => void;
};

const ModalContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  padding-top: 20%;
`;

export const SaveFileModal: React.FC<
  ModalsProps & {
    onSaveFile: (name: string, override: boolean) => void;
    projects: string[];
  }
> = ({ projects, onModalClose, onSaveFile }) => {
  const [projectNameToSave, setProjectNameToSave] = useState("");

  const [showOverrideProjectWarning, setShowOverrideProjectWarning] = useState(
    false
  );
  const [
    showEmptyProjectNameWarning,
    setShowEmptyProjectNameWarning,
  ] = useState(false);

  const onOpenClicked = useCallback(() => {
    if (projectNameToSave === "") {
      setShowEmptyProjectNameWarning(true);
      return;
    }

    let projectExists = false;

    for (const project of projects) {
      if (project === projectNameToSave) {
        projectExists = true;
        break;
      }
    }

    if (projectExists && !showOverrideProjectWarning) {
      setShowOverrideProjectWarning(true);
      return;
    }

    onSaveFile(projectNameToSave, projectExists);
  }, [onSaveFile, projectNameToSave, projects, showOverrideProjectWarning]);

  return (
    <ModalContainer>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Save file</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {projects.length === 0 ? (
            "You haven't created any projects"
          ) : (
            <ListGroup>
              {projects.map((project) => (
                <ListGroup.Item
                  key={project}
                  active={project === projectNameToSave}
                  onClick={() => setProjectNameToSave(project)}
                >
                  {project}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <br />
          <br />

          <Form.Control
            type="text"
            placeholder="Project name"
            value={projectNameToSave}
            onChange={(e) => {
              setShowOverrideProjectWarning(false);
              setShowEmptyProjectNameWarning(false);
              setProjectNameToSave(e.target.value);
            }}
          />

          {showOverrideProjectWarning ? (
            <>
              <br />
              <Alert variant={"warning"}>
                An project with the same name already exists, override?
              </Alert>
            </>
          ) : null}

          {showEmptyProjectNameWarning ? (
            <>
              <br />
              <Alert variant={"warning"}>No project name was specified</Alert>
            </>
          ) : null}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onOpenClicked}>
            Save
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </ModalContainer>
  );
};

export const OpenFileModal: React.FC<
  ModalsProps & { onOpenFile: (name: string) => void; projects: string[] }
> = ({ onOpenFile, onModalClose, projects }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [
    showNoProjectSelectedWarning,
    setShowNoProjectSelectedWarning,
  ] = useState<boolean>(false);

  const onOpenClicked = useCallback(() => {
    if (selectedProject) {
      onOpenFile(selectedProject);
    } else {
      setShowNoProjectSelectedWarning(true);
    }
  }, [onOpenFile, selectedProject]);

  return (
    <ModalContainer>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Open project</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {projects.length === 0 ? (
            "You haven't created any projects"
          ) : (
            <ListGroup>
              {projects.map((project) => (
                <ListGroup.Item
                  key={project}
                  active={selectedProject === project}
                  onClick={() => setSelectedProject(project)}
                >
                  {project}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {showNoProjectSelectedWarning ? (
            <>
              <br />
              <Alert variant={"warning"}>You haven't chosen any project</Alert>
            </>
          ) : null}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onOpenClicked}>
            Open
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </ModalContainer>
  );
};

export const About: React.FC<ModalsProps> = ({ onModalClose }) => {
  return (
    <ModalContainer>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>About</Modal.Title>
        </Modal.Header>

        <Modal.Body>Typeset text editor</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </ModalContainer>
  );
};

export const NewFileModal: React.FC<
  ModalsProps & { onNewFile: () => void }
> = ({ onModalClose, onNewFile }) => {
  return (
    <ModalContainer>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>New file</Modal.Title>
        </Modal.Header>

        <Modal.Body>Unsaved changes will be lost, are you sure?</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onNewFile}>
            Open
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </ModalContainer>
  );
};
