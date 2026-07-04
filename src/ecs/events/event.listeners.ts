const DRAG_THRESHOLD = 5;

export function registerListeners() {
  const queue = window.world.getResource("eventQueue").userEvents;
  let mouseDownPos: { x: number; y: number } | null = null;

  window.addEventListener("click", (event) => {
    if (wasDrag(mouseDownPos, { x: event.clientX, y: event.clientY })) {
      mouseDownPos = null;
      return;
    }

    queue.push({
      type: "click",
      payload: {
        button: event.button,
        x: event.clientX,
        y: event.clientY,
      },
    });
  });

  window.addEventListener("mousemove", (event) => {
    queue.push({
      type: "mousemove",
      payload: { x: event.clientX, y: event.clientY },
    });
  });

  window.addEventListener("keydown", (event) => {
    queue.push({
      type: "keypress",
      payload: { key: event.key },
    });
  });

  window.addEventListener("mousedown", (e) => {
    mouseDownPos = { x: e.clientX, y: e.clientY };
  });
}

function wasDrag(
  mouseDownPos: { x: number; y: number } | null,
  mouseUpPos: { x: number; y: number },
) {
  if (!mouseDownPos) return false;
  return (
    Math.abs(mouseDownPos.x - mouseUpPos.x) > DRAG_THRESHOLD ||
    Math.abs(mouseDownPos.y - mouseUpPos.y) > DRAG_THRESHOLD
  );
}
