import { AttributeCardLayout } from '../../../../../../../../../../../../core/object-types/object-type.models';

export interface CardPosition extends AttributeCardLayout {
  id: string;
}

function overlaps(first: AttributeCardLayout, second: AttributeCardLayout): boolean {
  return (
    first.column < second.column + second.columns &&
    second.column < first.column + first.columns &&
    first.row < second.row + second.rows &&
    second.row < first.row + first.rows
  );
}

export function placeCard(
  positions: CardPosition[],
  id: string,
  layout: AttributeCardLayout,
): CardPosition[] {
  const moved = { ...layout, id };
  const placed = [moved];
  for (const original of positions.filter((item) => item.id !== id).sort((a, b) => a.row - b.row)) {
    const item = { ...original };
    let collisions = placed.filter((other) => overlaps(item, other));
    while (collisions.length) {
      item.row = Math.max(...collisions.map((other) => other.row + other.rows));
      collisions = placed.filter((other) => overlaps(item, other));
    }
    placed.push(item);
  }
  return placed;
}

export function firstFreeRow(positions: CardPosition[]): number {
  let row = 1;
  while (positions.some((item) => overlaps(item, { column: 1, row, columns: 6, rows: 2 }))) row++;
  return row;
}
