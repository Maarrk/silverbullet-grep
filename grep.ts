import { editor, shell, system } from "$sb/syscalls.ts";

const VERSION = "2.1.0";

const resultPage = "GREP RESULT";

export async function showVersion() {
  try {
    const { stdout } = await shell.run("git", ["--version"]);
    // Version info is in the first line
    const gitVersion = stdout.split("\n")[0];
    await editor.flashNotification(`Grep Plug ${VERSION} ${gitVersion}`);
  } catch {
    await editor.flashNotification(
      "Could not run 'git' command, make sure Git is in PATH",
      "error",
    );
  }
}

async function grep(
  pattern: string,
  literal: boolean = false,
  folder: string = ".",
) {
  console.log(`grep("${pattern}", ${literal}, "${folder}")`);

  let smartCase = true;
  const config = await system.getSpaceConfig("grep", {});
  if (config && config.smartCase === false) smartCase = false;

  const caseSensitive = smartCase ? pattern.toLowerCase() !== pattern : true;

  let output: string;
  try {
    const result = await shell.run("git", [
      "-c", // modify config to this command
      "core.quotePath=false", // handle non-ASCII paths
      "grep",
      "--heading", // group by file
      "--break", // separate files with empty line
      "--line-number",
      "--column",
      "--no-color", // can't use terminal color here anyway
      "--no-index", // search like normal grep, no git-specific features
      ...(caseSensitive ? [] : ["--ignore-case"]),
      literal ? "--fixed-strings" : "--extended-regexp",
      pattern,
      "--",
      folder + (folder.endsWith("/") ? "" : "/") + "*.md",
    ]);
    if (result) {
      output = result.stdout;
    } else {
      editor.flashNotification(
        `${literal ? "Text" : "Pattern"} "${pattern}" produced no results`,
      );
      return;
    }
  } catch (err) {
    console.error(err);
    await editor.flashNotification(
      "Error running 'git' command, make sure Git is in PATH",
      "error",
    );
    return;
  }

  if (!output) {
    editor.flashNotification(
      `${literal ? "Text" : "Pattern"} "${pattern}" produced no results`,
    );
    return;
  }

  // --break separates files by an empty line
  const fileOutputs = output.split("\n\n");

  const fileMatches = [];
  for (const fileOutput of fileOutputs) {
    const lines = fileOutput.split("\n");

    // ensure it's a markdown file and normalize to page name
    if (!lines[0].endsWith(".md")) continue;
    const page = normalizePath(lines[0].slice(0, -3));

    // don't consider hits in results
    if (page === resultPage) continue;

    const matches = [];
    for (const line of lines.slice(1)) {
      const locationMatch = line.match(/^(\d)+:(\d)+:/);
      if (!locationMatch) continue;

      // HACK: regex kept losing the first digit
      const lineNum = parseInt(line.split(":")[0]);
      const columnNum = parseInt(line.split(":")[1]);
      const context = line.substring(
        lineNum.toString().length + columnNum.toString().length + 2,
      );
      matches.push({ lineNum, columnNum, context });
    }
    fileMatches.push({ page, matches });
  }

  fileMatches.sort((a, b) => {
    // descending sort by match count
    return -(a.matches.length - b.matches.length);
  });

  const text = `#meta\n\nSearch results for ${
    literal ? "text" : "pattern"
  } **\`${pattern}\`**${
    folder !== "." ? "\n**found inside folder:** " + folder + "\n" : ""
  }\n${
    fileMatches
      .map(
        (fm) =>
          `\n## [[${fm.page}]] (${fm.matches.length} ${
            fm.matches.length > 1 ? "matches" : "match"
          })\n` +
          fm.matches
            .map(
              (m) =>
                `* [[${fm.page}@L${m.lineNum}C${m.columnNum}|L${m.lineNum}C${m.columnNum}]]: ${m.context}`,
            )
            .join("\n"),
      )
      .join("\n")
  }
    `;

  await editor.navigate({ page: resultPage });
  const textLength = (await editor.getText()).length;
  await editor.replaceRange(0, textLength, text);
}

export async function searchText() {
  const pattern = await editor.prompt("Literal text:", "");
  if (!pattern) {
    return;
  }
  await grep(pattern, true);
}

export async function searchRegex() {
  const pattern = await editor.prompt("Regular expression pattern:", "");
  if (!pattern) {
    return;
  }
  await grep(pattern, false);
}

export async function searchRegexInFolder() {
  const pageName = await editor.getCurrentPage();
  // Get the folder it's nested in, keeping the trailing /
  const folderPath = pageName.slice(0, pageName.lastIndexOf("/") + 1);
  const pattern = await editor.prompt("Regular expression pattern:", "");
  if (!pattern) {
    return;
  }
  await grep(pattern, false, folderPath !== "" ? folderPath : ".");
}

export async function searchTextInFolder() {
  const pageName = await editor.getCurrentPage();
  // Get the folder it's nested in, keeping the trailing /
  const folderPath = pageName.slice(0, pageName.lastIndexOf("/") + 1);
  const pattern = await editor.prompt("Literal text:", "");
  if (!pattern) {
    return;
  }
  await grep(pattern, false, folderPath !== "" ? folderPath : ".");
}

function normalizePath(path: string): string {
  const forward = path.replaceAll("\\", "/");
  if (forward.startsWith("./")) return forward.substring(2);
  else return forward;
}
