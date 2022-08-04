UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE IS_NTH_LAST_CHILD(node, 2) != FALSE and IS_FIRST_CHILD(node) = false;
