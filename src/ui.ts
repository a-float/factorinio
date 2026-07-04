import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import type { Tool } from "./ecs/resources/player-state.resource";

@customElement("ui-root")
export class RootUI extends LitElement {
  playerState = window.world.getResource("playerState");

  static styles = css`
    :host {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
    }

    div {
      display: flex;
      gap: 0.5rem;
    }

    button {
      font-size: 1.5rem;
      color: white;
      aspect-ratio: 1;
      background-color: #232323;
      border: 1px solid #555;

      &.active {
        border: 1px solid cyan;
      }

      &:hover {
        background-color: #121212;
      }
    }
  `;

  private selectTool = (tool: Tool) => {
    console.log("You selected", tool);
    this.playerState.setActiveTool(tool);
    // TODO needs to be triggered every time the needed world state changes
    // consider using an event listener/signal/reactive values or something
    // good enough for now
    this.requestUpdate();
  };

  // TODO who handles keypressed: ui or event resource?
  private handleKeydown = (event: KeyboardEvent) => {
    let num = Number(event.key) - 1;
    if (num >= 0 && num < this.playerState.tools.length) {
      this.selectTool(this.playerState.tools[num]);
    }

    if (event.key === "r") {
      this.playerState.rotate();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.handleKeydown);
  }

  render() {
    return html`
      <div>
        ${this.playerState.tools.map(
          (tool) =>
            html` <button
              class=${classMap({
                active: tool === this.playerState.getActiveTool(),
              })}
              @click=${(event: Event) => {
                event.stopPropagation();
                this.selectTool(tool);
              }}
            >
              ${tool.icon}
            </button>`,
        )}
      </div>
    `;
  }
}
