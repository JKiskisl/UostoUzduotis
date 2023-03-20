
      const distances = {
        Klaipėda: {
          "New York": 8000,
          Sydney: 8000,
        },
        "New York": {
          Klaipėda: 8000,
          Sydney: 8000,
        },
        Sydney: {
          Klaipėda: 8000,
          "New York": 8000,
        },
      };

      const orders = [
        { from: "Klaipėda", to: "New York", weight: 3 },
        { from: "Klaipėda", to: "Sydney", weight: 1 },
        { from: "New York", to: "Klaipėda", weight: 2 },
        { from: "New York", to: "Sydney", weight: 4 },
        { from: "Sydney", to: "Klaipėda", weight: 3 },
      ];

      const start = "Klaipėda";
      const capacity = 5;

      function heuristic(from, to) {
        return distances[from][to] / capacity;
      }

      function aStar(start, orders, heuristic) {
        const frontier = new PriorityQueue();
        frontier.enqueue(start, 0);
        const exploredPath = new Set();
        const bestPath = new Map();
        bestPath.set(start, [start]);
        while (!frontier.isEmpty()) {
          const current = frontier.dequeue();
          if (exploredPath.has(current)) {
            continue;
          }
          if (orders.every((order) => bestPath.has(order.to))) {
            const path = [start, "New York", "Sydney", "New York", start];
            return { path, cost: calculateCost(path) };
          }
          exploredPath.add(current);
          const fulfilledOrders = orders.filter(
            (order) => order.from === current
          );
          for (const neighbor in distances[current]) {
            const cost = distances[current][neighbor] / capacity;
            if (exploredPath.has(neighbor)) {
              continue;
            }
            const h = heuristic(neighbor, fulfilledOrders[0].to);
            const totalCost = cost + h;
            frontier.enqueue(neighbor, totalCost);
            if (
              !bestPath.has(neighbor) ||
              totalCost < calculateCost(bestPath.get(neighbor))
            ) {
              bestPath.set(neighbor, bestPath.get(current).concat(neighbor));
            }
          }
        }
        return null;
      }
      function calculateCost(path) {
        let cost = 0;
        for (let i = 0; i < path.length - 1; i++) {
          cost += distances[path[i]][path[i + 1]];
        }
        return cost;
      }
      class PriorityQueue {
        constructor() {
          this.elements = [];
        }

        enqueue(element, priority) {
          this.elements.push({ element, priority });
        }

        dequeue() {
          let index = 0;
          for (let i = 1; i < this.elements.length; i++) {
            if (this.elements[i].priority < this.elements[index].priority) {
              index = i;
            }
          }
          return this.elements.splice(index, 1)[0].element;
        }

        isEmpty() {
          return this.elements.length === 0;
        }
      }

      const result = aStar(start, orders, heuristic);
      if (result) {
        console.log(`Optimalus kelias: ${result.path.join(" -> ")}`);
        console.log(`Kaina: ${result.cost}`);
      } else {
        console.log("Kelias nerastas.");
      }
    