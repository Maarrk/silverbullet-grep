# SilverBullet Grep Plug

`silverbullet-grep` is a [Plug](https://silverbullet.md/Plugs) for [SilverBullet](https://silverbullet.md/) to search notes in your space using [ripgrep](https://github.com/BurntSushi/ripgrep).

## Installation

**Install ripgrep for your system**, following [ripgrep documentation](https://github.com/BurntSushi/ripgrep?tab=readme-ov-file#installation)

Open your `PLUGS` note in SilverBullet and add this plug to the list:

```yaml
- https://github.com/Maarrk/silverbullet-grep/releases/download/v1.0.0/silverbullet-grep.plug.js
```

Then run the {[Plugs: Update]} command and off you go!

### How do I install ripgrep in the `zefhemel/silverbullet` Docker image?

The package `ripgrep` wasn't found by `apt` and there's no `curl` or `wget`.
This is how I did it, still thinking of a nicer way

```bash
docker ps
docker exec -it <container-id> /bin/bash
deno
```

Then ran the following script:

```js
const res = await fetch("https://github.com/BurntSushi/ripgrep/releases/download/14.1.0/ripgrep_14.1.0-1_amd64.deb");
const file = await Deno.open("./ripgrep.deb", { create: true, write: true });
await res.body.pipeTo(file.writable);
file.close();
```

I got an error on `file.close()` but it still worked for me.
Then with the file finally in the container, I ran:

```bash
dpkg -i ./ripgrep.deb
```

## Usage

The plug provides the following commands:

- {[Grep: Version]}
- {[Grep: Search Literal Text]}
- {[Grep: Search Regex Pattern]}
- {[Grep: Literal Text Inside Current Folder]}
- {[Grep: Regex Pattern Inside Current Folder]}

You may want to set [Shortcuts](https://silverbullet.md/Shortcuts) for them.

The results are written to [[GREP RESULTS]] page, which is a regular [meta page](https://silverbullet.md/Meta%20Pages), but ignored in the search.

## Is it any good?

Yes.

## Why ripgrep?

- Handles UTF-8
- Gives the same output on all platforms
- Better defaults (recursive search, parses `.gitignore`)
- Flags that made it easy to create this output
- Should be available on the same platforms as SilverBullet, since it's written in Rust like [Deno](https://deno.com)

## Roadmap

- Setting for smart case

## Contributing

If you manage to find bugs, report them on the [issue tracker on GitHub](https://github.com/Maarrk/silverbullet-grep/issues).
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
