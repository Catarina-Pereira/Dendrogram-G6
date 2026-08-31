import { Graph } from "@antv/g6"

export async function exportGraphImage(graph: Graph | null): Promise<void> {

  if (!graph) return;

  const dataURL = await graph.toDataURL();
  const [head, content] = dataURL.split(",");
  const contentType = head.match(/:(.*?);/)![1];

  const bstr = atob(content);
  let length = bstr.length;
  const u8arr = new Uint8Array(length);

  while (length--) {
    u8arr[length] = bstr.charCodeAt(length);
  }

  const date = new Date();
  const newDate = date.toLocaleString();

  const blob = new Blob([u8arr], { type: contentType });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dendogram-${newDate}.png`;
  a.click();

}
