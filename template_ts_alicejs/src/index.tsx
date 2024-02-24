function App(this: { picker: any; files?: string[] }) {
  this.files ??= [];
  return (
    <div>
      <h1>Anura TypeScript Example</h1>
      <button
        on:click={() => {
          this.picker.selectFile().then((files: string | string[]) => {
            this.files = Array.isArray(files) ? files : [files];
          });
        }}
      >
        {use(
          this.files,
          (files: string[]) =>
            "Files: " +
            files.length +
            (files.length > 0 ? ` (${files.join(", ")})` : "")
        )}
      </button>
    </div>
  );
}

window.addEventListener("load", () => {
  anura.import("anura.filepicker").then((picker: any) => {
    document.body.appendChild(<App picker={picker} />);
  });
});
