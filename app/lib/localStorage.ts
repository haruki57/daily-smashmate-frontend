type VisitedPlayer = { playerName: string; playerId: number };

const KEY = "visitedPlayers"

export function addVisitedPlayer(visitedPlayer: VisitedPlayer) {
  const { playerId } = visitedPlayer;
  const visited = getVisitedPlayers().slice(-30);
  const existing = visited.find((v) => v.playerId === playerId);
  if (existing) {
    const filtered = visited.filter((v) => v.playerId !== playerId);
    filtered.push(visitedPlayer);
    localStorage.setItem(KEY, JSON.stringify(filtered));
  } else {
    visited.push(visitedPlayer);
    localStorage.setItem(KEY, JSON.stringify(visited));
  }
}

export function getVisitedPlayers(): VisitedPlayer[] {
  const item = JSON.parse(localStorage.getItem(KEY) || "[]");
  if (Array.isArray(item)) {
    return item;
  } else {
    return [];
  }
}
