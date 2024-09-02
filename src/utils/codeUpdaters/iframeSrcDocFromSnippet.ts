type Args = {
  inputHtml: string;
  iframeSrc: string;
  iframeSrcDoc: string;
};

export default function updateIframeSrcDocFromSnippet({
  inputHtml,
  iframeSrc,
  iframeSrcDoc,
}: Args): string {
  const newInputHtml = inputHtml.replace(
    `<iframe src="${iframeSrc}"`,
    `<iframe srcdoc="${iframeSrcDoc.trim()}"`
  );
  return newInputHtml;
}
