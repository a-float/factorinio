import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("ui-root")
export class RootUI extends LitElement {
  tools = [
    { name: "hammer", emoji: "🔨" },
    { name: "wrench", emoji: "🔧" },
    { name: "screwdriver", emoji: "🪛" },
  ];

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
      aspect-ratio: 1;
      background-color: #232323;
      border: 1px solid #555;

      &:hover {
        background-color: #121212;
      }
    }
  `;

  render() {
    return html`
      <div>
        ${this.tools.map(
          (tool) =>
            html` <button
              @click=${() => {
                console.log(`You selected ${tool.name}.`);
              }}
            >
              ${tool.emoji}
            </button>`,
        )}
      </div>
    `;
  }
}
