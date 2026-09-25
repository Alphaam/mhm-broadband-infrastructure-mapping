import fs from "node:fs"
import path from "node:path"
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from "docx"

const SRC = path.resolve("docs/knowledge-transfer-and-maintenance-memo.md")
const OUT = path.resolve("docs/knowledge-transfer-and-maintenance-memo.docx")

const raw = fs.readFileSync(SRC, "utf8")
const lines = raw.split("\n")

const NAVY = "1F3A5F"
const GRAY = "444444"
const LIGHT = "EDF1F5"

// Parse inline markdown (bold/italic) into TextRuns
function parseInline(text, base = {}) {
  const runs = []
  // tokenize on ** and *
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let m
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: text.slice(last, m.index), ...base }))
    }
    const tok = m[0]
    if (tok.startsWith("**")) {
      runs.push(new TextRun({ text: tok.slice(2, -2), bold: true, ...base }))
    } else {
      runs.push(new TextRun({ text: tok.slice(1, -1), italics: true, ...base }))
    }
    last = regex.lastIndex
  }
  if (last < text.length) {
    runs.push(new TextRun({ text: text.slice(last), ...base }))
  }
  if (runs.length === 0) runs.push(new TextRun({ text: "", ...base }))
  return runs
}

function noBorderCell(children, opts = {}) {
  return new TableCell({
    children,
    shading: opts.shading ? { fill: opts.shading } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  })
}

const children = []
let i = 0

function flushTable(startIndex) {
  // collect consecutive table lines
  const tbl = []
  let j = startIndex
  while (j < lines.length && lines[j].trim().startsWith("|")) {
    tbl.push(lines[j].trim())
    j++
  }
  // tbl[0] header, tbl[1] separator, rest rows
  const parseRow = (line) =>
    line
      .slice(1, line.endsWith("|") ? -1 : undefined)
      .split("|")
      .map((c) => c.trim())

  const header = parseRow(tbl[0])
  const bodyRows = tbl.slice(2).map(parseRow)

  const rows = []
  rows.push(
    new TableRow({
      tableHeader: true,
      children: header.map(
        (c) =>
          noBorderCell(
            [new Paragraph({ children: parseInline(c, { bold: true, color: "FFFFFF" }) })],
            { shading: NAVY },
          ),
      ),
    }),
  )
  bodyRows.forEach((r, idx) => {
    rows.push(
      new TableRow({
        children: r.map((c) =>
          noBorderCell([new Paragraph({ children: parseInline(c) })], {
            shading: idx % 2 === 0 ? "FFFFFF" : LIGHT,
          }),
        ),
      }),
    )
  })

  const border = { style: BorderStyle.SINGLE, size: 2, color: "C9D4DF" }
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: border,
        bottom: border,
        left: border,
        right: border,
        insideHorizontal: border,
        insideVertical: border,
      },
      rows,
    }),
  )
  children.push(new Paragraph({ spacing: { after: 120 } }))
  return j
}

while (i < lines.length) {
  const line = lines[i]
  const trimmed = line.trim()

  if (trimmed === "") {
    i++
    continue
  }

  // horizontal rule
  if (trimmed === "---") {
    children.push(
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "C9D4DF", space: 1 } },
        spacing: { after: 160, before: 40 },
      }),
    )
    i++
    continue
  }

  // tables
  if (trimmed.startsWith("|")) {
    i = flushTable(i)
    continue
  }

  // headings
  if (trimmed.startsWith("#### ")) {
    children.push(
      new Paragraph({
        children: parseInline(trimmed.slice(5), { bold: true, color: NAVY }),
        spacing: { before: 160, after: 60 },
      }),
    )
    i++
    continue
  }
  if (trimmed.startsWith("### ")) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: parseInline(trimmed.slice(4), { color: NAVY }),
        spacing: { before: 200, after: 80 },
      }),
    )
    i++
    continue
  }
  if (trimmed.startsWith("## ")) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: parseInline(trimmed.slice(3), { color: NAVY }),
        spacing: { before: 280, after: 100 },
      }),
    )
    i++
    continue
  }
  if (trimmed.startsWith("# ")) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: parseInline(trimmed.slice(2), { color: NAVY }),
        spacing: { after: 200 },
      }),
    )
    i++
    continue
  }

  // blockquote
  if (trimmed.startsWith("> ")) {
    children.push(
      new Paragraph({
        children: parseInline(trimmed.slice(2), { color: GRAY }),
        indent: { left: 360 },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: NAVY, space: 12 } },
        shading: { fill: LIGHT },
        spacing: { before: 80, after: 80 },
      }),
    )
    i++
    continue
  }

  // nested bullet
  if (line.startsWith("  - ") || line.startsWith("    - ")) {
    children.push(
      new Paragraph({
        children: parseInline(trimmed.slice(2)),
        bullet: { level: 1 },
        spacing: { after: 40 },
      }),
    )
    i++
    continue
  }

  // bullet
  if (trimmed.startsWith("- ")) {
    children.push(
      new Paragraph({
        children: parseInline(trimmed.slice(2)),
        bullet: { level: 0 },
        spacing: { after: 40 },
      }),
    )
    i++
    continue
  }

  // numbered list
  const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
  if (numMatch) {
    children.push(
      new Paragraph({
        children: parseInline(numMatch[2]),
        numbering: { reference: "memo-numbered", level: 0 },
        spacing: { after: 40 },
      }),
    )
    i++
    continue
  }

  // normal paragraph
  children.push(
    new Paragraph({
      children: parseInline(trimmed),
      spacing: { after: 120, line: 276 },
    }),
  )
  i++
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "memo-numbered",
        levels: [
          {
            level: 0,
            format: "decimal",
            text: "%1.",
            alignment: AlignmentType.START,
            style: { paragraph: { indent: { left: 460, hanging: 260 } } },
          },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22, color: "222222" },
      },
    },
  },
  sections: [
    {
      properties: {
        page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } },
      },
      children,
    },
  ],
})

const buffer = await Packer.toBuffer(doc)
fs.writeFileSync(OUT, buffer)
console.log("[v0] wrote", OUT, buffer.length, "bytes")
