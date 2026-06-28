import "./style.css";
import { World } from "./ecs/world";
import { BuildSystem } from "./ecs/systems/build.system";
import { RenderSystem } from "./ecs/systems/render.system";

const world = new World();
world.setup();

await import("./ui");

world.addSystem(new BuildSystem());
world.addSystem(new RenderSystem());
