export const externalProviders={ChatGPT:'https://chatgpt.com/',Gemini:'https://gemini.google.com/',Copilot:'https://copilot.microsoft.com/'} as const;
export type ExternalProvider=keyof typeof externalProviders;
export async function copyAndOpen(text:string,provider:ExternalProvider){await navigator.clipboard.writeText(text);window.open(externalProviders[provider],'_blank','noopener,noreferrer');}
