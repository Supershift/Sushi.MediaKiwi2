import { LinkMetaData } from "@/models/options/LinkMetaData";

/** Creates an Axios client with the specified base url, application/json as content type and authorization header added when an active account is found. */
export function createLinksFromMetaData(links: Array<LinkMetaData>): void {
  const linkStrings = loadLinks(links);
  const head = document.getElementsByTagName("head")[0];
  linkStrings.forEach((linkString: string) => {
    const linkElement = document.createElement("link");
    linkElement.innerHTML = linkString;
    head.appendChild(linkElement);
  });
}

/** Creates link strings based on the array of link metadata */
function loadLinks(links: Array<LinkMetaData>): Array<string> {
  const linkStrings = links.map((link: LinkMetaData) => {
    if (link.crossorigin) {
      return `<link rel="${link.rel}" ${link.type ? "type=" + link.type : ""} href="${link.href}" crossorigin>`;
    }
    return `<link rel="${link.rel}" ${link.type ? "type=" + link.type : ""}  href="${link.href}">`;
  });
  return linkStrings;
}
