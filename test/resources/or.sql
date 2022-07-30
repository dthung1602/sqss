UPDATE styles
SET "background" = 'red'
WHERE element = 'h3'
  OR id = 'target'
  OR class = 'center'
  OR class = 'page-title'
  OR "::before" = TRUE
  OR "[title]" = 'some text'
  OR ":hover" = TRUE;

UPDATE styles
SET "background" = 'orangered'
WHERE ":hover" = TRUE
  OR "[title]" = 'some text'
  OR class = 'center'
  OR "::before" = TRUE
  OR id = 'target'
  OR element = 'h3'
  OR class = 'page-title';

UPDATE styles
SET "background" = 'orange'
WHERE element = 'h3'
  OR id = 'target'
  OR (class = 'center' OR class = 'page-title')
  OR "::before" = TRUE
  OR ("[title]" = 'some text' OR ":hover" = TRUE);

UPDATE styles
SET "background" = 'red'
WHERE (element = 'h3');

UPDATE styles
SET "background" = 'red'
WHERE (element = 'h3' OR class = 'center');

UPDATE styles
SET "background" = 'red'
WHERE (element = 'h3' OR class = 'center') OR id = 'target';

UPDATE styles
SET "background" = 'red'
WHERE (element = 'h3' OR class = 'center') OR (id = 'target' OR class = 'page-title');
