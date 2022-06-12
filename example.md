# Syntax SqSS

---------

### 1. Basic select

```sql
UPDATE styles
SET "background"  = 'blue',
    "color"       = 'white',
    "font-family" = '"Droid Sans", serif'
WHERE id = 'target';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE class = 'target';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE element = 'div'

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
```

```css
#target {
    background: blue;
    color: white;
    font-family: "Droid Sans", serif
}

.target {
    background: blue;
    color: white;
}

div {
    background: blue;
    color: white;
}

* {
    background: blue;
    color: white;
}
```

### 2. Select by attribute

```sql
UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" IS NOT NULL

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" = 'help test'

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" LIKE '%help test'

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" LIKE 'help test%'

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" LIKE '%help test%'
```

```css
[title] {
    background: blue;
    color: white;
}

[title='help test'] {
    background: blue;
    color: white;
}

[title^='help test'] {
    background: blue;
    color: white;
}

[title$='help test'] {
    background: blue;
    color: white;
}

[title*='%help test%'] {
    background: blue;
    color: white;
}
```

### 3. Select by :, ::

```sql
UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE ":hover" = TRUE

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "::after" = TRUE
```

```css
:hover {
    background: blue;
    color: white;
}

::after {
    background: blue;
    color: white;
}
```

### 4. n-th child, fist child, last child

```sql
UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE NthChild(node, 2) == TRUE

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE FirstChild(node) == TRUE

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE LastChild(node) == TRUE
```

```css
:nth-child(2) {
    background: blue;
    color: white;
}

:first-child() {
    background: blue;
    color: white;
}

:last-child() {
    background: blue;
    color: white;
}
```

### 5. Multiple classes

 ```sql
UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE INCLUDE(class, 'target', 'another', 'yet-another')
```

```css
.target.another.yet-another {
    background: blue;
    color: white;
}
```

### 6. Or

```sql
UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE element = 'a'
   OR class = 'target'
```

```css
a, .target {
    background: blue;
    color: white;
}
```

### 7. Combine

```sql
UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE element = 'a'
  AND INCLUDE(class, 'target', 'another', 'yet-another')
  AND "[href]" != '/'
AND ":hover" = TRUE
```

```css
a.target.another.yet-another:not([href='/']):hover {
    background: blue;
    color: white;
}
```

### 8. Descendant, child, immediate precede, precede

```sql
UPDATE styles
    JOIN styles AS ancestor1 ON ANY(ANCESTORS(node)) = ancestor1.node
    JOIN styles AS ancestor2 ON ANY(ANCESTORS(ancestor1.node)) = ancestor2.node
SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'inside'
  AND ancestor1.class = 'middle'
  AND ancestor2.class = 'outside'

UPDATE styles
    JOIN styles AS prt ON PARENT(node) = prt.node
SET "background" = 'blue',
    "color" = 'white'
WHERE class = 'inside'
  AND prt.class = 'outside'

UPDATE styles
    JOIN styles AS pre ON NEXT(pre.node) = node
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'target'
  AND pre.class = 'before'

UPDATE styles
    JOIN styles AS pre ON ANY(NEXTS(pre.node)) = node
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'target'
  AND pre.class = 'before'
```

```css
.outside .middle .inside {
    background: blue;
    color: white;
}

.outside > .inside {
    background: blue;
    color: white;
}

.before + .target {
    background: blue;
    color: white;
}

.before ~ .target {
    background: blue;
    color: white;
}
```
