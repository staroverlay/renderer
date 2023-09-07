import React, { ComponentProps, useEffect, useRef } from "react";

export interface InnerHTMLProps extends ComponentProps<"div"> {
  html: string;
}

export default function InnerHTML({
  html,
  dangerouslySetInnerHTML,
  ...props
}: InnerHTMLProps) {
  // We remove 'dangerouslySetInnerHTML' from props passed to the div
  const divRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!html || !divRef.current) throw new Error("html prop cant't be null");
    if (!isFirstRender.current) return;
    isFirstRender.current = false;

    const slotHtml = document.createRange().createContextualFragment(html); // Create a 'tiny' document and parse the html string
    divRef.current.innerHTML = ""; // Clear the container
    divRef.current.appendChild(slotHtml); // Append the new content
  }, [html, divRef]);

  // eslint-disable-next-line react/react-in-jsx-scope
  return <div {...props} ref={divRef} />;
}
