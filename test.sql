UPDATE styles
    JOIN styles AS ancestor1 ON IS_ANCESTOR(ancestor1.node, node) = true
    JOIN styles AS ancestor2 ON IS_ANCESTOR(ancestor2.node, ancestor1.node) = true
    JOIN styles AS prt ON IS_PARENT(prt.node, ancestor2.node) = true
    SET "background" = 'red',
        "color" = 'red'
WHERE class = 'inside'
  AND ancestor2.class = 'outside'
  AND ancestor1.class = 'middle'
  AND prt.id = 'my_id'
  AND IS_FIRST_CHILD(ancestor1.node) = true;

UPDATE styles
    JOIN styles AS prt ON IS_PARENT(prt.node, node) = true
    SET "background" = 'yellow',
        "color" = 'yellow'
WHERE class = 'inside'
  AND prt.class = 'outside';

UPDATE styles
    JOIN styles AS pre ON IS_PREV(pre.node, node) = true
    SET "background" = 'green',
        "color" = 'green'
WHERE class = 'target'
  AND pre.class = 'before';

UPDATE styles
    JOIN styles AS pre ON COMES_BEFORE(pre.node, node) = true
    SET "background" = 'blue',
        "color" = 'blue'
WHERE class = 'target'
  AND pre.class = 'before';