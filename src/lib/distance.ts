export type Graph = {
  [key: string]: { [key: string]: number };
};

export function CalculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getShortestPath(graph: Graph, start: string, end: string): { distance: number, path: string[] } {
  const distances: { [key: string]: number } = {};
  const visited: { [key: string]: boolean } = {};
  const parents: { [key: string]: string | null } = {};
  let path: string[] = [];
  let shortestPath: string[] = [];

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    parents[node] = null;
  });

  distances[start] = 0;

  while (Object.keys(visited).length !== Object.keys(graph).length) {
    const currentNode = Object.keys(distances).reduce((minNode, node) => (
      !visited[node] && (minNode === "" || distances[node]! < distances[minNode]!) ? node : (minNode || "")
    ), "");

    visited[currentNode] = true;

    Object.keys(graph[currentNode]!).forEach((neighbor) => {
      const weight = distances[currentNode]! + graph[currentNode]![neighbor]!;
      if (weight < distances[neighbor]!) {
        distances[neighbor] = weight;
        parents[neighbor] = currentNode;
      }
    });
  }

  while (end) {
    path.unshift(end);
    end = parents[end]!;
  }

  shortestPath = [...path];

  return { distance: distances[shortestPath[shortestPath.length - 1]!]!, path: shortestPath };
}

export function GetBestRoute(warehouse_id: string, pickup_point_id: string, graph: Graph): { route: string[], distance: number } {
  const { path, distance } = getShortestPath(graph, warehouse_id, pickup_point_id);
  return { route: path, distance };
}
