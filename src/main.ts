import "./style.css";
import { World } from "./ecs/world";
import { BuildSystem } from "./ecs/systems/build.system";
import { RenderSystem } from "./ecs/systems/render.system";
import { CursorSystem } from "./ecs/systems/cursor.system";
import { GridDisplaySystem } from "./ecs/systems/grid-display.system";
import { NetworkSystem } from "./ecs/systems/network.system";
import { BeltSystem } from "./ecs/systems/belt.system";
import { EventSystem } from "./ecs/systems/event.system";

const world = new World();
world.setup();

await import("./ui");

world.addSystem(new BuildSystem());
world.addSystem(new EventSystem()); // TODO merge into cursor?
world.addSystem(new CursorSystem());
world.addSystem(new NetworkSystem());
world.addSystem(new BeltSystem());
world.addSystem(new GridDisplaySystem());
world.addSystem(new RenderSystem());
