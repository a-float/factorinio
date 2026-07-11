export class Serializable {
  serialize() {
    const res: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this)) {
      if (typeof value === "function") continue;
      res[key] = value;
    }
    return JSON.stringify(res);
  }

  hydrate(state: string) {
    const parsed = JSON.parse(state);
    for (const [key, value] of Object.entries(parsed)) {
      (this as any)[key] = value;
    }
  }
}
