UPDATE styles
SET "background" = 'red'
WHERE element = 'h3'
  AND id = 'target'
  AND class = 'center'
  AND class = 'page-title'
  AND "::before" = TRUE
  AND "[title]" = 'some text'
  AND ":hover" = TRUE;

UPDATE styles
SET "background" = 'orangered'
WHERE ":hover" = TRUE
  AND "[title]" = 'some text'
  AND class = 'center'
  AND "::before" = TRUE
  AND id = 'target'
  AND element = 'h3'
  AND class = 'page-title';

UPDATE styles
SET "background" = 'orange'
WHERE element = 'h3'
  AND id = 'target'
  AND (class = 'center' AND class = 'page-title')
  AND "::before" = TRUE
  AND ("[title]" = 'some text' AND ":hover" = TRUE);

UPDATE styles
SET "background" = 'red'
WHERE (element = 'h3');

UPDATE styles
SET "background" = 'red'
WHERE (element = 'h3' and class = 'center');

UPDATE styles
SET "background" = 'red'
WHERE (element = 'h3' and class = 'center') and id = 'target';

UPDATE styles
SET "background" = 'red'
WHERE (element = 'h3' and class = 'center') and (id = 'target' and class = 'page-title');
