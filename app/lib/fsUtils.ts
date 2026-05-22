import type { FileNode } from "../components/types";

export const initialFS: FileNode = {
  id: "root",
  name: "root",
  type: "folder",
  children: [
    {
      id: "f1",
      name: "Projects",
      type: "folder",
      children: [
        {
          id: "f1-1",
          name: "TraceGuard",
          type: "folder",
          children: [
            {
              id: "f1-1-1",
              name: "README.md",
              type: "file",
              content:
                "# TraceGuard\n\nIIoT/SCADA SaaS platform built with Go, NATS, and PostgreSQL.\n\n## Architecture\n- Control plane: REST API (Go + pgx/sqlc)\n- Compute engine: DAG-based tag evaluation\n- Time-series: IoTDB\n- Pub/Sub: NATS JetStream",
            },
            {
              id: "f1-1-2",
              name: "notes.txt",
              type: "file",
              content:
                "TODO:\n- Implement report-by-exception publishing\n- Add GOOD/UNCERTAIN/BAD quality lifecycle\n- JWT auth with ES256 rotation",
            },
          ],
        },
        {
          id: "f1-2",
          name: "Arawi",
          type: "folder",
          children: [
            {
              id: "f1-2-1",
              name: "stack.txt",
              type: "file",
              content:
                "Frontend: Next.js\nBackend: NestJS\nORM: Prisma / PostgreSQL\nStorage: MinIO\nAuth: OTP-based",
            },
          ],
        },
      ],
    },
    {
      id: "f2",
      name: "Documents",
      type: "folder",
      children: [
        {
          id: "f2-1",
          name: "todo.txt",
          type: "file",
          content:
            "[ ] Submit assignment\n[ ] Review PR\n[ ] Update portfolio\n[x] Build file explorer",
        },
        {
          id: "f2-2",
          name: "ideas.txt",
          type: "file",
          content:
            "Ideas for next side project:\n- CLI tool for log aggregation\n- Webhook relay service\n- In-browser SQLite explorer",
        },
      ],
    },
    {
      id: "f3",
      name: "welcome.txt",
      type: "file",
      content:
        "Welcome to Webb Explorer.\n\nCreate folders and files, rename them, edit text content — all in your browser.\n\nData persists in localStorage.",
    },
  ],
};

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function findNode(tree: FileNode, id: string): FileNode | null {
  if (tree.id === id) return tree;
  if (tree.children) {
    for (const c of tree.children) {
      const found = findNode(c, id);
      if (found) return found;
    }
  }
  return null;
}

/** Returns the parent node, or null if the node is a root-level child or not found. */
export function findParent(tree: FileNode, id: string): FileNode | null {
  if (!tree.children) return null;
  for (const child of tree.children) {
    if (child.id === id) return tree;
    const found = findParent(child, id);
    if (found) return found;
  }
  return null;
}

export function cloneTree(node: FileNode): FileNode {
  return JSON.parse(JSON.stringify(node));
}

export function loadFS(): FileNode {
  try {
    const s = localStorage.getItem("webb_fs");
    return s ? JSON.parse(s) : cloneTree(initialFS);
  } catch {
    return cloneTree(initialFS);
  }
}

export function saveFS(fs: FileNode): void {
  localStorage.setItem("webb_fs", JSON.stringify(fs));
}
