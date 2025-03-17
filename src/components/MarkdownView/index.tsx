/**
 * @name MarkdownView
 * @description
 * @author darcrand
 */

'use client'

import { useAsyncEffect } from 'ahooks'
import hljs from 'highlight.js'
import 'highlight.js/styles/an-old-hope.css'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import { useState } from 'react'
import './theme.css'

const marked = new Marked(
  { async: true, breaks: true },
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

export default function MarkdownView(props: { children?: string }) {
  const [content, setContent] = useState('')

  useAsyncEffect(async () => {
    const html = await marked.parse(props.children || '')
    setContent(html)
  }, [props.children])

  return <div className='markdown-content' dangerouslySetInnerHTML={{ __html: content }}></div>
}
