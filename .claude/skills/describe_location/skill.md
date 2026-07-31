# Content Creator Skill: Structured Location Guides in HTML

This document outlines the professional framework and technical standards for generating high-quality, SEO-optimized, and visually scannable location or city guides wrapped in clean HTML code blocks.

---

## 1. Editorial & Content Framework

Every location description must maintain high information density, factual accuracy, and strict universal accessibility. Vague adjectives (e.g., "cheap", "beautiful") must be avoided in favor of precise, actionable data.

### Structural Requirements
1. **Direct Summary (Lead Paragraph):** Start with an authoritative, 2-to-3 sentence introductory overview of the location. Detail its geopolitical standing, primary geographical features, historical foundation context, and cultural significance.
2. **Thematic Consistency:** Maintain an objective, informative, and engaging tone appropriate for historical, cultural, or travel encyclopedias.
3. **Curated POIs (Points of Interest):** Select and list the most prominent urban or historical attractions. Exclude distant municipal surroundings unless explicitly requested.

### Data Points per POI
For every point of interest included in the guide, you must explicitly integrate the following trust markers:
- **Historical Markers:** Exact building dates, centuries, or commissioning rulers.
- **Architectural Style:** Architectural schools, construction layouts, or material metadata (e.g., "monolithic reinforced concrete", "slated silver-gray schist").
- **Cultural Value:** Local folklore, religious weight, unique technical features, or UNESCO protection status.

---

## 2. HTML Architecture & Technical Standards

The output must be wrapped in a single, fully valid, self-contained `html` code block. This allows the end-user to easily view, preview, or copy-paste it directly into any modern Content Management System (CMS).

### Boilerplate Configuration
- **Document Type Declaration:** Always include `<!DOCTYPE html>`.
- **Language Attribute:** Match the targeted user interface language (e.g., `<html lang="uk">`).
- **Character Encoding:** Enforce `<meta charset="UTF-8">` to ensure special Eastern European, Cyrillic, or Balkan diacritics render perfectly.
- **Responsive Viewport:** Use `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.

### Typography & Document Outline
- **Main Heading (`<h1>`):** Reserved exclusively for the primary city or location name.
- **Section Heading (`<h2>`):** Used precisely for grouping list sections (e.g., "Головні визначні місця...").
- **Emphasis Rules:** Inside each list item, wrap the attraction name in `<strong>...</strong>` followed by a colon. 

---

## 3. Design & Inline CSS Specifications

To guarantee excellent readability and direct utility, a embedded CSS layout block must be included inside the `<head>`. Use clean, universally compatible CSS rules.

```css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 20px auto;
    padding: 0 20px;
}
h1 {
    color: #2c3e50;
    border-bottom: 2px solid #2c3e50;
    padding-bottom: 10px;
    margin-top: 40px;
}
h2 {
    color: #34495e;
    margin-top: 25px;
}
ul {
    padding-left: 20px;
}
li {
    margin-bottom: 12px;
}
strong {
    color: #16a085;
}
```

---

## 4. Layout Template (Blueprint)

Below is the standard structural layout template to emulate when writing a destination guide response block:

```html
<!DOCTYPE html>
<html lang="[LANG]">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Location Name] Guide</title>
    <style>
        /* Insert the standard CSS block here */
    </style>
</head>
<body>

    <!-- PRIMARY LOCATION SUMMARY -->
    <h1>[Location Name]</h1>
    <p><strong>[Location Name]</strong> is [2-3 sentences outlining geolocation, history, culture, and key facts].</p>

    <!-- POINTS OF INTEREST -->
    <h2>[Section Title]</h2>
    <ul>
        <li><strong>[POI Name]:</strong> [Comprehensive description including style, historical timeline, and cultural facts].</li>
        <li><strong>[POI Name]:</strong> [Comprehensive description including style, historical timeline, and cultural facts].</li>
    </ul>

</body>
</html>
```
