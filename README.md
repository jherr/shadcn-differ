# ShadCN Project Differ

This CLI tool figures out the difference between the initial commit of a ShadCN project and the current state of the project and creates a new ShadCN JSON output file with the changes. This ShadCN JSON file can then be used with the ShadCN CLI to generate a new project or add to an existing project.

# Steps

1. Create a new NextJS app
2. Add ShadCN to the app
3. Create a new initial commit; `rm -fr .git && git init && git add . && git commit -m "Initial commit"`
4. Make your updates to the project
5. Run the CLI tool; `npx shadcn-differ`

The reason we are recreating the initial commit is so that the resulting JSON output is only the changes to the project after ShadCN was added, and not the entire project history.

You can then take the resulting JSON ouput and host it on a URL, then use that with the ShadCN CLI to generate a new project or add to an existing project.

```bash
npx shadcn@latest init http://your-json-output-url
```

You can use the `--src-dir` flag if you want to use the `src` directory in your project.

Or you can add the JSON output to an existing project:

```bash
npx shadcn@latest add http://your-json-output-url
```

# Why is this useful?

This allows library maintainers or SaaS services to create a one step installer for their library or service into an existing project, or to bootstrap a new project with the library or service.
