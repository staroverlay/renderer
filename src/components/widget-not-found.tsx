export default function WidgetNotFound() {
  return (
    <div
      style={{
        background: "black",
        color: " white",
        padding: "10px 20px",
        borderRadius: "10px",
      }}
    >
      <h1 style={{ color: "red" }}>Error</h1>
      <p>
        The requested item does not exist. It is possible that it has been
        removed or its token has been refreshed.
      </p>
      <p>
        To fix this issue, visit{" "}
        <span style={{ color: "cyan" }}>https://app.staroverlay.com/</span> and
        copy the new widget URL to the current feed.
      </p>
    </div>
  );
}
