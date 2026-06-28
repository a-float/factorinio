export function registerListeners() {
  const queue = window.world.getResource("eventQueue").userEvents;

  window.addEventListener("click", (event) => {
    queue.push({
      type: "click",
      payload: {
        button: event.button,
        x: event.clientX,
        y: event.clientY,
      },
    });
  });

  window.addEventListener("keydown", (event) => {
    queue.push({
      type: "keydown",
      payload: { key: event.key },
    });
  });
}
