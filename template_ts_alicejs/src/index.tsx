function App(this: { browser: any; url: string }) {
  return (
    <div>
      <h1>Anura TypeScript Example</h1>
      <button on:click={() => this.browser.openTab(this.url)}>
        Open <a href={this.url}>Google</a>
      </button>
    </div>
  );
}

window.addEventListener("load", () => {
  anura.import("anura.libbrowser").then((browser: any) => {
    document.body.appendChild(
      <App browser={browser} url="https://www.google.com/" />
    );
  });
});
