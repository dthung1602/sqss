-- first child

UPDATE styles
SET "background"  = 'blue'
WHERE is_first_child(node) = true;

UPDATE styles
SET "background"  = 'blue'
WHERE IS_FIRST_CHILD(node) = true;

UPDATE styles
SET "background"  = 'blue'
WHERE IS_FIRST_CHILD(node) = false;

UPDATE styles
SET "background"  = 'blue'
WHERE IS_FIRST_CHILD(node) != true;

UPDATE styles
SET "background"  = 'blue'
WHERE IS_FIRST_CHILD(node) != false;

-- first child with IS

UPDATE styles
SET "background"  = 'blue'
WHERE is_first_child(node) IS TRUE;

UPDATE styles
SET "background"  = 'blue'
WHERE is_first_child(node) IS FALSE;

UPDATE styles
SET "background"  = 'blue'
WHERE is_first_child(node) IS NOT TRUE;

UPDATE styles
SET "background"  = 'blue'
WHERE is_first_child(node) IS NOT FALSE;

--last child

UPDATE styles
SET "background"  = 'blue'
WHERE IS_LAST_CHILD(node) = true;

UPDATE styles
SET "background"  = 'blue'
WHERE IS_LAST_CHILD(node) = false;

--nth child

UPDATE styles
SET "background"  = 'blue'
WHERE IS_NTH_CHILD(node, 3) = true;

UPDATE styles
SET "background"  = 'blue'
WHERE IS_NTH_CHILD(node, 3) != true;

--nth last child

UPDATE styles
SET "background"  = 'blue'
WHERE IS_NTH_LAST_CHILD(node, 2) = true;

UPDATE styles
SET "background"  = 'blue'
WHERE IS_NTH_LAST_CHILD(node, 2) != true;