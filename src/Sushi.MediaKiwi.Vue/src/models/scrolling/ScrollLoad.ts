export type ScrollLoad = {
  side: "start" | "end" | "both";
  done: (status: "loading" | "error" | "empty" | "ok") => void;
};
