import { editor, shell } from "$sb/syscalls.ts";
import { readSetting } from "$sb/lib/settings_page.ts";

const VERSION = "0.1.0";

export async function showVersion() {
  try {
    const { stdout } = await shell.run("rg", ["--version"]);
    const ripgrepVersion = stdout.split("\n")[0];
    await editor.flashNotification(`Grep Plug ${VERSION}\n${ripgrepVersion}`);
  } catch {
    await editor.flashNotification(
      "Could not run 'rg' command, make sure ripgrep is in PATH",
      "error"
    );
  }
}
