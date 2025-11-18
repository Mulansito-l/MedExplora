import React, { useEffect } from "react";
import styles from "./FormattedText.module.css";

interface FormattedTextProps {
  text: string;
  onInternalLinkClick?: (slug: string) => void;
}

/**
 * Parser Markdown extendido con soporte para enlaces internos por slug
 * y ==slug== para enlaces clickeables
 */
export default function FormattedText({
  text,
  onInternalLinkClick,
}: FormattedTextProps) {
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      const slugLink = target.closest(".slug-link");

      // Manejar enlaces markdown [texto](slug)
      if (link && link.href && onInternalLinkClick) {
        const href = link.getAttribute("href") || "";

        // Solo procesar si es un enlace interno (NO http, https, #)
        if (
          !href.startsWith("http") &&
          !href.startsWith("https") &&
          !href.startsWith("#") &&
          href.trim() !== ""
        ) {
          e.preventDefault();
          e.stopPropagation();

          // El href es directamente el slug
          const slug = href.trim();
          console.log("Slug detectado:", slug);
          onInternalLinkClick(slug);
        }
        // Los enlaces externos (http/https) y anclas (#) se comportan normalmente
      }

      // Manejar enlaces ==slug==
      if (slugLink && onInternalLinkClick) {
        e.preventDefault();
        e.stopPropagation();

        const slug = slugLink.getAttribute("data-slug");
        if (slug) {
          console.log("Slug detectado (== ==):", slug);
          onInternalLinkClick(slug);
        }
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, [onInternalLinkClick]);

  const parseMarkdown = (input: string): string => {
    let html = input;

    // --- NUEVO: ENLACES ==slug== ---
    // Convierte ==ojosinfo== en un span clickeable
    html = html.replace(
      /==(.*?)==/gim,
      '<span class="slug-link" data-slug="$1" style="color: blue; text-decoration: underline; cursor: pointer;">$1</span>'
    );

    // --- BLOQUES DE CÓDIGO ---
    html = html.replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>");

    // --- CÓDIGO INLINE ---
    html = html.replace(/`([^`]+)`/gim, "<code>$1</code>");

    // --- ENCABEZADOS ---
    html = html
      .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
      .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
      .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // --- FORMATO DE TEXTO ---
    html = html
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/_([^_]+)_/gim, "<em>$1</em>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/__(.*?)__/gim, "<u>$1</u>")
      .replace(/~~(.*?)~~/gim, "<s>$1</s>");

    // --- CITAS ---
    html = html.replace(/^\s*>\s*(.*$)/gim, "<blockquote>$1</blockquote>");

    // --- LISTAS ORDENADAS ---
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, "<ol><li>$1</li></ol>");
    // --- LISTAS NO ORDENADAS ---
    html = html.replace(/^\s*[-*•]\s+(.*$)/gim, "<ul><li>$1</li></ul>");

    // --- IMÁGENES ---
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/gim,
      `<img src="$2" alt="$1" class="markdown-img" />`
    );

    // --- AUDIO ---
    html = html.replace(
      /!audio\((.*?)\)/gim,
      `<audio controls class="markdown-audio">
        <source src="$1" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>`
    );

    // --- VIDEO ---
    html = html.replace(
      /!video\((.*?)\)/gim,
      `<video controls class="markdown-video">
        <source src="$1" type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>`
    );

    // --- ENLACES ---
    // Enlaces externos: [texto](https://url)
    html = html.replace(
      /(?<!!)\[(.*?)\]\((https?:\/\/[^\s)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="external-link">$1</a>'
    );

    // Enlaces internos por slug: [texto](slug-del-articulo)
    html = html.replace(
      /(?<!!)\[(.*?)\]\(([^#\s)]+)\)/gim,
      (match, linkText, href) => {
        // Si NO es una URL externa y NO es un ancla, es un enlace interno
        if (
          !href.startsWith("http") &&
          !href.startsWith("https") &&
          !href.startsWith("#") &&
          href.trim() !== ""
        ) {
          return `<a href="${href}" class="internal-link" data-slug="${href}">${linkText}</a>`;
        }
        return match;
      }
    );

    // --- LIMPIEZA DE LISTAS REPETIDAS ---
    html = html.replace(/<\/ul>\s*<ul>/g, "");
    html = html.replace(/<\/ol>\s*<ol>/g, "");

    // --- SALTOS DE LÍNEA ---
    html = html.replace(/\n{2,}/g, "<br /><br />");

    return html.trim();
  };

  return (
    <div
      className={styles.formattedText}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }}
    />
  );
}
