import React from "react";
import styles from "./FormattedText.module.css";

interface FormattedTextProps {
  text: string;
}

/**
 * Parser Markdown extendido:
 * - Encabezados (#)
 * - Negrita, cursiva, subrayado, tachado
 * - Listas, citas, código
 * - Imágenes (![alt](url))
 * - Audio (!audio(url))
 * - Video (!video(url))
 * - Enlaces [texto](https://...)
 */
export default function FormattedText({ text }: FormattedTextProps) {
  const parseMarkdown = (input: string): string => {
    let html = input;

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
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>") // **negrita**
      .replace(/_([^_]+)_/gim, "<em>$1</em>") // _cursiva_
      .replace(/\*(.*?)\*/gim, "<em>$1</em>") // *cursiva*
      .replace(/__(.*?)__/gim, "<u>$1</u>") // __subrayado__
      .replace(/~~(.*?)~~/gim, "<s>$1</s>"); // ~~tachado~~

    // --- CITAS ---
    html = html.replace(/^\s*>\s*(.*$)/gim, "<blockquote>$1</blockquote>");

    // --- LISTAS ORDENADAS ---
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, "<ol><li>$1</li></ol>");
    // --- LISTAS NO ORDENADAS ---
    html = html.replace(/^\s*[-*•]\s+(.*$)/gim, "<ul><li>$1</li></ul>");

    // --- IMÁGENES ---
    // Detecta: ![texto](url)
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/gim,
      `<img src="$2" alt="$1" class="markdown-img" />`
    );

    // --- AUDIO ---
    // Detecta: !audio(/uploads/audio.mp3)
    html = html.replace(
      /!audio\((.*?)\)/gim,
      `<audio controls class="markdown-audio">
        <source src="$1" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>`
    );

    // --- VIDEO ---
    // Detecta: !video(/uploads/video.mp4)
    html = html.replace(
      /!video\((.*?)\)/gim,
      `<video controls class="markdown-video">
        <source src="$1" type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>`
    );

    // --- ENLACES ---
    // Detecta: [texto](https://url)
    // El (?<!!) evita interferir con ![imagen](url)
    html = html.replace(
      /(?<!!)\[(.*?)\]\((https?:\/\/[^\s)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
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
