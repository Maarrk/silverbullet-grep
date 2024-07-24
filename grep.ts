import { editor, shell } from "$sb/syscalls.ts";

const VERSION = "1.0.0";

const resultPage = "GREP RESULT";

export async function showVersion() {
  try {
    const { stdout } = await shell.run("rg", ["--version"]);
    // Version info is in the first line, the rest are extensions
    const ripgrepVersion = stdout.split("\n")[0];
    await editor.flashNotification(`Grep Plug ${VERSION} ${ripgrepVersion}`);
  } catch {
    await editor.flashNotification(
      "Could not run 'rg' command, make sure ripgrep is in PATH",
      "error"
    );
  }
}

async function grep(
  pattern: string,
  literal: boolean = false,
  folder: string = "."
) {
  console.log(`grep("${pattern}", ${literal}, "${folder}")`);
  let output: string;
  try {
    const result = await shell.run("rg", [
      "--heading", // group by file
      "--byte-offset", // location in file
      "--type",
      "md", // we're only interested in markdown
      literal ? "--fixed-strings" : "--regexp",
      pattern,
      folder,
    ]);
    if (result) {
      output = result.stdout;
    } else {
      editor.flashNotification(`Pattern "${pattern}" produced no results`);
      return;
    }
  } catch (err) {
    console.error(err);
    await editor.flashNotification(
      "Error running 'rg' command, make sure ripgrep is in PATH",
      "error"
    );
    return;
  }

  if (!output) {
    editor.flashNotification(`Pattern "${pattern}" produced no results`);
    return;
  }

  // by default ripgrep separates files by an empty line
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
      const locationMatch = line.match(/^(\d)+:/);
      if (!locationMatch) continue;

      // HACK: regex kept losing the first digit
      const location = parseInt(line.split(":")[0]);
      const context = line.substring(location.toString().length + 1);
      matches.push({ location, context });
    }
    fileMatches.push({ page, matches });
  }

  fileMatches.sort((a, b) => {
    // descending sort by match count
    return -(a.matches.length - b.matches.length);
  });

  const text = `#meta\n\n# Search results for "${pattern}"${
    folder !== "." ? "\n**found inside folder:** " + folder + "\n" : ""
  }\n${fileMatches
    .map(
      (fm) =>
        `* [[${fm.page}]] (${fm.matches.length} ${
          fm.matches.length > 1 ? "matches" : "match"
        }):\n` +
        fm.matches
          .map((m) => `  * [[${fm.page}@${m.location}]]: ${m.context}`)
          .join("\n")
    )
    .join("\n")}
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
