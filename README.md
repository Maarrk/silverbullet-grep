# SilverBullet Grep Plug

`silverbullet-grep` is a [Plug](https://silverbullet.md/Plugs) for [SilverBullet](https://silverbullet.md/) to search notes in your space using `git grep` command.

## Installation

If you run SilverBullet [using Docker](https://silverbullet.md/Install/Docker), Git is already included.
Otherwise install Git from your system's package manager, or following [Git documentation](https://git-scm.com/).

Open your `PLUGS` note in SilverBullet and add this plug to the list:

```yaml
- ghr:Maarrk/silverbullet-grep
```

Then run the {[Plugs: Update]} command and off you go!

## Usage

The plug provides the following commands:

- {[Grep: Version]}
- {[Grep: Search Literal Text]}
- {[Grep: Search Regex Pattern]}
- {[Grep: Literal Text Inside Current Folder]}
- {[Grep: Regex Pattern Inside Current Folder]}

You may want to set [Shortcuts](https://silverbullet.md/Shortcuts) for them.

### Configuration

This plug can be configured with [Space Config](https://silverbullet.md/Space%20Config), these are the default values and their usage:

```yaml
grep:
  # ignore case when search pattern is all lowercase
  smartCase: true

  # by default shows results in a virtual page, like the built-in search
  saveResults: false

  # visually distinguish >>>matched part<<< in shown context
  surround:
    left: ">>>"
    right: "<<<"
  # or disable with
  # surround: false
```

Note that surround markers may appear in different parts of page text depending on your query, so it's advised not to use markdown syntax there.

## Is it any good?

Yes.

## Roadmap

- Exclude files matching the `spaceIgnore` setting
- Settings or commands for including meta and hidden pages
- Commands for searching pages by name
  - Optionally include filename matches in the regular search based on a setting

## Contributing

If you find bugs, report them on the [issue tracker on GitHub](https://github.com/Maarrk/silverbullet-grep/issues).
I doubt I will implement more features, Pull Requests are preferred.

### Building from source

To build this plug, make sure you have [SilverBullet installed](https://silverbullet.md/Install). Then, build the plug with:

```shell
deno task build
```

Or to watch for changes and rebuild automatically

```shell
deno task watch
```

Then, copy the resulting `.plug.js` file into your space's `_plug` folder. Or build and copy in one command:

```shell
deno task build && cp *.plug.js /my/space/_plug/
```

SilverBullet will automatically sync and load the new version of the plug (or speed up this process by running the {[Sync: Now]} command).

## License

MIT, following SilverBullet
