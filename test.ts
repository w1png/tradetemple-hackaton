type Graph = {
  [key: string]: { [key: string]: number };
};

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function buildGraph(warehouses: Warehouse[], cities: City[]): Graph {
  const graph: Graph = {};
  [...warehouses, ...cities].forEach((node) => {
    graph[node.id] = {};
    [...warehouses, ...cities].forEach((neighbor) => {
      if (node.id !== neighbor.id) {
        graph[node.id][neighbor.id] = calculateDistance(node.coordX, node.coordY, neighbor.coordX, neighbor.coordY);
      }
    });
  });
  return graph;
}

function getShortestPath(graph: Graph, start: string, end: string): { distance: number, path: CityId[] } {
  const distances: { [key: string]: number } = {};
  const visited: { [key: string]: boolean } = {};
  const parents: { [key: string]: string | null } = {};
  let path = [];
  let shortestPath = [];

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    parents[node] = null;
  });

  distances[start] = 0;

  while (Object.keys(visited).length !== Object.keys(graph).length) {
    const currentNode = Object.keys(distances).reduce((minNode, node) => (
      !visited[node] && (minNode === null || distances[node] < distances[minNode]) ? node : minNode
    ), null);

    visited[currentNode] = true;

    Object.keys(graph[currentNode]).forEach((neighbor) => {
      const weight = distances[currentNode] + graph[currentNode][neighbor];
      if (weight < distances[neighbor]) {
        distances[neighbor] = weight;
        parents[neighbor] = currentNode;
      }
    });
  }

  while (end) {
    path.unshift(end);
    end = parents[end];
  }

  shortestPath = [...path];

  return { distance: distances[shortestPath[shortestPath.length - 1]], path: shortestPath };
}

function GetBestRoute(warehouse_id: string, destination_city_id: string, warehouses: Warehouse[], cities: City[]): { route: CityId[], distance: number } {
  const graph = buildGraph(warehouses, cities);
  const { path, distance } = getShortestPath(graph, warehouse_id, destination_city_id);
  return { route: path, distance };
}
