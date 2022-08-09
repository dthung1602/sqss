UPDATE styles
    JOIN styles AS ancestor1 ON IS_ANCESTOR(ancestor1.node, node) = true
    JOIN styles AS ancestor2 ON IS_ANCESTOR(ancestor2.node, ancestor1.node) = true
    SET "background" = 'blue',
        "color" = 'white'
WHERE class = 'inside'
  AND ancestor1.class = 'middle'
  AND ancestor2.class = 'outside';