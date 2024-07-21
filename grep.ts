import { editor } from "$sb/syscalls.ts";

export async function helloWorld() {
  await editor.flashNotification("Hello world!");
}
