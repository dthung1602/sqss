UPDATE styles
SET "background" = 'red'
WHERE element = 'h3' AND id = 'target' AND class = 'center'
  OR class = 'page-title' AND "::before" = TRUE
  OR "[title]" = 'some text'
  OR ":hover" = TRUE
  OR IS_LAST_CHILD(node) = TRUE AND IS_NTH_CHILD(node, 4) = TRUE;

UPDATE styles
SET "background" = 'yellow'
WHERE (element = 'h3' OR id = 'target') AND class = 'center'
   OR (class = 'page-title')
   OR ("::before" = TRUE OR "[title]" = 'some text' AND ":hover" = TRUE);

UPDATE styles
SET "background" = 'green'
WHERE (element = 'h3' OR id = 'target') AND class = 'center' AND class = 'page-title'
   OR (("::before" = TRUE OR "[title]" = 'some text') AND (":hover" = TRUE));

UPDATE styles
SET "background" = 'blue'
WHERE element = 'h3' AND (id = 'target' OR class = 'center')
   AND (class = 'page-title' OR "::before" = TRUE OR "[title]" = 'some text')
   OR ":hover" = TRUE;
