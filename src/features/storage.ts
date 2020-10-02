const TABLE_NAME = "projects";
export type Project = {
  name: string;
  content: string;
};

export const initStorage = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const dbRequest = window.indexedDB.open("storage", 1);

    dbRequest.onerror = () => {
      console.log("Can't open db");
      reject();
    };

    dbRequest.onsuccess = () => {
      console.log("Successfully opened db");
      resolve(dbRequest.result);
    };

    dbRequest.onupgradeneeded = (e) => {
      const db = dbRequest.result;

      const objectStore = db.createObjectStore(TABLE_NAME, {
        keyPath: "name",
      });

      objectStore.createIndex("content", "content", { unique: false });
    };
  });
};

export const saveProject = (
  db: IDBDatabase,
  project: Project,
  override: boolean
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TABLE_NAME, "readwrite");
    const objectStore = transaction.objectStore(TABLE_NAME);

    if (override) {
      const deleteRequest = objectStore.delete(project.name);
      deleteRequest.onsuccess = () => {
        const request = objectStore.add(project);

        transaction.oncomplete = () => {
          resolve();
        };

        request.onerror = () => {
          reject("Error occurred during saving");
        };
      };

      deleteRequest.onerror = () => {
        reject("Error occurred during deletion");
      };
    } else {
      const request = objectStore.add(project);

      transaction.oncomplete = () => {
        resolve();
      };

      request.onerror = () => {
        reject("Error occurred during saving");
      };
    }
  });
};

export const openProject = (
  db: IDBDatabase,
  name: string
): Promise<Project> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TABLE_NAME, "readwrite");
    const objectStore = transaction.objectStore(TABLE_NAME);

    const request = objectStore.get(name);

    request.onsuccess = () => {
      // @ts-ignore
      resolve(request.result);
    };

    request.onerror = () => {
      reject();
    };
  });
};

export const getProjectNames = (db: IDBDatabase): Promise<string[]> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(TABLE_NAME, "readonly");
    const objectStore = transaction.objectStore(TABLE_NAME);
    const names: string[] = [];

    objectStore.openCursor().onsuccess = (e) => {
      // @ts-ignore
      const cursor: IDBCursor = e.target.result;

      if (cursor) {
        // @ts-ignore
        names.push(cursor.value.name as string);
        cursor.continue();
      }
    };

    resolve(names);
  });
};
