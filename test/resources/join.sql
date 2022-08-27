-- Simple single join

UPDATE styles
    JOIN styles AS ancestor ON IS_ANCESTOR(ancestor.node, node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'inside'
  AND ancestor.class = 'outside';

UPDATE styles
    JOIN styles AS prt ON IS_PARENT(prt.node, node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'inside'
  AND prt.class = 'outside';

UPDATE styles
    JOIN styles AS pre ON IS_PREV(pre.node, node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'target'
  AND pre.class = 'before';

UPDATE styles
    JOIN styles AS pre ON COMES_BEFORE(pre.node, node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'target'
  AND pre.class = 'before';

-- Multiple style updates per group

UPDATE styles
    JOIN styles AS ancestor ON IS_ANCESTOR(ancestor.node, node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'inside'
  AND ancestor.class = 'outside' -- ancestor
  AND styles.id = 'my_id'
  AND "ancestor.[href]" = 'abc' -- ancestor
  AND element = 'h1'
  AND ":hover" = true
  AND "::after" is not false
  AND IS_FIRST_CHILD(node) = true
  AND IS_LAST_CHILD(node) = false
  AND IS_NTH_CHILD(ancestor.node, 3) = true -- ancestor
  AND IS_NTH_LAST_CHILD(ancestor.node, 2) = false -- ancestor
  AND "styles.[title]" is not null
  AND "styles.[href]" like '%abc'
  AND "styles.[src]" not like 'xyz%'
  AND "ancestor.[title]" like '%xyz%'; -- ancestor

-- Multiple joins same type

UPDATE styles
    JOIN styles AS ancestor1 ON IS_ANCESTOR(ancestor1.node, node) = true
    JOIN styles AS ancestor2 ON IS_ANCESTOR(ancestor2.node, ancestor1.node) = true
    JOIN styles AS ancestor3 ON IS_ANCESTOR(ancestor3.node, ancestor2.node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'inside'
  AND ancestor3.class = 'outermost'
  AND ancestor2.class = 'outside'
  AND ancestor1.class = 'middle';

UPDATE styles
    JOIN styles AS prt ON IS_PARENT(prt.node, node) = true
    JOIN styles AS gprt ON IS_PARENT(gprt.node, prt.node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'inside'
  AND prt.class = 'outside'
  AND gprt.class = 'outermost';

UPDATE styles
    JOIN styles AS pre ON IS_PREV(pre.node, node) = true
    JOIN styles AS ppre ON IS_PREV(ppre.node, pre.node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'target'
  AND pre.class = 'before'
  AND ppre.class = 'first';

UPDATE styles
    JOIN styles AS pre ON COMES_BEFORE(pre.node, node) = true
    JOIN styles AS ppre ON COMES_BEFORE(ppre.node, pre.node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'target'
  AND pre.class = 'before'
  AND ppre.class = 'first';

-- Multiple joins mixed type

UPDATE styles
    JOIN styles AS style1 ON IS_ANCESTOR(style1.node, node) = true
    JOIN styles AS style2 ON IS_PARENT(style2.node, style1.node) = true
    JOIN styles AS style3 ON IS_PREV(style3.node, style2.node) = true
    JOIN styles AS style4 ON COMES_BEFORE(style4.node, style3.node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'inside'
  AND style1.class = 'outside1'
  AND style2.id = 'outside2'
  AND style3.element = 'div'
  AND "style4.[title]" IS NOT NULL;

UPDATE styles
    JOIN styles AS style1 ON IS_ANCESTOR(style1.node, node) = true
    JOIN styles AS style2 ON IS_PARENT(style2.node, style1.node) = true
    JOIN styles AS style3 ON IS_PREV(style3.node, style2.node) = true
    JOIN styles AS style4 ON COMES_BEFORE(style4.node, style3.node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE style3.element = 'div'
  AND (class = 'inside'
  AND "style4.[title]" IS NOT NULL)
  AND (style1.class = 'outside1'
  AND style2.id = 'outside2');

-- Multiple joins without style

UPDATE styles
    JOIN styles AS style1 ON IS_ANCESTOR(style1.node, node) = true
    JOIN styles AS style2 ON IS_PARENT(style2.node, style1.node) = true
    JOIN styles AS style3 ON IS_PREV(style3.node, style2.node) = true
    JOIN styles AS style4 ON COMES_BEFORE(style4.node, style3.node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'inside'
  AND style1.class = 'outside1'
  AND "style4.[title]" IS NOT NULL;

UPDATE styles
    JOIN styles AS style1 ON IS_ANCESTOR(style1.node, node) = true
    JOIN styles AS style2 ON IS_PARENT(style2.node, style1.node) = true
    JOIN styles AS style3 ON IS_PREV(style3.node, style2.node) = true
    JOIN styles AS style4 ON COMES_BEFORE(style4.node, style3.node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE style1.class = 'outside1'
  AND style2.id = 'outside2'
  AND style3.element = 'div';

UPDATE styles
    JOIN styles AS style1 ON IS_ANCESTOR(style1.node, node) = true
    JOIN styles AS style2 ON IS_PARENT(style2.node, style1.node) = true
    JOIN styles AS style3 ON IS_PREV(style3.node, style2.node) = true
    JOIN styles AS style4 ON COMES_BEFORE(style4.node, style3.node) = true
    SET "background" = 'blue',
        "color" = 'white';