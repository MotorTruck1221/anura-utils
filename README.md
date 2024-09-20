<div align="center">
         
<img src="https://socialify.git.ci/motortruck1221/anura-utils/image?description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Dark" alt="ruby" width="640" height="320" />

<img alt="repo size" src="https://img.shields.io/github/repo-size/motortruck1221/create-anura-app?style=for-the-badge"></img>
<img alt="commit a week" src="https://img.shields.io/github/commit-activity/w/motortruck1221/create-anura-app?style=for-the-badge"></img>

</div>

<div align="center">
    - A monorepo for anura's types & create-anura-app
    <br>
    - Create anura app usage: <a href="./create-anura-app">Here</a>
    <br>
    - Anura types package: <a href="./anura-types">Here</a>
</div>






### For devs:

- When developing for this you'll need the same deps as [AnuraOS](https://github.com/mercuryworkshop/anuraos?tab=readme-ov-file#dependencies) as this repo pulls things out of Anura.
- You'll also need [PNPM](https://pnpm.io/) as that's the only package manager allowed in this repo
- Your probably wanting Create anura app (see above), feel free to contribute if you find something wrong or want something added : )

### Running the dev server:

1. Make sure you have those dependencies installed.
2. Run `make` as this will build Anura & Rip the files for testing
3. Run `pnpm run build` build the create anura app files.
4. `node anura-utils/dist/index.js` is your best friend.
5. `test_project` is already gitignored, i'd recommend using that for the name when testing.


###### Everything in this repo is licensed under the [MIT](./LICENSE) license unless otherwise specified.
