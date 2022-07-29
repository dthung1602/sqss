UPDATE styles
SET "background"  = 'red'
WHERE ":hover" = true;

UPDATE styles
SET "background"  = 'orange'
WHERE ":hover" != true;

UPDATE styles
SET "background"  = 'yellow'
WHERE ":hover" = FALSE;

UPDATE styles
SET "background"  = 'yellowgreen'
WHERE ":hover" != false;

UPDATE styles
SET "background"  = 'green'
WHERE ":hover" IS TRUE;

UPDATE styles
SET "background"  = 'cyan'
WHERE ":hover" IS NOT TRUE;

UPDATE styles
SET "background"  = 'blue'
WHERE ":hover" IS false;

UPDATE styles
SET "background"  = 'purple'
WHERE ":hover" IS NOT false;