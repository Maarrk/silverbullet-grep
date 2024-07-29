# SilverBullet Grep Plug

`silverbullet-grep` is a [Plug](https://silverbullet.md/Plugs) for [SilverBullet](https://silverbullet.md/) to search notes in your space using `git grep` command.

## Installation

If you run SilverBullet [using Docker](https://silverbullet.md/Install/Docker), Git is already included.
Otherwise install Git from your system's package manager, or following [Git documentation](https://git-scm.com/).

Open your `PLUGS` note in SilverBullet and add this plug to the list:

```yaml
- https://github.com/Maarrk/silverbullet-grep/releases/latest/download/grep.plug.js
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

The results are written to [[GREP RESULTS]] page, which is a regular [meta page](https://silverbullet.md/Meta%20Pages), but ignored in the search.

> **note** Line number links
> linking to specific location in page formatted as `[[Page@L12C3]]` will not work until [Support linking to and moving to line number in pages (#988)](https://github.com/silverbulletmd/silverbullet/pull/988) will be included in your SilverBullet version.

### Configuration

This plug can be configured in the SETTINGS, these are the default values and their usage:

```yaml
grep:
  # ignore case when search pattern is all lowercase
  smartCase: true
```

## Is it any good?

Yes.

## Roadmap

- Report multiple matches per line
- Exclude files matching the `spaceIgnore` setting

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
